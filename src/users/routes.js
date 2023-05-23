const {Router} = require("express");
// This imports just the Router method from the express library
const userRouter = Router();
// This renames Router to be userRouter

const {registerUser, login, readUsers, updateUser, deleteUser} = require("./controllers");
const { hashThePassword, comparePasswords, validateEmail, tokenCheck } = require ("../middleware")

//CREATE

//TODO: Email validation middleware added to the register route
userRouter.post("/users/register", validateEmail, hashThePassword, registerUser);
// Creates the end point /users/register for a HTTP POST request and causes it to run registerUser

userRouter.post("/users/login", comparePasswords, login)

// READ
userRouter.get("/users/readUsers", tokenCheck, readUsers) // protected route

//UPDATE
userRouter.put("/users/update", updateUser)

//DELETE
userRouter.delete("/users/delete", deleteUser)


module.exports = userRouter;