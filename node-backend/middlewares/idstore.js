//store user id
<<<<<<< HEAD
const getId = (req,res,next)=>{
    req.userId = req.params.userid;
    next()
  }


module.exports = getId;
=======
export const getId = (req, res, next) => {
  req.userId = req.params.userid;
  next();
};
>>>>>>> cbf65886d5026b75ce7b45ed7a7f7de825aca14d
