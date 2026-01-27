require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const cors = require("cors");
const router = express.Router();
const app = express();
const apiRoutes = require("./endpoints");

app.use(cors());
app.use(express.json());

app.use("/api",apiRoutes);
app.listen(PORT,() => {
    console.log(`Server running on ${PORT}`);
});