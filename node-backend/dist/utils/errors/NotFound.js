"use strict";
class NotFound extends Error {
    constructor(){
        super();
        Error.captureStackTrace(this, this.constructor);
        this.message = 'This document/route doesnt exist';
        this.name = this.constructor.name;
        this.statusCode = 404;
        this.isOperational = true;
        this.type = 'NotFound';
    }
}
module.exports = NotFound;
