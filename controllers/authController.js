// conrollers folder contain callBack functions for each routes
const User = require('../models/user');   // importing our user model
const jwt = require('jsonwebtoken');    //pkg handle autthentication and authorization
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

async function registerUser(req, res) {
    const { firstName, lastName, username, password } = req.body;
    try {

        const duplicate = await User.find({ username });
        if (duplicate && duplicate.length > 0) {
            return res.status(400).send({ message: "User already registered with this username" });
        }
        //oherwise register a new user , using template of User
        let user = new User({ firstName, lastName, username, password });
        const result = await user.save()     // Save data in DB an then assign to result
        console.log(result);
        res.status(201).send("User registered successfully !");

    } catch (err) {
        res.status(400).send(err);
    }
}

//Callback for login route
async function loginUser(req, res){
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Invalid username or password !" });
        }
        //But if entered username matches with the username in DB, then go and compare pwd.
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(404).send({ error: "Invalid pasword" });
        }
        //if enterd pwd also matches, then
        let token = jwt.sign({ userId: user?._id }, secretKey, { expiresIn: '1h' });
        const finalData = {
            userId:user?._id,
            username:user?.username,
            firstName:user?.firstName,
            lastName:user?.lastName,
            token
        }
        res.send(finalData);

    } catch (err) {
        console.log(err);

        res.status(400).send(err);
    }
}

// lets export this function in an object
const authController = {
    registerUser,
    loginUser
}

module.exports = authController;