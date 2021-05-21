const mongoose = require("mongoose");
const db = require("../models");
const MonitorParking = db.monitorParking;
const Parking = db.parking;
const Vehicle = db.vehicle;
const User = db.user;
const BookingHistory = db.bookingHistory;
const dateFormat = require("../utils/dateFormat");

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
      let res = await BookingHistory.find({
            vehicleId: mongoose.Types.ObjectId(vehicleId),
      });
      if (res.length === 0) {
            return (result = {
                  message: "Vehicle not found in booking history",
                  status: false,
            });
      }
      if (res[0].parkingBookingId) {
            return (result = {
                  message: "Can not book cause you have a book before",
                  status: false,
            });
      }
      try {
            let filter = {
                  ownerId: mongoose.Types.ObjectId(userId),
                  _id: mongoose.Types.ObjectId(vehicleId),
                  isActive: true,
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
                                    message: "Add new vehicle to monitor parking successfully",
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
      let parkingHistory = [];
      for (let booking of response) {
            if (booking.parkingHistory.length !== 0) {
                  parkingHistory = [...parkingHistory, booking.parkingHistory];
            }
      }
      if (parkingHistory[0].length === 0) {
            return (result = {
                  message: "User does not have parking history",
                  status: false,
            });
      }
      let data = [];
      for (const parking of parkingHistory[0]) {
            const filter = {
                  parkingId: mongoose.Types.ObjectId(parking.parkingId),
            };
            let res = await MonitorParking.find(filter).populate("parkingId");
            if (res.length === 0) {
                  data.push({
                        message: "Parking not found",
                  });
                  continue;
            }
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
      }
      if (data.length !== 0) {
            return (result = { data: data, status: true });
      }

      return (result = {
            message: "No parking history has found",
            status: false,
      });
};

deleteComingVehicle = async (parkingId, userId, vehicleId) => {
      let result;
      // xét xem thông tin xe có chính xác hay không
      try {
            let filter = {
                  ownerId: mongoose.Types.ObjectId(userId),
                  _id: mongoose.Types.ObjectId(vehicleId),
                  isActive: true,
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
                                    message: "Delete vehicle in monitor parking successfully",
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
      let resu;
      for (const vehicle of res[0].isComing) {
            const filterVehicle = {
                  _id: mongoose.Types.ObjectId(vehicle.vehicleId),
                  ownerId: mongoose.Types.ObjectId(vehicle.userId),
                  isActive: true,
            };
            let rel = await Vehicle.find(filterVehicle);
            if (rel.length === 0) {
                  resu = {
                        vehicleInfo: `Vehicle does not exist: ${vehicle.vehicleId}`,
                        comingTime: vehicle.comingTime,
                        status: vehicle.status,
                  };
            } else {
                  const filterUser = {
                        _id: mongoose.Types.ObjectId(vehicle.userId),
                  };
                  let userInfo = await User.find(filterUser);
                  if (userInfo.length === 0) {
                        resu = {
                              userInfo: `User does not exist: ${vehicle.userId}`,
                              vehicleInfo: rel[0],
                              comingTime: vehicle.comingTime,
                              status: vehicle.status,
                        };
                  } else {
                        resu = {
                              userInfo: userInfo[0],
                              vehicleInfo: rel[0],
                              comingTime: vehicle.comingTime,
                              status: vehicle.status,
                        };
                  }
                  // console.log(rel[0]);
            }
            data.push(resu);
      }
      result = { data: data, status: true };
      return result;
};

addComeVehicle = async (ownerId, parkingId, userId, vehicleId, comingTime) => {
      let result;
      // xét xem thông tin xe có chính xác hay không
      let res = await BookingHistory.find({
            vehicleId: mongoose.Types.ObjectId(vehicleId),
      });
      if (res.length === 0) {
            return (result = {
                  message: "Vehicle not found in booking history",
                  status: false,
            });
      }
      if (res[0].parkingId) {
            return (result = {
                  message: "Can not book cause you have parked",
                  status: false,
            });
      }
      try {
            let filter = {
                  ownerId: mongoose.Types.ObjectId(userId),
                  _id: mongoose.Types.ObjectId(vehicleId),
                  isActive: true,
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
                                    message: "Add new vehicle parking successfully",
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
      let resu;
      for (const vehicle of res[0].hasCome) {
            if (vehicle.isOut === false) {
                  const filterVehicle = {
                        _id: mongoose.Types.ObjectId(vehicle.vehicleId),
                        ownerId: mongoose.Types.ObjectId(vehicle.userId),
                        isActive: true,
                  };
                  let rel = await Vehicle.find(filterVehicle);
                  if (rel.length === 0) {
                        resu = {
                              vehicleInfo: `Vehicle does not exist: ${vehicle.vehicleId}`,
                              comingTime: vehicle.comingTime,
                        };
                  } else {
                        const filterUser = {
                              _id: mongoose.Types.ObjectId(vehicle.userId),
                        };
                        let userInfo = await User.find(filterUser);
                        if (userInfo.length === 0) {
                              resu = {
                                    userInfo: `User does not exist: ${vehicle.userId}`,
                                    vehicleInfo: rel[0],
                                    comingTime: vehicle.comingTime,
                              };
                        } else {
                              resu = {
                                    userInfo: userInfo[0],
                                    vehicleInfo: rel[0],
                                    comingTime: vehicle.comingTime,
                              };
                        }
                  }
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
                  isActive: true,
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
                  let history = parkingHistory[0].parkingHistory;
                  let usedTo = false;
                  for (let i = 0; i < history.length; i++) {
                        if (parkingId === history[i].parkingId) usedTo = true;
                  }
                  if (!usedTo) {
                        history.push({ parkingId: parkingId });
                  }
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

getRevenueOfParkingByDate = async (date, parkingId) => {
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
      let count = 0;
      let revenue = 0;
      for (const vehicle of res[0].hasCome) {
            if (vehicle.isOut === true) {
                  let outTime = vehicle.outTime.split(" ");
                  if (outTime[0] === date) {
                        count++;
                        revenue += vehicle.price;
                  }
            }
      }
      let data = {
            vehicleNumber: count,
            revenue: revenue,
      };
      result = { data: data, status: true };
      return result;
};

getRevenueOfParkingByMonth = async (month, year, parkingId) => {
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
      let revenue = [0, 0, 0, 0, 0, 0];
      let vehicleNumber = [0, 0, 0, 0, 0, 0];
      for (const vehicle of res[0].hasCome) {
            if (vehicle.isOut === true) {
                  let outTime = vehicle.outTime.split(" ");
                  let date = outTime[0].split("/");
                  if (date[1] === month && date[2] === year) {
                        let day = parseInt(date[0]);
                        if (day <= 5) {
                              vehicleNumber[0]++;
                              revenue[0] += vehicle.price;
                        } else if (day <= 10) {
                              vehicleNumber[1]++;
                              revenue[1] += vehicle.price;
                        } else if (day <= 15) {
                              vehicleNumber[2]++;
                              revenue[2] += vehicle.price;
                        } else if (day <= 20) {
                              vehicleNumber[3]++;
                              revenue[3] += vehicle.price;
                        } else if (day <= 25) {
                              vehicleNumber[4]++;
                              revenue[4] += vehicle.price;
                        } else {
                              vehicleNumber[5]++;
                              revenue[5] += vehicle.price;
                        }
                  }
            }
      }
      let data = {
            revenue: revenue,
            vehicleNumber: vehicleNumber,
      };
      result = { data: data, status: true };
      return result;
};

getRevenueAndVehicleNumbersOfParkingByMonthForStatistical = async (
      date,
      parkingId
) => {
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
      let checkDate = date.split("/");
      let checkDateInJSFormat = new Date(
            new Date(checkDate[1], checkDate[0], 0)
      );
      let now = new Date(Date.now());

      let countArray =
            dateFormat.monthYearFormat(now) ===
            dateFormat.monthYearFormat(checkDateInJSFormat)
                  ? Array(now.getDate()).fill(0)
                  : Array(checkDateInJSFormat.getDate()).fill(0);
      let revenueArray =
            dateFormat.monthYearFormat(now) ===
            dateFormat.monthYearFormat(checkDateInJSFormat)
                  ? Array(now.getDate()).fill(0)
                  : Array(checkDateInJSFormat.getDate()).fill(0);

      for (const vehicle of res[0].hasCome) {
            if (vehicle.isOut === false) {
                  continue;
            }
            let outTime = vehicle.outTime.split(" ");
            let outDate = outTime[0].split("/");
            if (
                  parseInt(outDate[1]) === checkDateInJSFormat.getMonth() + 1 &&
                  parseInt(outDate[2]) === checkDateInJSFormat.getFullYear()
            ) {
                  revenueArray[parseInt(outDate[0]) - 1] += vehicle.price;
                  countArray[parseInt(outDate[0]) - 1] += 1;
            }
      }

      let data = {
            vehicleNumber: countArray,
            revenue: revenueArray,
      };
      result = { data: data, status: true };
      return result;
};

getRevenueVehicleNumberOfParkingByYear = async (year, parkingId) => {
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

      let now = new Date(Date.now());
      let index =
            now.getFullYear() === parseInt(year) ? now.getMonth() + 1 : 12;

      let countArray = [];
      let revenueArray = [];
      for (let i = 0; i < index; i++) {
            countArray.push([0, 0, 0, 0, 0, 0]);
            revenueArray.push([0, 0, 0, 0, 0, 0]);
      }

      for (const vehicle of res[0].hasCome) {
            if (vehicle.isOut === true) {
                  if (now.getFullYear() === parseInt(year)) {
                        let outTime = vehicle.outTime.split(" ");
                        let date = outTime[0].split("/");
                        let day = parseInt(date[0]);
                        let month = parseInt(date[1]);
                        if (day <= 5) {
                              countArray[month - 1][0]++;
                              revenueArray[month - 1][0] += vehicle.price;
                        } else if (day <= 10) {
                              countArray[month - 1][1]++;
                              revenueArray[month - 1][1] += vehicle.price;
                        } else if (day <= 15) {
                              countArray[month - 1][2]++;
                              revenueArray[month - 1][2] += vehicle.price;
                        } else if (day <= 20) {
                              countArray[month - 1][3]++;
                              revenueArray[month - 1][3] += vehicle.price;
                        } else if (day <= 25) {
                              countArray[month - 1][4]++;
                              revenueArray[month - 1][4] += vehicle.price;
                        } else {
                              countArray[month - 1][5]++;
                              revenueArray[month - 1][5] += vehicle.price;
                        }
                  }
            }
      }
      let data = {
            revenue: revenueArray,
            vehicleNumber: countArray,
      };
      result = { data: data, status: true };
      return result;
};

getPriceOfBooking = async (userId, parkingId) => {
      let result;
      const parkingFilter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      const filter = {
            _id: mongoose.Types.ObjectId(parkingId),
      };
      let response = await Parking.find(filter);
      if (response.length === 0) {
            return (result = {
                  message: "Parking does not exist",
                  status: false,
            });
      }
      // xét xem đã có monitor trong collection hay chưa
      let res = await MonitorParking.find(parkingFilter);
      if (res.length === 0) {
            return (result = {
                  message: "Monitor does not exist",
                  status: false,
            });
      }
      let comingTime = "";
      let vehicleId = "";
      for (const vehicle of res[0].hasCome) {
            if (vehicle.userId === userId || !vehicle.isOut) {
                  comingTime = vehicle.comingTime;
                  vehicleId = vehicle.vehicleId;
                  break;
            }
      }
      if (comingTime === "") {
            return (result = {
                  message: "User does not park here",
                  status: false,
            });
      }
      const vehicleFilter = {
            _id: mongoose.Types.ObjectId(vehicleId),
      };
      let respon = await Vehicle.find(vehicleFilter);
      if (respon.length === 0) {
            return (result = {
                  message: "Vehicle does not exits",
                  status: false,
            });
      }
      let dateTime = comingTime.split(" ");
      let date = dateTime[0].split("/");
      let hour = dateTime[1].split(":");
      let time = new Date(date[2], date[1] - 1, date[0], hour[0], hour[1]);
      let now = new Date(Date.now());
      let diff = (now.getTime() - time.getTime()) / 1000;
      diff /= 3600;
      diff = Math.ceil(diff);
      let unitHour = response[0].unitHour;
      let unitPrice = 0;
      for (const vehicleType of response[0].priceByVehicle) {
            if (vehicleType.key === respon[0].type) {
                  unitPrice = parseInt(vehicleType.value);
                  break;
            }
      }
      if (unitPrice === 0) {
            return (result = {
                  message: "Vehicle type wrong",
                  status: false,
            });
      }
      let price = Math.ceil(diff / unitHour) * unitPrice;
      return (result = {
            price: price,
            status: true,
      });
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
      getRevenueOfParkingByDate,
      getRevenueOfParkingByMonth,
      getRevenueAndVehicleNumbersOfParkingByMonthForStatistical,
      getRevenueVehicleNumberOfParkingByYear,
      getPriceOfBooking,
};
module.exports = monitorParkingService;
