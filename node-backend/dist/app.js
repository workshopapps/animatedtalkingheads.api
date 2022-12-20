var Sentry = require("@sentry/node");
var Tracing = require("@sentry/tracing");
var pug = require("pug");
var auth = require("./middlewares/authMiddleware");
var express = require("express");
var morgan = require("morgan");
var cors = require("cors");
var swaggerUI = require("swagger-ui-express");
var docs = require("./docs");
var animatedVideoRouter = require("./routes/animatedvidoes");
var podcastRouter = require("./routes/podcasts");
var paymentRoute = require("./routes/payment/index");
var NotFound = require("./utils/errors/NotFound");
// sten-add auth0 router dir
//email
var authRoutes = require("./routes/user/index");
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
app.set("trust proxy", true);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
// WRITE YOUR CODE AFTER THIS!!!!!!
app.use(function(req, res, next) {
    process.env.reqHost = req.protocol + "://" + req.get("host");
    next();
});
app.use(morgan("tiny"));
process.env.NODE_ENV !== "development" && (process.env.NODE_ENV = "production");
//get payment for development purpose
var getPayments = require("./controllers/payment").getPayments;
app.get("/getpayments", getPayments);
// process.env.NODE_ENV != 'production' &&
//   (process.env.ComSpec =
//     process.env.SHELL && (process.env.COMSPEC = process.env.shell));
// console.log(process.env.ComSpec);
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
app.use("/settings", auth, userSettingsRoute);
app.use("/uploads", express.static("./uploads"));
// app.use('/uploads', express.static('./uploads'));
///// payment route
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
//initialize the app.
module.exports = app;
