const { config } = require("dotenv");
const { MongoClient } = require("mongodb");
const crypto = require("crypto");
config();

const connection = async () => {
  const api_url = process.env.API_URL;
  const db_name = "kambx";

  const client = new MongoClient(api_url);
  try {
    await client.connect();

    const db = client.db(db_name);

    const collection = db.collection("users");

    const result = await collection.insertOne({ name: "Arun", age: 25 });

    console.log("Document inserted:", result.insertedId);
  } catch (error) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connection;
