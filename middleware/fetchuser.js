var jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    //get the user from jwt payload
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ Error: 'Please Authenticate Using a Valid token' });
    }
    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = data.user_id;
        next();
    } catch (error) {
        res.status(401).send({ Error: 'Please Authenticate Using a Valid token' });
    }
}

module.exports = fetchuser;