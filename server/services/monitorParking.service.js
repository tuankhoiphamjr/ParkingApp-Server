const mongoose = require("mongoose");
const db = require("../models");
const MonitorParking = db.monitorParking;
const Parking = db.parking;
const Vehicle = db.vehicle;
const User = db.user;
const BookingHistory = db.bookingHistory;

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

// giao diện cần làm để người dùng sau khi nhấn đặt chỗ ko được nhấn đặt chỗ lần nữa
addComingVehicle = async (
      ownerId,
      parkingId,
      userId,
      vehicleId,
      comingTime,
      status
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
                        message: "Vehicle does not exist",
                        status: false,
                  });
            }
      } catch (error) {
            return (result = {
                  message: "Error",
                  status: false,
            });
      }
      // xét xem đã có monitor trong collection hay chưa
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
            ownerId: mongoose.Types.ObjectId(ownerId),
      };
      let response = await MonitorParking.find(filter);

      // nếu chưa có thì trả về false
      if (response.length === 0) {
            return (result = {
                  message: "Monitor does not exist",
                  status: false,
            });
      }
      // Đã có monitor trong collection(đã có hoặc đã thêm ở trên)
      // Cần thêm mới isComing (bao gồm những xe đã có + xe có info mới cần thêm vào)
      try {
            // lấy giá trị mảng isComing cũ + info xe mới
            let listIsComing = response[0].isComing;
            let isComing = {
                  userId: userId,
                  vehicleId: vehicleId,
                  comingTime: comingTime,
                  status: status,
            };
            listIsComing = [...listIsComing, isComing];

            // thêm vào model

            await MonitorParking.findOneAndUpdate(
                  { parkingId: mongoose.Types.ObjectId(parkingId) },
                  { isComing: listIsComing },
                  (err, data) => {
                        if (err) {
                              result = { message: err, status: false };
                        } else {
                              result = {
                                    message:
                                          "Add new vehicle to monitor parking successfully",
                                    status: true,
                              };
                        }
                  }
            );

            let bookingFilter = {
                  vehicleId: mongoose.Types.ObjectId(vehicleId),
                  userId: mongoose.Types.ObjectId(userId),
            };
            let booking = await BookingHistory.findOneAndUpdate(bookingFilter, {
                  parkingBookingId: parkingId,
            });
            if (booking.length === 0) {
                  result = {
                        message: "Add booking fail",
                        status: false,
                  };
            }
            return result;
      } catch (error) {
            // console.log('sdfsdf');
            return (result = { error, status: false });
      }
};

showBookingInfo = async (userId) => {
      let result;
      let parkingId = "";
      const userFilter = {
            userId: mongoose.Types.ObjectId(userId),
      };
      let response = await BookingHistory.find(userFilter);
      if (response.length === 0) {
            return (result = {
                  message: "User does not have booking history",
                  status: false,
            });
      }

      for (let booking of response) {
            if (!booking.parkingBookingId) {
                  continue;
            }
            parkingId = booking.parkingBookingId;
      }
      if (parkingId === "") {
            return (result = {
                  message: "User does not have booking",
                  status: false,
            });
      }
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      // xét xem đã có monitor trong collection hay chưa
      let res = await MonitorParking.find(filter).populate("parkingId");
      if (res.length === 0) {
            return (result = {
                  message: "Parking does not exist",
                  status: false,
            });
      }
      let data;
      for (const vehicle of res[0].isComing) {
            if (vehicle.userId === userId) {
                  data = {
                        ownerId: res[0].ownerId,
                        userId: vehicle.userId,
                        vehicleId: vehicle.vehicleId,
                        parkingId: res[0].parkingId._id,
                        parkingName: res[0].parkingId.parkingName,
                        parkingAddress: res[0].parkingId.parkingAddress,
                        coordinate: res[0].parkingId.coordinate,
                        comingTime: vehicle.comingTime,
                  };
                  return (result = { data: data, status: true });
            }
      }

      return (result = { message: "No booking has found", status: false });
};

showParkingInfo = async (userId) => {
      let result;
      let parkingId = "";
      const userFilter = {
            userId: mongoose.Types.ObjectId(userId),
      };
      let response = await BookingHistory.find(userFilter);
      if (response.length === 0) {
            return (result = {
                  message: "User does not have booking history",
                  status: false,
            });
      }

      for (let booking of response) {
            if (!booking.parkingId) {
                  continue;
            }
            parkingId = booking.parkingId;
      }
      if (parkingId === "") {
            return (result = {
                  message: "User does not have booking",
                  status: false,
            });
      }
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      // xét xem đã có monitor trong collection hay chưa
      let res = await MonitorParking.find(filter).populate("parkingId");
      if (res.length === 0) {
            return (result = {
                  message: "Parking does not exist",
                  status: false,
            });
      }
      let data;
      for (const vehicle of res[0].hasCome) {
            if (vehicle.userId === userId && vehicle.isOut === false) {
                  data = {
                        ownerId: res[0].ownerId,
                        userId: vehicle.userId,
                        vehicleId: vehicle.vehicleId,
                        parkingId: res[0].parkingId._id,
                        parkingName: res[0].parkingId.parkingName,
                        parkingAddress: res[0].parkingId.parkingAddress,
                        coordinate: res[0].parkingId.coordinate,
                        comingTime: vehicle.comingTime,
                  };
                  return (result = { data: data, status: true });
            }
      }

      return (result = { message: "No parking has found", status: false });
};

showParkingHistoryInfo = async (userId) => {
      let result;
      let parkingId = "";
      const userFilter = {
            userId: mongoose.Types.ObjectId(userId),
      };
      let response = await BookingHistory.find(userFilter);
      if (response.length === 0) {
            return (result = {
                  message: "User does not have booking history",
                  status: false,
            });
      }

      for (let booking of response) {
            if (!booking.parkingId) {
                  continue;
            }
            parkingId = booking.parkingId;
      }
      if (parkingId === "") {
            return (result = {
                  message: "User does not have parking history",
                  status: false,
            });
      }
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      // xét xem đã có monitor trong collection hay chưa
      let res = await MonitorParking.find(filter).populate("parkingId");
      if (res.length === 0) {
            return (result = {
                  message: "Parking does not exist",
                  status: false,
            });
      }
      let data = [];
      for (const vehicle of res[0].hasCome) {
            if (vehicle.userId === userId && vehicle.isOut === true) {
                  data.push({
                        ownerId: res[0].ownerId,
                        userId: vehicle.userId,
                        vehicleId: vehicle.vehicleId,
                        parkingId: res[0].parkingId._id,
                        parkingName: res[0].parkingId.parkingName,
                        parkingAddress: res[0].parkingId.parkingAddress,
                        coordinate: res[0].parkingId.coordinate,
                        comingTime: vehicle.comingTime,
                        outTime: vehicle.outTime,
                        price: vehicle.price,
                  });
            }
      }
      if (data.length !== 0) {
            return (result = { data: data, status: true });
      }

      return (result = { message: "No parking history has found", status: false });
};

deleteComingVehicle = async (parkingId, userId, vehicleId) => {
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
                        message: "Vehicle does not exist",
                        status: false,
                  });
            }
      } catch (error) {
            return (result = {
                  message: "Error",
                  status: false,
            });
      }
      // Tìm monitor trong collection
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      let response = await MonitorParking.find(filter);

      if (response.length === 0) {
            return (result = {
                  message: "Monitor does not exist",
                  status: false,
            });
      }
      // Đã có monitor trong collection(đã có hoặc đã thêm ở trên)
      // Cần cập nhật lại isComing (bỏ đi vehicle cần bỏ)
      try {
            // lấy giá trị mảng isComing cũ - info xe cần bỏ
            let listIsComing = response[0].isComing;

            for (let i = 0; i < listIsComing.length; i++) {
                  if (listIsComing[i].vehicleId === vehicleId) {
                        listIsComing.splice(i, 1);
                        break;
                  }
            }

            // thêm vào model
            await MonitorParking.findOneAndUpdate(
                  { parkingId: mongoose.Types.ObjectId(parkingId) },
                  { isComing: listIsComing },
                  (err, data) => {
                        if (err) {
                              result = { message: err, status: false };
                        } else
                              result = {
                                    message:
                                          "Delete vehicle in monitor parking successfully",
                                    status: true,
                              };
                  }
            );
            let bookingFilter = {
                  vehicleId: mongoose.Types.ObjectId(vehicleId),
                  userId: mongoose.Types.ObjectId(userId),
            };
            let booking = await BookingHistory.findOneAndUpdate(bookingFilter, {
                  $unset: { parkingBookingId: 1 },
            });
            if (booking.length === 0) {
                  result = {
                        message: "Delete booking fail",
                        status: false,
                  };
            }
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
      let data = [];
      for (const vehicle of res[0].isComing) {
            const filterVehicle = {
                  _id: mongoose.Types.ObjectId(vehicle.vehicleId),
                  ownerId: mongoose.Types.ObjectId(vehicle.userId),
            };
            let rel = await Vehicle.find(filterVehicle);
            if (rel.length === 0) {
                  return (result = {
                        message: `Vehicle does not exist: ${vehicle.vehicleId}`,
                        status: false,
                  });
            }
            const filterUser = {
                  _id: mongoose.Types.ObjectId(vehicle.userId),
            };
            let userInfo = await User.find(filterUser);
            if (userInfo.length === 0) {
                  return (result = {
                        message: `User does not exist: ${vehicle.userId}`,
                        status: false,
                  });
            }
            let resu = {
                  userInfo: userInfo[0],
                  vehicleInfo: rel[0],
                  comingTime: vehicle.comingTime,
                  status: vehicle.status,
            };
            // console.log(rel[0]);
            data.push(resu);
      }
      result = { data: data, status: true };
      return result;
};

addComeVehicle = async (ownerId, parkingId, userId, vehicleId, comingTime) => {
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
                        message: "Vehicle does not exist",
                        status: false,
                  });
            }
      } catch (error) {
            return (result = {
                  message: "Error",
                  status: false,
            });
      }
      // xét xem đã có monitor trong collection hay chưa
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
            ownerId: mongoose.Types.ObjectId(ownerId),
      };
      let response = await MonitorParking.find(filter);

      if (response.length === 0) {
            return (result = {
                  message: "Monitor does not exist",
                  status: false,
            });
      }
      // Đã có monitor trong collection(đã có hoặc đã thêm ở trên)
      // Cần thêm mới hasCome (bao gồm những xe đã có + xe có info mới cần thêm vào)
      try {
            // lấy giá trị mảng hasCome cũ + info xe mới
            let listHasCome = response[0].hasCome;

            let newCome = {
                  userId: userId,
                  vehicleId: vehicleId,
                  isOut: false,
                  comingTime: comingTime,
            };
            listHasCome = [...listHasCome, newCome];

            // thêm vào model
            await MonitorParking.findOneAndUpdate(
                  { parkingId: mongoose.Types.ObjectId(parkingId) },
                  { hasCome: listHasCome },
                  (err, data) => {
                        if (err) {
                              result = { message: err, status: false };
                        } else
                              result = {
                                    message:
                                          "Add new vehicle parking successfully",
                                    status: true,
                              };
                  }
            );
            let bookingFilter = {
                  vehicleId: mongoose.Types.ObjectId(vehicleId),
                  userId: mongoose.Types.ObjectId(userId),
            };
            let booking = await BookingHistory.findOneAndUpdate(bookingFilter, {
                  parkingId: parkingId,
            });
            if (booking.length === 0) {
                  result = {
                        message: "Add parking info fail",
                        status: false,
                  };
            }
            return result;
      } catch (error) {
            // console.log('sdfsdf');
            return (result = { error, status: false });
      }
};

showListVehicleInParking = async (parkingId) => {
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
      let data = [];
      for (const vehicle of res[0].hasCome) {
            if (vehicle.isOut === false) {
                  const filterVehicle = {
                        _id: mongoose.Types.ObjectId(vehicle.vehicleId),
                        ownerId: mongoose.Types.ObjectId(vehicle.userId),
                  };
                  let rel = await Vehicle.find(filterVehicle);
                  if (rel.length === 0) {
                        return (result = {
                              message: `Vehicle does not exist: ${vehicle.vehicleId}`,
                              status: false,
                        });
                  }
                  const filterUser = {
                        _id: mongoose.Types.ObjectId(vehicle.userId),
                  };
                  let userInfo = await User.find(filterUser);
                  if (userInfo.length === 0) {
                        return (result = {
                              message: `User does not exist: ${vehicle.userId}`,
                              status: false,
                        });
                  }
                  let resu = {
                        userInfo: userInfo[0],
                        vehicleInfo: rel[0],
                        comingTime: vehicle.comingTime,
                  };
                  data.push(resu);
            }
      }
      result = { data: data, status: true };
      return result;
};

addOutVehicle = async (
      ownerId,
      parkingId,
      userId,
      vehicleId,
      comingTime,
      outTime,
      price
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
                        message: "Vehicle does not exist",
                        status: false,
                  });
            }
      } catch (error) {
            return (result = {
                  message: "Error",
                  status: false,
            });
      }
      // xét xem đã có monitor trong collection hay chưa
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
            ownerId: mongoose.Types.ObjectId(ownerId),
      };
      let response = await MonitorParking.find(filter);

      if (response.length === 0) {
            return (result = {
                  message: "Monitor does not exist",
                  status: false,
            });
      }
      // Đã có monitor trong collection(đã có hoặc đã thêm ở trên)
      // Cần thêm mới hasCome (bao gồm những xe đã có + xe có info mới cần thêm vào)
      try {
            // lấy giá trị mảng hasCome cũ + info xe mới
            let listHasCome = response[0].hasCome;

            for (let i = 0; i < listHasCome.length; i++) {
                  if (
                        listHasCome[i].vehicleId === vehicleId &&
                        listHasCome[i].comingTime === comingTime
                  ) {
                        listHasCome[i] = {
                              userId: userId,
                              vehicleId: vehicleId,
                              isOut: true,
                              comingTime: comingTime,
                              outTime: outTime,
                              price: price,
                        };
                        break;
                  }
            }

            // thêm vào model
            await MonitorParking.findOneAndUpdate(
                  { parkingId: mongoose.Types.ObjectId(parkingId) },
                  { hasCome: listHasCome },
                  (err, data) => {
                        if (err) {
                              result = { message: err, status: false };
                        } else
                              result = {
                                    message: "An vehicle has come out parking",
                                    status: true,
                              };
                  }
            );
            let bookingFilter = {
                  vehicleId: mongoose.Types.ObjectId(vehicleId),
                  userId: mongoose.Types.ObjectId(userId),
            };
            let parkingHistory = await BookingHistory.find(bookingFilter);
            if (!parkingHistory) {
                  result = {
                        message: "Vehicle not has parking history",
                        status: false,
                  };
            } else {
                  console.log(parkingHistory);
                  let history = parkingHistory[0].parkingHistory;
                  history.push({ parkingId: parkingId });
                  let booking = await BookingHistory.findOneAndUpdate(
                        bookingFilter,
                        { $unset: { parkingId: 1 }, parkingHistory: history }
                  );
                  if (booking.length === 0) {
                        result = {
                              message: "Delete booking fail",
                              status: false,
                        };
                  }
            }
            return result;
      } catch (error) {
            // console.log('sdfsdf');
            return (result = { error, status: false });
      }
};

const monitorParkingService = {
      createNewMonitor,
      addComingVehicle,
      showBookingInfo,
      showParkingInfo,
      showParkingHistoryInfo,
      showListComingVehicle,
      deleteComingVehicle,
      addComeVehicle,
      showListVehicleInParking,
      addOutVehicle,
};
module.exports = monitorParkingService;
