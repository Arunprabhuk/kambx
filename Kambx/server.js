const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`server connected : ${PORT}`);
});
