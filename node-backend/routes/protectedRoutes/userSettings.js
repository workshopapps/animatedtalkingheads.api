const route = require("express").Router();
const {
addSettings,getSettings
} = require("../../controllers/userSettings");

route.post("/add", addSettings);
route.get("/get", getSettings);

module.exports=route
