//Models are used to make collections in DB using Node.js (by code without GUI)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;  //Detstructuring Schema from mongoose

const userSchema = new Schema({

    firstName: String,
    lastName: String,
    username : {type:String,required:true},
    password : {type:String, required:true}

});

//Encryting/hashing the passwor and then inserting in DB
userSchema.pre("save",async function (next){
    const user = this;
    
    if(!user.isModified('password')) return next();
    //otherwise, if not modified
    const saltRound = 10;
    let salt = await bcrypt.genSalt(saltRound);  //iterate the hasing 10 times
    let hash = await bcrypt.hash(user.password,salt);  // hashedPwd = actualPwd + salt
    user.password = hash;                             // replace userPwd by hashedPwd in DB.
    next();
});

//compare entered pwd with registered pwd , when user loging in.
userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password);
}

//Create Model
const User = mongoose.model("User",userSchema);
module.exports = User;


//Schema provide structure (fields and types of fields) to our DB.
// Schema we decide fields and types of those field in our collection,
//While model actually create Collection with a name (User in this case ) and specified fields.

//"bcrypt" is a 3rd party pkg which encrypt the password.
/* In schemas there is buiti  pre method , with the help of this we can perform some operation on schemas
before actually save them in DB
*/

//" next " is a method , says move to next opertaion after completing one.
// if(!User.isModified) : Hash the password only for registering new user.
/* if(!User.isModified) return next(); : if the user is already registered ,skip hashing and for
next operation in cycle */
//salt round is number of times to hash a pwd, greater the salt rounds more complex the pwd.
// .genSalt and .hash are builtin mthds.

/** Comparison **/
// this.password: pwd stored in userSchema(DB); password: entered pwd