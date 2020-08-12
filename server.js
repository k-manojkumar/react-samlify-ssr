const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const assignEntity = require("./config/samlify.js");
const session = require("express-session");
const errorhandler = require("errorhandler");

var env = process.env.NODE_ENV || "development";

const config = require("./config/config")[env];

console.log("Using configuration", config);

var app = express();

app.set("view engine", "jade");
//app.engine('html', require('ejs').renderFile);
app.use(cookieParser());
app.enable("trust proxy"); // add this line
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "default",
    proxy: true, // add this line
  })
);

app.use(assignEntity);

app.use(morgan("combined"));
app.use(require("express-chrome-logger"));
app.use(express.static(path.join(__dirname, "build")));

app.set("port", config.app.port);

require("./config/routes")(app);

// Serving static files
app.use("/assets", express.static(path.resolve(__dirname, "assets")));
app.use("/media", express.static(path.resolve(__dirname, "media")));

// hide powered by express
app.disable("x-powered-by");

let initialState = {
  isAuth: false,
  data: { name: "", id: "" },
};

// server rendered home page
app.get("/", (req, res) => {
  const { preloadedState, content } = ssr(initialState);
  const response = template("Server Rendered Page", preloadedState, content);
  res.setHeader("Cache-Control", "assets, max-age=604800");
  res.send(response);
});

const fs = require("fs");

const https = require("https");
const key = fs.readFileSync("./key.pem");
const cert = fs.readFileSync("./cert.pem");
const server = https.createServer({ key: key, cert: cert }, app);
server.listen(8081);
