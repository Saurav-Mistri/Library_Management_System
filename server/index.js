import express from "express";
import { PORT, URI } from "./Config/index.js";
import Router from "./routes/index.js";
import { mongoose } from "mongoose";

// Create Server

const app = express();


// Configure Head information
// Allow request from any source. In real production this should be limited to allowed orgins only

app.use(cors());
app.disable("x-powered-by"); // reduce fingerprinting
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB Connection 
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(URI, {
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