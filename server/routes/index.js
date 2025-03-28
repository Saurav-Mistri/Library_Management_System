import { Verify, VerifyRole } from "../middleware/verify.js";

const Router = (app) => {
    // home route with the get method and a handler
    app.get("/app", (req, res) => {
        try {
            res.status(200).json({
                status: "success",
                data: [],
                message: "Welcome to our Dashboard!",
            })
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: err,
            })
        }
    });

    // session verify route
    app.get("/app/user", Verify, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to your Dashboard!",
        });
    });

    // session and user role verify route
    app.get("/app/user", Verify, VerifyRole, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to Site Admin Dashboard!",
        });
    });
};

export default Router;