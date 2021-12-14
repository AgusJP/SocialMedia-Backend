require("dotenv").config();
require("./database");
const express = require("express");
const path = require("path");
const cors =  require("cors");
const appRoutes = require('./routes/index.js')
const PORT = process.env.PORT || 5000;
const corsOptions = {exposedHeaders: 'CountPosts', credentials: true, origin: process.env.FRONT || '*'};

// Inizialitions
const app = express();

//Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true}));
app.use("/files", express.static(path.resolve(__dirname, "./", "tmp", "uploads")));
app.use(express.json());

// Routes
app.use(appRoutes);

app.listen(PORT, () => console.log(`App listen on port ${PORT}`));