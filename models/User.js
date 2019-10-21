const bcrypt = require("bcrypt");
const validator = require("validator");
const usersCollection = require("../db").db().collection("users");


let User = function (data) {
    this.data = data;
    this.errors = [];
};

User.prototype.cleanUp = function () {
    if (typeof (this.data.email) != "string") {
        this.data.email = "";
    }
    if (typeof (this.data.password) != "string") {
        this.data.password = "";
    }

    //get rid of any other bogus properties
    this.data = {
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    };
};

User.prototype.userImg = function () {
    let imageEncoded = this.data.filepond;
    if (imageEncoded == null) return;
    const image = JSON.parse(imageEncoded);
    if (image != null && imageMimeTypes.includes(image.type)) {
        let originalImg = new Buffer.from(image.data, "base64");
        let imageType = image.type;
    }
};

User.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        if (!validator.isEmail(this.data.email)) {
            this.errors.push("Please provide the valid email");
        }
        if (this.data.password == "") {
            this.errors.push("Password cannot be empty");
        }
        if (this.data.password.length > 0 && this.data.password.length < 12) {
            this.errors.push("Password must be at least 12 characters long");
        }

        //Only if email is valid, We need to check if it is already exist in the DB
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({
                email: this.data.email
            });
            if (emailExists) {
                this.errors.push("That E-mail is already registered");
            }
        }
        resolve();
    });
};

User.prototype.login = function () {
    return new Promise((resolve, reject) => {
        //Clean Up the User Entered Data
        this.cleanUp();
        usersCollection.findOne({
            email: this.data.email
        }).then((attemptedUSer) => {
            if (attemptedUSer && bcrypt.compareSync(this.data.password, attemptedUSer.password)) {
                resolve("Congrats!! You are now logged in!");
            } else {
                reject("Invalid Username or Password");
            }
        }).catch(() => {
            reject("Something went wrong, Please try again later!");
        });

    });
};




User.prototype.signup = function () {
    return new Promise(async (resolve, reject) => {
        //Validate the User
        this.cleanUp();
        await this.validate();

        //If No Validation error then save the data into the DB
        //Step#2: IF no validation error, save the data into the DB
        if (!this.errors.length) {
            let salt = bcrypt.genSaltSync(10);
            this.data.password = bcrypt.hashSync(this.data.password, salt);
            await usersCollection.insertOne(this.data, this.image);
            resolve();
        } else {
            reject(this.errors);
        }
    });
};

module.exports = User;