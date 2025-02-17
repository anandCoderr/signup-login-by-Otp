import express from "express";
import "dotenv/config";
import dbConnectFunction from "./Config/DbConfig.js";
import registerRoute from "./Router/AuthRoute.js";
import sendOtpRoute from "./Router/sendOtpRoute.js";

import  cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())


// --------db connect
dbConnectFunction();

// ---------register route
app.use("/user", registerRoute);

// ------------send otp route

app.use('/otp',sendOtpRoute);


const port = process.env.PORT_NUM || 9000;

app.listen(port, () => {
  console.log(` server is running on port number ${port}`);
});