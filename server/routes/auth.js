import express from "express";
import { check } from "express-validator";
import { Register, Login, Logout } from "../controller/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Register route -- POST request
router.post(
    "/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address!")
        .normalizeEmail(),
    check("first_name")
        .not()
        .isEmpty()
        .withMessage("The first name is required!")
        .trim()
        .escape(),
    check("last_name")
        .not()
        .isEmpty()
        .withMessage("The last name is required!")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("The password must be 8 characters long!"),
    validate,
    Register
);

// Login route -- POST request
router.post(
    "/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address!")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    validate,
    Login
);

// Logout route
router.get("/logout", Logout);

export default router;