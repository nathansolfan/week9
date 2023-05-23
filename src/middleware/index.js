const bcrypt = require('bcrypt');
const validator = require("email-validator");
const jwt = require("jsonwebtoken")

const User = require("../users/model");

//MIDDLEWARE FUNCTION
async function hashThePassword (req,res,next) {
    console.log("hashThePassword Middleware function")
    console.log(req.body.password)
    try {
        //code to hash a password
        req.body.password = await bcrypt.hash(req.body.password, 10)
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
        // catch errors if any code in the try block fails
    }
}

async function comparePasswords (req,res,next){
    try {
        console.log("PLAIN TEXT PASSWORD")
        console.log(req.body.password)
        // req.body.password with the hashed password that we've stored in the databse

        // the hashed version from the database to compare the plain text version with the hashed password
        
        // find user in our database using the username passed in the body of the request
        // userInfo is an object
        req.userInfo = await User.findOne({username: req.body.username})

        // compare the plain text password with the hashed password stored in the database
        // the .compare()method  takes 2 values, the first is the plain text password, 
        // the second is the hash version loaded from our databse

        if(req.userInfo && await bcrypt.compare(req.body.password, req.userInfo.password)) { 
            console.log("User found in our database and passwords match")           
            next()
        } else {
            throw new Error ("username or password is incorrect")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
} 

async function validateEmail (req, res, next){
    try {
        if (validator.validate(req.body.email)) {
            console.log("vaild email")
            next()
        } else {
            throw new Error ("invaild email please try again")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
}

async function tokenCheck (req, res, next) {
    try {
        // get the encoded token from the authorization header
        const token = req.header("Authorization")
        console.log("Encoded token from the authorization header")
        console.log(token)
        console.log("!!!!!!!!!!!!!")

        // decoded the token and check if it contains the secret key from our server
        // verify that the token contains the secret key
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)
        console.log("decoded token")
        console.log(decodedToken.id)
        // check if the id exists in our database
        const user = await User.findById(decodedToken.id)
        console.log("user")
        console.log(user)
        console.log("!!!!!!!!!!!!!")
        // if a user has been found in our database using the id encoded in the token
        if(user) {
            // move on to the controller
            next()
        } else {
            throw new Error ("user is not authorised")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
}

module.exports = {
    hashThePassword,
    comparePasswords,
    validateEmail, 
    tokenCheck
}