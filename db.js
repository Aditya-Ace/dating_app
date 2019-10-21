const mongodb = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

mongodb.connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error, client) => {
    if (error) {
        console.log(error);
    } else {
        module.exports = client;
        const app = require("./app");
        app.listen(process.env.PORT || 8080, () => {
            console.log("Server is up and running with your db");
        });
    }
});