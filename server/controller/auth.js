import User from "../models/User.js";
import bcrypt from "bcrypt";

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
        const isPasswordValid = await bcrypt.password(
            `$(req.body.password)`,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password! Please try again with the correct/valid credentials",
            });
        }
        const { password, ...user_data } = user._doc;

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