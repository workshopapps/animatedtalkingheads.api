//store user id
export var getId = function(req, res, next) {
    req.userId = req.params.userid;
    next();
};
