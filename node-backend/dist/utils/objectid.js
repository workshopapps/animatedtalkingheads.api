"use strict";
const { Type  } = require('@sinclair/typebox');
const ObjectID = Type.RegEx(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
module.exports = ObjectID;
