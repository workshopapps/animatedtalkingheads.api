const route = require("express").Router();
const {
addSettings
} = require("../../controllers/userSettings");

route.post("/add", addSettings);

module.exports=route
