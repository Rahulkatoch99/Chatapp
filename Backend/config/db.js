mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/Chatapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connection successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
