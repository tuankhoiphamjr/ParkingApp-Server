const mongoose = require("mongoose");

const parkingServices = require("../services/parking.service");

exports.addNewParkingPlaceController = async (req, res) => {
  let { parkingName, parkingAddress } = req.body;
  let ownerId = req.userId;
  let { result, status } = await parkingServices.createNewParkingPlace(
    ownerId,
    parkingName,
    parkingAddress
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
