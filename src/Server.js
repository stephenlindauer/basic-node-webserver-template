const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

// Basic logging utility
const _log = (level, tag, log) => console.log(`${level} [${tag}] ${log}`);
const LOG = (s) => _log("I", TAG, s);
const WARN = (s) => _log("W", TAG, s);
const ERROR = (s) => _log("E", TAG, s);

const TAG = "BasicWebServer";
class BasicWebServer {
  _app;

  constructor(port) {
    this._listeningPort = port ?? 8080;
  }

  async _isRequestAuthorized(req) {
    // Add any authorization checks here
    return false;
  }

  start() {
    // Sets up middleware, session, paths to views, etc...
    this.setup();

    // ******************
    // Add pages here
    this._app.get("/", (req, res) => {
      res.render("index", {
        // Example
        query: req.query,
      });
    });

    // Uncomment to use a catchall. This must be after all other page setups
    // Eg.. This can be used for sending page requests to react
    // this._app.get("/*", (res, req) => {});

    // End of pages setup
    // ******************

    this._app.listen(this._listeningPort, () =>
      LOG(`Listening on port http://localhost:${this._listeningPort}`)
    );
  }

  // Probably don't need to modify anything below here unless looking for advanced customizations

  async _middleware(req, res, next) {
    if (!(await this._isRequestAuthorized(req))) {
      res.status(401).json({ status: "Unauthorized" });
      WARN("401 " + req.method + " " + req.originalUrl);
      return;
    }

    try {
      LOG(`Requesting ${req.method} ${req.originalUrl}`);
      const t = Date.now();
      next(); // do the request
      LOG(
        `${res.statusCode} ${req.method} ${req.originalUrl} ${Date.now() - t}ms`
      );
    } catch (e) {
      ERROR("Request failed: " + e.message);
    }
  }

  async setup() {
    this._app = express();

    this._app.use(bodyParser.json());
    this._app.use(express.static(path.join(__dirname, "../static")));
    this._app.set("views", path.join(__dirname, "../views"));
    this._app.set("view engine", "ejs");
    this._app.use(cors({ origin: "*" }));
    this._app.use(
      session({
        secret: "<INSERT RANDOMLY GENERATED SECRET>",
        saveUninitialized: true,
        resave: true,
        // Uncomment this to configure a persistent storage of session info
        // Example useage with mongodb
        // store: new MongoStore({
        //   url: "mongodb+srv://user:pass@server/path",
        // }),
      })
    );
    this._app.use(async (req, res, next) => {
      await this._middleware(req, res, next);
    });
  }
}

module.exports = BasicWebServer;
