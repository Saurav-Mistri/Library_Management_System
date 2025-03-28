import { config } from "dotenv";
import User from "../models/User.js"
import jwt from "jsonwebtoken";

export async function Verify(req, res, next) {
    try {
        // get the session cookie from the request header
        const authHeader = req.header["cookie"];

        // If there is no cookie from request header, send an unauthorized response.
        if (!authHeader) {
            return res.sendStatus(401);
        }

        // split the cookie string to get the actual jwt token
        const cookie = authHeader.split("=")[1];

        // Verify using jwt, that if the token has been tampered with or if it has expired
        // that's like verifying the integrity of the cookie
        jwt.verify(cookie, config.SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                // If token has been altered or has expired, return an unauthorized error
                return res.status(401).json({
                    message: "This session has expired, Please login again!",
                });
            }

            // get user id from the decoded token
            const { id } = decoded;

            // find user by that `id`
            const user = await User.findById(id);

            // return user object without the password
            const { password, ...data } = user._doc;

            // put the data object into req.user
            req.user = data;

            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: err,
        });
    }
}