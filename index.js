const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/user");
const urlShortener = require("./routes/urlShortener")

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
  
app.use(express.json());

app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.log(err);
  });


  app.get("/", async function(request,response){
    response.send("Welcomes To Url Shortener !!!");
});

app.use("/auth",userRouter);
app.use("/api",urlShortener);

const PORT = process.env.PORT || 4000
app.listen(PORT,() => {
  console.log("Connection Success");
});
