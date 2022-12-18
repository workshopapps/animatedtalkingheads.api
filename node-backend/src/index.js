function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var express = require("express");
var Sentry = require("@sentry/node");
var Tracing = require("@sentry/tracing");
var path = require("path");
var pug = require("pug");
var auth = require("./middlewares/authMiddleware");
var dotenv = require("dotenv");
dotenv.config({
    path: "./.env"
});
var mongoose = require("mongoose");
var morgan = require("morgan");
var cors = require("cors");
var swaggerUI = require("swagger-ui-express");
var docs = require("./docs");
var avatarRouter = require("./routes/avatars");
var animatedVideoRouter = require("./routes/animatedvidoes/");
var podcastRouter = require("./routes/podcasts");
var paymentRoute = require("./routes/payment/index");
var NotFound = require("./utils/errors/NotFound");
// sten-add auth0 router dir
var auth0Router = require("./routes/auth0");
//email
var authRoutes = require("./routes/user/index");
var rauthRoutes = require("./routes/emails/rindex");
// const cookieParser = require('cookie-parser');
// const path = require('path');
var errorController = require("./controllers/error.controller");
var userSettingsRoute = require("./routes/protectedRoutes/userSettings");
// DONT PUT ANYTHING BEFORE THIS!!!!!!!
var app = express();
Sentry.init({
    dsn: "https://847f70043a354431a605fe554591ae6a@o4504282743635968.ingest.sentry.io/4504293110317056",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({
            tracing: true
        }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({
            // to trace all requests to the default router
            app: app
        })
    ],
    maxValueLength: 700,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
});
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
// WRITE YOUR CODE AFTER THIS!!!!!!
app.use(function(req, res, next) {
    process.env.reqHost = req.protocol + "://" + req.get("host");
    next();
});
var DB = process.env.mongo_url;
app.use(morgan("tiny"));
process.env.NODE_ENV !== "development" && (process.env.NODE_ENV = "production");
//get payment for development purpose
var getPayments = require("./controllers/payment").getPayments;
app.get("/getpayments", getPayments);
// process.env.NODE_ENV != 'production' &&
//   (process.env.ComSpec =
//     process.env.SHELL && (process.env.COMSPEC = process.env.shell));
// console.log(process.env.ComSpec);
mongoose.connect(DB).then(function() {
    return console.log("DB connection successful!");
});
mongoose.set("strict", true);
mongoose.set("strictPopulate", false);
mongoose.set("toJSON", {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret.__v;
    }
});
mongoose.set("toObject", {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret.__v;
    }
});
var PORT = process.env.PORT || 4000;
var fs = require("fs");
var User = require("./models/User");
var Email = require("./utils/email");
var AnimatedVideo = require("./models/AnimatedVideo");
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
if (!fs.existsSync("./uploads/podcasts")) {
    fs.mkdirSync("./uploads/podcasts");
}
// app configs.
app.options("*", cors());
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use(authRoutes);
app.use(express.json());
// app.use('/todos', todoRouter);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs));
app.use("/podcasts", podcastRouter);
app.use("/animated-videos", animatedVideoRouter);
app.use("/auth", authRoutes);
app.use("/rauth", rauthRoutes);
app.use("/settings", auth, userSettingsRoute);
app.use("/uploads", express.static("./uploads"));
app.use("/auth0", auth0Router); // sten-register auth0 url
// app.use('/uploads', express.static('./uploads'));
app.use(authRoutes);
app.use(rauthRoutes);
/// contatct page
/* app.post('/contact', (req, res) => {
  const { email = '', name = '', message = '' } = req.body

  mailer({ email, name, text: message }).then(() => {
    console.log(`Sent the message "${message}" from <${name}> ${email}.`);
    res.redirect('/#success');
  }).catch((error) => {
    console.log(`Failed to send the message "${message}" from <${name}> ${email} with the error ${error && error.message}`);
    res.redirect('/#error');
  })
}) */ ///// payment route
app.use(express.static(path.join(__dirname, "public/")));
app.use(express.static(path.join(process.cwd(), "../pyhton-backend/data/")));
app.set("view engine", pug);
app.get("/error", function(req, res) {
    res.render("error.pug");
});
app.use("/", paymentRoute);
app.all("*", function(req, res, next) {
    next(new NotFound());
});
app.use(Sentry.Handlers.errorHandler());
app.use(errorController);
function initialize() {
    return _initialize.apply(this, arguments);
}
function _initialize() {
    _initialize = //initialize the app.
    _asyncToGenerator(function() {
        return __generator(this, function(_state) {
            app.listen(PORT);
            return [
                2
            ];
        });
    });
    return _initialize.apply(this, arguments);
}
initialize().finally(function() {
    return console.log("app started on port:".concat(PORT));
});


//# sourceMappingURL=index.js.map