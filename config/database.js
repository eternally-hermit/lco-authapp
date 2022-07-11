const mongoose = require("mongoose");

const { MONGODB_URL } = process.env;

module.exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to Database..!");
    })
    .catch((err) => {
      console.error("DB Connection Failed!");
      console.error(err);
      process.exit(1);
    });
};
