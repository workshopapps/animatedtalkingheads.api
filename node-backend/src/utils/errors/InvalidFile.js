class InvalidFile extends Error {
  constructor(message, statusCode) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.message = "The file(s) wasn't uploaded to the server";
    this.name = this.constructor.name;
    this.statusCode = 403;
    this.isOperational = true;
    this.type = 'InvalidFile';
  }
}

module.exports = InvalidFile;
