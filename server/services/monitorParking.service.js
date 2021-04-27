const mongoose = require("mongoose");
const db = require("../models");
const MonitorParking = db.monitorParking;
const Parking = db.parking;
const Vehicle = db.vehicle;

createNewMonitor = async (ownerId, parkingId) => {
      const filter = {
            ownerId: mongoose.Types.ObjectId(ownerId),
            _id: mongoose.Types.ObjectId(parkingId),
      };
      let res = await Parking.find(filter);
      if (res.length === 0) {
            return { message: "Parking is not true!!", status: false };
      } else {
            let result = await MonitorParking.create({
                  ownerId,
                  parkingId,
            });

            return { result, status: true };
      }
};

addComingVehicle = async (
      ownerId,
      parkingId,
      userId,
      vehicleId,
      comingTime
) => {
      let result;
      // xét xem thông tin xe có chính xác hay không
      try {
            let filter = {
                  ownerId: mongoose.Types.ObjectId(userId),
                  _id: mongoose.Types.ObjectId(vehicleId),
            };
            let res = await Vehicle.find(filter);
            if (res.length === 0) {
                  return (result = {
                        message: 'Vehicle does not exist',
                        status: false,
                  });
            }
      } catch (error) {
            return (result = {
                  message: 'Error',
                  status: false,
            });
      }
      // xét xem đã có monitor trong collection hay chưa
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      let res = await MonitorParking.find(filter);

      // nếu chưa có thì thêm monitor mới chỉ có ownerID với parkingId
      if (res.length === 0) {
            let response = await createNewMonitor(ownerId, parkingId);
            if (response.status === false) {
                  return (result = {
                        message: response.message,
                        status: false,
                  });
            }
      }

      // Đã có monitor trong collection(đã có hoặc đã thêm ở trên)
      // Cần thêm mới isComing (bao gồm những xe đã có + xe có info mới cần thêm vào)
      try {
            // Tìm monitor đã có trong model
            let response = await MonitorParking.find(filter);
            // lấy giá trị mảng isComing cũ + info xe mới
            let listIsComing = response[0].isComing;

            let isComing = {
                  userId: userId,
                  vehicleId: vehicleId,
                  comingTime: comingTime,
            };
            listIsComing = [...listIsComing, isComing];

            // thêm vào model
            await MonitorParking.findOneAndUpdate(
                  { parkingId: mongoose.Types.ObjectId(parkingId) },
                  { isComing: listIsComing },
                  (err, data) => {
                        if (err) {
                              result = { message: err, status: false };
                        }
                        result = {
                              message:
                                    "Add new vehicle to monitor parking successfully",
                              status: true,
                        };
                  }
            );
            return result;
      } catch (error) {
            // console.log('sdfsdf');
            return (result = { error, status: false });
      }
};

showListComingVehicle = async (parkingId) => {
      let result;
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      // xét xem đã có monitor trong collection hay chưa
      let res = await MonitorParking.find(filter);
      if (res.length === 0) {
            return (result = {
                  message: "Parking does not exist",
                  status: false,
            });
      }
      result = { data: res[0].isComing, status: true };
      return result;
};

const monitorParkingService = {
      createNewMonitor,
      addComingVehicle,
      showListComingVehicle,
};
module.exports = monitorParkingService;
