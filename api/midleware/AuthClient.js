import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()


export const authenticateMe = async (req, res, next) => {
    try {
        const token = req.cookies?.OurSiteJWT || req.headers.authorization?.split(' ')[1];
        console.log("Token received:", token); // Debugging

        if (!token) {
            return res.status(403).json({ msg: "Token not found" });
        }

        const secKey = process.env.JWT_SECRET_KEY || "yhahaha-secret-keynya-ga-kebaca-kasian-deh";
        const decodedData = jwt.verify(token, secKey);

        // Attach userId to the response object
        req.userId = decodedData.userId;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(500).json({ msg: `Error: ${error.message}` });
    }
};
