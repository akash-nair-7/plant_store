const express = require("express");
const path = require("path");
const router = require("./routes/plantRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection")
connectDb();
const app = express();
app.use(express.json());
port = process.env.PORT || 3000;
console.log(port)

// Serve static files from front-end folder
app.use(express.static(path.join(__dirname, 'front-end')));

// API routes
app.use("/api/plants",router);
app.use("/api/users",require("./routes/userRoutes"))

// Error handling middleware
app.use(errorHandler);

// Catch-all route to serve index.html for client-side routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})