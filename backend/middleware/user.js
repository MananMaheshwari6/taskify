const jwt = require('jsonwebtoken');
const secret = 'secretUserKey';

const userAuthJWT = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        token = authHeader.split(" ")[1];

        jwt.verify(token,secret, (err,user) => {
            if(err){
                return res.status(403).json({message: "invalid token"})
            }
            next();
        })
    }
    return res.status(401).json({message: "unauthorized attempt"});
}

module.exports = ({
    userAuthJWT,
    secret
})