const express = require("express");
const router = require("./routes/plantRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection")
connectDb();
const app = express();
app.use(express.json());
port = process.env.PORT || 3000;
console.log(port)
app.use("/api/plants",router);
app.use("/api/users",require("./routes/userRoutes"))
app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})