import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './route/web.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
dotenv.config();

let app = express();

// Config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config view engine
viewEngine(app);
// Init web routes
initWebRoutes(app);

// Connect to DB
connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
})