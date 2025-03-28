import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../Config";

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: "The first name is required!",
            max: 25,
        },
        last_name: {
            type: String,
            required: "The last name is required!",
            max: 25,
        },
        email: {
            type: String,
            required: "The email is required!",
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: "The password is required!",
            select: false,
            max: 25,
        },
        role: {
            type: String,
            required: true,
            default: "customer",
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.generateAccessJWU = function () {
    let payload = {
        id: this._id,
    };

    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '10m',
    })
}

export default mongoose.model("users", UserSchema);