const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const db = await mongoose.connect("mongodb://127.0.0.1:27017/fnph_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected " + db.connection.host);
  } catch (error) {
    console.log("Unable to connect due to " + error.message);
    process.exit();
  }
};

module.exports = connectDb;
