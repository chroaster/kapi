require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const mongo = {
  server: process.env.MONGO_SERVER,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  dbName: process.env.MONGO_DB_NAME,
  authDB: process.env.MONGO_AUTHDB,
};

const url = `mongodb://${mongo.user}:${mongo.password}@${mongo.server}:${mongo.port}/?authMechanism=DEFAULT&authSource=${mongo.authDB}`;

try {
  mongoose.connect(url, {
    dbName: mongo.dbName,
    useNewUrlParser: true,
  });
} catch (err) {
  console.error(`Failed to connect to MongoDB`);
  console.error(err);
}

const port = process.env.API_PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('kapi\n');
});

app.listen(port);