const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const mangaRoute = require("./routes/manga")

dotenv.config();
const app = express();
const http = require("http").Server(app);

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/api/manga", mangaRoute);

mongoose.connect(process.env.DATABASE_URL, { useNewurlParser: true });

const port = process.env.PORT || 5002

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
