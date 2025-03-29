import User from "../models/User.js";
import bcrypt from "bcrypt";
import Blacklist from "../models/Blacklist.js";

/** 
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
*/

export async function Register(req, res) {
    // get required variables from request body
    // using ES6 object destructing
    const { first_name, last_name, email, password } = req.body;
    try {
        // create ana instance of a user
        const newUser = new User({
            first_name,
            last_name,
            email,
            password,
        });

        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems your already have an account, please log in instead."
            })
        }

        // save new user into the database
        const saveNewUser = await newUser.save();

        const { role, ...user_data } = saveNewUser._doc;
        user_data.password = undefined;
        res.status(200).json({
            status: "success",
            data: { user_data },
            message: "Thank you for registering with us. Your account has been successfully registered."
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: err,
        });
    }
    res.end();
}

// Login login code 

export async function Login(req, res) {
    // Get variables for the login process
    const { email } = req.body;

    try {
        // Verify if the user is exists
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password! Please try again with the correct/valid credentials!",
            });
        }
        // if user exists
        // Step - 1 validate password
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password! Please try again with the correct/valid credentials",
            });
        }

        let options = {
            // generated token would be expired in 10 min
            maxAge: 10 * 60 * 1000,
            // The cookie is only accessible by the web server
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        // generate session token for user
        const token = user.generateAccessJWT();

        // set the token to response header, so that the client sends it back on each subsequent request
        res.cookie("SessionID", token, options);

        //return user info except password
        const { password, role, ...user_data } = user._doc;

        res.status(200).json({
            status: "success",
            data: [user_data],
            message: "Your have successfully logged-in!",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: err,
        });
    }
    res.end();
}

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Public
 */

export async function Logout(req, res) {
    try {
        // get the session cookie from the request header
        const authHeader = req.header["cookie"];

        // No content
        if (!authHeader) {
            return res.sendStatus(204);
        }

        // If there is, split the cookie string to get the actual jwt token
        const cookie = authHeader.split('=')[1];
        const accessToken = cookie.split(';')[0];

        // Verify that token is blacklsited
        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });

        // if true, send a no content response.
        if (checkIfBlacklisted) {
            return res.sendStatus(204);
        }

        // Otherwise Blacklist token
        const newBlackList = new Blacklist({
            token: accessToken,
        });
        await newBlackList.save();

        // Clear request cookie on client
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).json({
            message: "Your are logged out!"
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
    res.end();
}