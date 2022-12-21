//store user id
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getId", {
    enumerable: true,
    get: ()=>getId
});
const getId = (req, res, next)=>{
    req.userId = req.params.userid;
    next();
};
