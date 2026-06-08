const jwt = require("jsonwebtoken");
const axios = require("axios");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const response = axios.get(`${process.env.BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log({ response })

        if (response.status !== 200) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = response.data;
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;