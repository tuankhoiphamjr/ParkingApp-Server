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
        "parkingName" : "Parking 1",
        "parkingAddress" : "20 Đường số 20, Thủ Đức",
        "coordinate": {
            "latitude": 10.828031,
            "longitude" : 106.720194
        },
        "vechileType" : ["car", "motobike"],
        "superficies" : 500,
        "initialSlots" : 50,
        "description": "Bãi đỗ xe gần gần gần"
    }

    GET: api/parking/:parkingId  (cần token trong header và với role là owner)
        - success: return {result},

# Image (Avatar, ParkingImg)
    POST: api/image/parking/upload/:parkingId: (cần token trong header và với role là owner) => upload nhiều hình trong bãi đỗ xe.
    POST: api/image/avatar/upload  (cần token hợp lệ) => upload avatar
    POST: api/image/avatar/del/:id (cần token hợp lệ) => xóa avatar với id của hình
    GET:  api/image/avatar/:id                        => show hình avatar với id của hình
    GET:  api/image/avatar/:id                        => show hình parking với id của hình