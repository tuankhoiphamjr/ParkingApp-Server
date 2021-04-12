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
                message: "You are not owner. Please use the correct App"
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


            

    api/auth/signup: {phoneNumber, password, role, firstName, lastName, email}
        - Return user info as JSON file
        - Change the active status in DB (isActive: true)

    api/auth/signout {id: user._id} 
        - Change the active status in DB (isActive: false)

# Avatar: GET
    api/avatar/file/:id 
        - return JSON file of image with {:id}

    api/avatar/:id 
        - return image with {:id}


# Parking: 

    cần token trong header và với role là owner
    api/parking/new:
    {
        ownerId: 
        parkingName:
        parkingAddress:
    }