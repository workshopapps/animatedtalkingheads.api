//store user id
const getId = (req,res,next)=>{
    req.userId = req.params.userid;
    next()
  }


module.exports = getId;
