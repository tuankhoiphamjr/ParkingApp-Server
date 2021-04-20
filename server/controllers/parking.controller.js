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
    openTime,
    closeTime,
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
    description,
    openTime,
    closeTime
  );

  if (!status) {
    res.status(400).json({ status: false, message: "Something went wrong" });
    return;
  }
  res.status(200).json({
    status: true,
    result: result,
    message: "Add Parking Successfully",
  });
};

exports.getParkingInfoController = async (req, res) => {
  let parkingId = req.params.parkingId;
  let result = await parkingServices.getParkingInfoById(parkingId);
  if (!result.status) {
    res.status(400).json({ status: false, message: result.message });
  }
  res.status(200).json({ status: true, result: result.result });
};

exports.firstUpdateParkingInfoController = async (req, res) => {
  let {
    parkingName,
    parkingAddress,
    initialSlots,
    superficies,
    openTime,
    closeTime,
    pricePerHour,
    vechileType,
    description,
  } = req.body;

  let parkingId = req.params.parkingId;
  let ownerId = req.userId;
  let result = await parkingServices.updateParkingInfoForOwner(
    parkingId,
    ownerId,
    parkingName,
    parkingAddress,
    initialSlots,
    superficies,
    openTime,
    closeTime,
    pricePerHour,
    vechileType,
    description
  );
  if (!result.status) {
    return res.status(400).send({
      status: false,
      message: "Update parking info failed.",
    });
  }
  return res
    .status(200)
    .send({ status: true, message: "Update parking info successfully." });
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

exports.getAllVerifiedParkingInfoController = async (req, res) => {
  let result = await parkingServices.getAllVerifiedParkingInfo();
  if (!result.status) {
    res.status(400).json({ status: false, message: result.message });
  }
  res.status(200).json({ status: true, result: result.result });
};

// Get All Parking Info of An Owner
exports.getParkingsOfOwnerController = async (req, res) => {
  let ownerId = req.params.ownerId;
  let result = await parkingServices.getParkingsByOwnerId(ownerId);
  if (!result.status) {
    res.status(400).json({ status: false, message: result.message });
  }
  res.status(200).json({ status: true, result: result.result });
};

// Delete a Parking By Owner
exports.deleteParkingController = async (req, res) => {
  let ownerId = req.body.ownerId;
  let parkingId = req.params.parkingId;
  let result = await parkingServices.deleteParkingByOwner(ownerId, parkingId);
  if (!result.status) {
    return res.status(400).json({ status: false, message: result.message });
  }
  return res.status(200).json({ status: true, result: result.message });
};

// Verify a Parking By Admin
exports.verifyParkingController = async (req, res) => {
  let parkingId = req.params.parkingId;
  let result = await parkingServices.verifyParking(parkingId, true);
  if (!result.status) {
    return res.status(400).json({ status: false, message: result.message });
  }
  return res.status(200).json({ status: true, result: result.message });
};
