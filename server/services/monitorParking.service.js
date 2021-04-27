const mongoose = require("mongoose");
const db = require("../models");
const MonitorParking = db.monitorParking;
const Parking = db.parking;

createNewMonitor = async (ownerId, parkingId) => {
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
            ownerId: mongoose.Types.ObjectId(ownerId),
      };
      let res = await Parking.find(filter);
      if (res.length === 0) {
            return {message: "Can't create new monitor because ownerId and ParkingId did not match", status: false };
      }else{
            let result = await MonitorParking.create({
                  ownerId,
                  parkingId,
            });
      
            return { result, status: true };
      }
};

addComingVehicle = async (ownerId, parkingId, userId, vehicleId, comingTime) => {
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      // xét xem đã có monitor trong collection hay chưa
      let res = await MonitorParking.find(filter).select("-__v");
      // nếu chưa có thì thếm monitor mới chỉ có ownerID với parkingId
      if (res.length === 0) {
            let response = await createNewMonitor(ownerId, parkingId);
            if (response.status === false) {
                  return {message: response.message, status: false };
            }
      }
      // Đã có monitor trong collection(đã có hoặc đã thêm ở trên)
      // Cần thêm mới isComing (bao gồm những xe đã có + xe có info mới cần thêm vào)
      try {
            let result = await MonitorParking.create({
                  parkingId,
                  userId,
                  content,
                  ratingStar,
            });
            return { result, status: true };
      } catch (error) {
            return { error, status: false };
      }
};

const monitorParkingService = {
      createNewMonitor,
};
module.exports = monitorParkingService;
