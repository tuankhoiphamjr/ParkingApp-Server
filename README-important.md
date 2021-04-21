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