const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    console.log('auth start')
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.json({message:"supply Bearer token"})
    }
    const token = authorization.split(" ")[1];
    console.log(token)

    const payload = jwt.verify(token,'thisShouldBeMovedToDotEnvLater');
    console.log(payload)
    req.decoded = { email: payload.email, id: payload.id };
    console.log('auth end, next')
    next();
  } catch (error) {
    console.log('auth error')
    const { message } = error;
    res.status(401).json({message});
    console.log(message);
  }
};

module.exports = auth;
