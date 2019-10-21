const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const router = require("./router");
const flash = require("connect-flash");




const app = express();
const sessionOptions = session({
    secret: "Let us Date",
    store: new MongoStore({
        client: require("./db")
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
});
app.use(express.static(__dirname));
app.use(flash());
app.use(sessionOptions);
app.use(express.json());
app.set("views", "views");
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/uploads`));
app.use(express.urlencoded({
    extended: false
}));
app.use("/", router);
module.exports = app;