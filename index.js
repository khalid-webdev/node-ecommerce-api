require("dotenv").config({quiet:true})
require("./config/passport");
const mongoose = require('mongoose')
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes")

mongoose.connect('mongodb://localhost:27017/user-db').then(() => console.log('MongoDb connected successfully.....')).catch((err) => console.log('Database Connection Failed!!!', err))

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is listening on localhost:${PORT}......`))
