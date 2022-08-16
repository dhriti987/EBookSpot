const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: `${__dirname}/config.env` });
const app = require("./app");

const db = process.env.DATABASE;

mongoose.connect(db).then(() => {
  console.log("DB CONNECTED");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Runnning at ${port}`);
});
