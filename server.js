const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const statusRoutes = require("./routes/statusRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
