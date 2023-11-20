const jwt = require("jsonwebtoken");

const authToken = async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if (err) {
            return res.status(401).send({ msg: "Auth failed" });
            } else {
              req.user = jwt.decode(token);
              next();
            }
        });
      } else {
        res.send('No token...');
      }
    } catch (error) {
      res.status(401).json({
        succeeded: false,
        error: 'Not authorized',
      });
    }
  };


module.exports = authToken;

