# Daliy_matchs_backend

BASE_URL=http://localhost:8000/api

Signup API

endPoint=/user/signup

Request Body
{
    "name":"Adarsh",
    "email":"a@gmail.com",
    "password":70582455,
    "phoneNumber":"+91 7805824855",
    "address":"supercity ",
    "DOB":"1/2/2019"
}
 Response 
 status code =>200
 {
    "message": "User registered successfully. Please verify your email."
}

*************************************************************************

Verify OTP API

endPoint=/user/verify-otp

Request Body
{
  
    "email":"abtiwari797@gmail.com",
    "otp":"715617"
  
}
 Response 
 status code =>200
{
    "message": "OTP verified successfully"
}


*************************************************************************

Login API

endPoint=/user/login

Request Body
{

    "email":"abtiwari797@gmail.com",
    "password":"Adarsh@1996"

}
 Response 
 status code =>200
{
    "token": " <Random String>"
}

*************************************************************************

Update Profile API

endPoint=/user/login

Request Header

x-auth-token=<Token>

Request Body
{
    "name":"Adarsh",
    "phoneNumber":"+91 7805824855",
    "address":"supercity  mhow",
    "DOB":"1/2/2019"
}
 Response 
 status code =>200
{
    "message": "profile update successfully"
}

*************************************************************************

Logout API

endPoint=/user/login

Request Header

x-auth-token=<Token>

 Response 
 status code =>200
{
    "message": "Logged out successfully"
}