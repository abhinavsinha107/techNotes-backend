import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import corsOptions from "./config/corsOptions";
import rootRoutes from "./routes/root.route";
import userRoutes from "./routes/user.route";
import { logger } from "./middlewares/logger";
import errorHandler from "./middlewares/errorHandler";
import connectDB from "./config/dbConnection";
import { logEvents } from "./middlewares/logger";

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use("/", rootRoutes);
app.use("/users", userRoutes);

// Not Found Route
app.all('*', (req: express.Request, res: express.Response) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Error Handler
app.use(errorHandler);

// MongoDB Connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})