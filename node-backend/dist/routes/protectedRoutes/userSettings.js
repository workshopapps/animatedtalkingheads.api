var route = require("express").Router();
var _require = require("../../controllers/userSettings"), addSettings = _require.addSettings, getSettings = _require.getSettings;
route.post("/add", addSettings);
route.get("/get", getSettings);
module.exports = route;
