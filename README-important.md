# Auth: POST

    api/auth/signin: {phoneNumber, password, role}
        - success: {result, accessToken}
        - fail:
            + Wrong phoneNumber:
            {
                status: false,
                message: "User not found"
            }

            + Wrong Pass:
            {
                status: false,
                message: "Invalid Password!"
            }

            + Wrong Role:
            {
                status: false,
                message: "User with role ${role} not found"
            }



    api/auth/signup: {
                        "phoneNumber" : "0347459242",
                        "password" : "0347459242",
                        "role" : "owner",
                        "firstName" : "Lau",
                        "lastName" : "Truong",
                        "email" : "dcalau28@gmail.com"
                    }

        - success: {result},
        - fail:
            + Same phoneNumber with Role:
            {
                status: false,
                message: "Failed!! User has been register with role ${role}"
            }


    api/auth/signout {id: user._id}
        - Change the active status in DB (isActive: false)


    api/auth/checkUserExist:
                        {
                            "phoneNumber" : "0347459242",
                            "role" : "owner"
                        }
        VD: res: {
                "status": true,
                "message": "Failed!! User has been register with role owner"
            }

# Avatar: GET

    api/avatar/file/:id
        - return JSON file of image with {:id}

    api/avatar/:id
        - return image with {:id}

# Parking:

    POST: api/parking/new:    (cần token trong header và với role là owner)
            {
                "parkingName" : "Parking 2",
                "parkingAddress" : "20 Ly Thuong Kiet, Q 10",
                "coordinate": {
                    "latitude": 10.828031,
                    "longitude" : 106.720194
                },
                "vechileType" : {"current" : [0,1,2,3]},
                "superficies" : 500,
                "initialSlots" : 50,
                "description": "Bãi đỗ xe gần gần gần",
                "openTime" : "12:00",
                "closeTime" : "22:00"
            }
            - SUCCESS: return {
                                status: true,
                                result: result,
                                message: "Add Parking Successfully",
                            }
            - FAILED:  return { status: false, message: "Something went wrong" }


    GET: api/parking/:parkingId  (cần token trong header và với role là owner)
            - SUCCESS: return {status: true, result},
            - FAILED: return { status: false, message: result.message }


        api/parkings/all
            - SUCCESS: return {status: true, result},
            - FAILED: return { status: false, message: result.message }


        api/parkings/all/getinfo/:ownerId  (Get parking by ownerID)
            - SUCCESS: return {status: true, result},


    POST:    api/parking/:parkingId/update_1     (cần header có token và thay :parkingId bằng id của bãi đỗ xe)
            {
                "parkingName" : "update",
                "parkingAddress" : "update" ,
                "initialSlots" : 123,
                "superficies" :123,
                "openTime" : "05:55",
                "closeTime" : "05:55",
                "pricePerHour" : 500000 ,
                "vechileType" : {"current" : [0,1,2,3]},
                "description" : "123"
            }



    POST:     api/parking/delete/:parkingId   (dùng cho cả owner và admin)
                            {
                                "ownerId" : "60758290432b1241ec881263"
                            }

            - SUCCESS:  {
                            "status": true,
                            "result": "Delete Parking successfully"
                        }

            - FAILED:   {
                            "status": false,
                            "message": "Parking not Found or Deleted Or user are not owner of parking"
                        }




    GET:     api/parkings/admin/verify/:parkingId        (dùng cho admin)

            - SUCCESS:   {
                            "status": true,
                            "result": "Parking are verify to true"
                        }

            - FAILED :  {
                            "status": false,
                            "message": "Parking not found or something went wrong"
                        }

# Image (Avatar, ParkingImg)

    POST: api/image/parking/upload/:parkingId: (cần token trong header và với role là owner) => upload nhiều hình trong bãi đỗ xe.
    POST: api/image/avatar/upload  (cần token hợp lệ) => upload avatar
    POST: api/image/avatar/del/:id (cần token hợp lệ) => xóa avatar với id của hình
    GET:  api/image/avatar/:id                        => show hình avatar với id của hình
    GET:  api/image/avatar/:id                        => show hình parking với id của hình

# Notifications

    POST: api/notifications/token/new     (theem vào database để sau này sử dụng)
            {
                "deviceId": "165d6caf46a7880a",
                "token" : "1231232",
                "userId" : "60758290432b1241ec881263",
                "role" : "user"
            }

            - SUCCESS: return {status: true, result}
            - FAILED:  return { status: false, message: "Device has been registered" }




    POST: api/notifications/topic/:role  (gửi thông báo đi tới role user, owner hay cả 2)

          role: user, owner, all,
            {
                "title" : "Có người đang tới bãi đỗ xe",
                "body": "Xe F1",
                "sendUserId": ""
            }

            - SUCCESS: return {
                                status: true,
                                message: `Successfully sent notifications! to topic ${topic}`,
                              }
            - FAILED:  return { status: false, message: "Something went wrong" }


    POST: api/notifications            (gửi thông báo đến user cụ thể sử dụng token đã lưu trong DB)

            {
                "title" : "Có người đang tới bãi đỗ xe",
                "body": "Xe F1",
                "receivedUsersId": ["60758290432b1241ec881263"],
                "sendUserId" :""
            }

            - SUCCESS:  {
                            status: true,
                            message: `Successfully sent notifications to user has id: ${receivedUsersId}`,
                        }

            - FAILED:  return { status: false, message: "Something went wrong" }

    POST: api/notifications/checkDevice          (kiểm tra xem thiết bị của người dùng đã đăng nhập đã đăng ký nhận thông báo chưa trong DB)

            {
                "userId" : "60758290432b1241ec881263",
                "deviceId": "165d6caf46a7880a"
            }

            - SUCCESS: return   {
                                    message: `Device has been registered`,
                                    status: true,
                                }
            - FAILED: return { message: "Device has not been registered yet", status: false }

# Booking

    POST: api/monitor/     (thêm document monitor sau khi bãi xe được duyệt)
            {
                "ownerId": "165d6caf46a7880a",
                "parkingId": "165d6caf46a7880a"
            }

            - SUCCESS: return {status: true, result}
            - FAILED:  return { status: false, message: "Add monitor fail" }

    POST: api/monitor/addComingVehicle/:parkingId     (Sau khi người dùng nhấn đặt chỗ thì gọi api này, gọi api này ở app user )
            {
                "ownerId": "165d6caf46a7880a",(id của chủ bãi)
                "vehicleId" : "1231232",
                "comingTime" : "Bắt người dùng nhập ngày giờ",
                "status" : "Xe đẹp cẩn thận - cái này do người dùng nhập"
            }

            - SUCCESS: return {status: true, message:  "Add new vehicle to monitor parking successfully"}
            - FAILED:  return { status: false, message: "Add Coming Vehicle fail" }

    GET: api/monitor/getComingVehicle/:parkingId     (Sau khi gọi api trên success thì bên app owner dùng api này để show những xe đã đặt chỗ)

            - SUCCESS:
                return {
                    status: true,
                    result:{
                        data:[
                            {
                                vehicleInfo:{},
                                userInfo:{}(cái này t chưa thêm),
                                comingTime
                                status
                            }
                            (data gồm nhiều object này, mỗi object là thông tin 1 booking)
                        ]
                    }
                 }
            - FAILED:  return { status: false, message: message báo lỗi bên server }

     POST: api/monitor/addNewComingVehicleToMonitor/:parkingId     (xe sau khi đặt chỗ thành công, xe đó tới bãi và vào bãi thì gọi api này với api bên dưới)
            {
                "userId": "165d6caf46a7880a",
                "vehicleId" : "1231232",
                "comingTime" : "ngày giờ"
            }

            - SUCCESS: return {status: true, message: "Add new vehicle parking successfully"}
            - FAILED:  return { status: false, message: "Add new vehicle to monitor fail" }

     POST: api/monitor/deleteComingVehicle     (xóa bản ghi xe đã đặt chỗ khi xe vào bãi)
            {
                "parkingId": "165d6caf46a7880a",
                "userId" : "1231232",
                "vehicleId" : "60758290432b1241ec881263"
            }

            - SUCCESS: return {status: true, message: "Delete vehicle in monitor parking successfully"}
            - FAILED:  return { status: false, message: "Delete fail" }

     POST: api/monitor/getVehicleInParking/:parkingId     (sau khi xe vào bãi, app chủ bãi muốn show tất cả các xe đang đỗ trong bãi thì gọi api này)

            - SUCCESS: 
                return {
                        status: true,
                        result:{
                            data:[
                                {
                                    vehicleInfo:{},
                                    userInfo:{}(cái này t chưa thêm),
                                    comingTime
                                }
                                (data gồm nhiều object này, mỗi object là thông tin 1 xe và chủ xe trong bãi)
                            ]
                        }
                    }
            - FAILED:  return { status: false, message: message báo lỗi bên server }

     POST: api/monitor/addOutVehicle/:parkingId     (khi xe tính tiền và rời bãi thì gọi api này)
            {
                "userId": "165d6caf46a7880a",
                "vehicleId" : "1231232",
                "comingTime" : "ngày giờ",
                "outTime" : "ngày giờ",
                "price" : 10000
            }

            - SUCCESS: return {status: true, message: "An vehicle has come out parking"}
            - FAILED:  return { status: false, message: message báo lỗi bên server }

