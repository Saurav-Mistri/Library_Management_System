import { config } from "dotenv";
import User from "../models/User.js"
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../Config/index.js";

export async function Verify(req, res, next) {
    // get the session cookie from the request header
    const authHeader = req.header["cookie"];

    // If there is no cookie from request header, send an unauthorized response.
    if (!authHeader) {
        return res.sendStatus(401);
    }

    // split the cookie string to get the actual jwt token
    const cookie = authHeader.split("=")[1];
    const accessToken = cookie.split(';')[0];

    // Verify the token is blacklisted
    const checkIfBlacklisted = await blacklist.findOne({ token: accessToken });
    // if true, send an unauthorized message, asking for a re-authentication
    if (checkIfBlacklisted) {
        return res
            .statue(401)
            .json({
                message: "This session has been expired! Please login again!"
            });
    }

    // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
    // that's like verifying the integrity of the access Token
    jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
            // if token has been altered, retuen a forbidden error
            return res
                .status(401)
                .json({
                    message: err
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
}

export function VerifyRole(req, res, next) {
    try {
        // We have to access the user object from the request
        const user = req.user;

        // extract the user role
        const { role } = user;

        // Verify if the user has no advance privileges
        // return an unauthorized response
        if (role !== "admin") {
            return res.status(401).json({
                status: "failed",
                message: "Your are not authorized to view this page.",
            });
        }
        next();
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: err,
        });
    }
}