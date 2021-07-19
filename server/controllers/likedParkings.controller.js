const likedParkingsService = require("../services/likedParkings.service");

// Add new Parking in DB
exports.addNewLikedParking = async (req, res) => {
  let { userId, userName, parkingId, parkingName, parkingAddress } = req.body;
  let { result, status } = await likedParkingsService.likeParking(
    userId,
    parkingId,
    userName,
    parkingName,
    parkingAddress
  );

  if (!status) {
    res.status(400).json({
      status: false,
      message: "BAD REQUEST",
    });
    return;
  }
  res.status(200).json({
    status: 200,
    result: result,
    message: "Like Parking Successfully",
  });
};

exports.checkIfParkingIsLiked = async (req, res)=>{
    const {userId, parkingId} = req.query || {}
    const {status, result} = await likedParkingsService.checkIfParkingIsLiked(userId, parkingId)
    if(status){
        res.status(200).json({
            status: true,
            result,
        })
    }else{
        res.status(400).json({
            status: false,
            message: 'NOT_FOUND'
        })
    }

}

exports.getListParkingLikedByUserId = async(req, res) =>{
    const {userId} = req.params
    const result = await likedParkingsService.getListParkingisLikedByUserId(userId)
    res.status(200).json(result)
}
