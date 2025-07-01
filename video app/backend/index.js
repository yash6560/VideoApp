const express = require("express");
const dotenv = require("dotenv")
dotenv.config();
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const chatRoute = require('./routes/chat.route');
const DBConnect = require('./lib/db');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/chat', chatRoute);

app.listen(process.env.PORT, ()=>{
    DBConnect();
    console.log(`Server is running at port : ${process.env.PORT}`);
})