const jwt = require("jsonwebtoken");
const axios = require("axios");

const authUserMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${process.env.BASE_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status !== 200) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = response.data.data;
        // normalize id field: some services return `id` instead of `_id`
        if (user && !user._id && user.id) {
            user._id = user.id;
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const authCaptainMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${process.env.BASE_URL}/api/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status !== 200) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const captain = response.data.data;
        // normalize id field: some services return `id` instead of `_id`
        if (captain && !captain._id && captain.id) {
            captain._id = captain.id;
        }
        req.captain = captain;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = {
    authUserMiddleware,
    authCaptainMiddleware
};