import express from "express";
import { mongoose } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT, DB_CONNECT } from "./Config/index.js";
import Router from "./routes/index.js";
import Auth from "./routes/auth.js";

// Create Server

const app = express();


// Configure Head information
// Allow request from any source. In real production this should be limited to allowed orgins only

app.use(cors());
app.disable("x-powered-by"); // reduce fingerprinting
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/app/auth', Auth);

// DB Connection 
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("Connected to the database"))
    .catch((err) => console.log(err));

// configure route and connect route handler to app
Router(app);

// Start up app
app.listen(PORT, () => {
    console.log(`The app is running on http://localhost:${PORT}`);
})