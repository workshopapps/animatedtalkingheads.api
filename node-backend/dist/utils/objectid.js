var Type = require("@sinclair/typebox").Type;
var ObjectID = Type.RegEx(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
module.exports = ObjectID;
