//store user id
export const getId = (req, res, next) => {
  req.userId = req.params.userid;
  next();
};
