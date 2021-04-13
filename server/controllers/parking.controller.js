const mongoose = require("mongoose");

const parkingServices = require("../services/parking.service");
const userServices = require("../services/user.service");
const vehicleService = require("../services/vehicle.service");

exports.addNewParkingPlaceController = async (req, res) => {
  let {
    parkingName,
    parkingAddress,
    coordinate,
    vechileType,
    superficies,
    initialSlots,
    description,
  } = req.body;
  let ownerId = req.userId;
  let { result, status } = await parkingServices.createNewParkingPlace(
    ownerId,
    parkingName,
    parkingAddress,
    coordinate,
    vechileType,
    superficies,
    initialSlots,
    description
  );

  if (!status) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
  res.status(200).json(result);
};

exports.getParkingInfoController = async (req, res) => {
  let parkingId = req.params.parkingId;
  let result = await parkingServices.getParkingInfoById(parkingId);
  if (!result.status) {
    res.status(400).json({ message: result.message });
  }
  res.status(200).json(result.result);
};

exports.firstUpdateParkingInfoController = async (req, res) => {
  let {
    parkingName,
    parkingAddress,
    initialSlots,
    curentSlots,
    superficies,
    openTime,
    closeTime,
  } = req.body;

  let id = req.params.parkingId;
  let result = await parkingServices.updateParkingInfoForOwner(
    id,
    parkingName,
    parkingAddress,
    initialSlots,
    curentSlots,
    superficies,
    openTime,
    closeTime
  );
  if (!result.status) {
    return res.status(400).send({
      message: "Update parking info failed.",
    });
  }
  return res.status(200).send({ message: "Update parking info successfully." });
};

exports.reservationController = async (req, res) => {
  let userId = "606d792624abc12898f84c24";
  let parkingId = req.params.parkingId;
  // let userId = req.userId;
  let { result, status } = await userServices.getUserById(userId);
  if (!status) {
    res.status(400).send({ message: result.message });
  }
  let setCurrentSlots = parkingServices.updateParkingCurrentSlot(parkingId);
  if (!setCurrentSlots) {
    res.status(400).send({ message: "Some thing wrong in parkingDB" });
  }
  let response = await vehicleService.getVehicleInfoByOwnerId(userId);
  if (!response.status) {
    res.status(400).send(response);
  }
  let fullName = result.firstName + " " + result.lastName;
  let phoneNum = result.phoneNumber;
  let type = response.result[0].type;
  let licensePlates = response.result[0].licensePlates;
  // Them phuong tien vao truoc xong tra ve ten sdt loaij xe bien so
  return res.status(200).send({
    message: "Reservation successfully",
    fullName,
    phoneNum,
    type,
    licensePlates,
  });
};
