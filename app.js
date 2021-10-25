'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const CryptoTicker = require('./models/cryptoTicker');

const app = express();
const port = process.env.API_PORT;

// immediately initialize MongoDB connection
(async () => {
  const m = {
    server: process.env.MONGO_SERVER,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DB_NAME,
    auth: process.env.MONGO_AUTHDB,
  };

  const url =
    `mongodb://${m.user}:${m.pass}@${m.server}:${m.port}/?authMechanism=DEFAULT&authSource=${m.auth}`;

  try {
    await mongoose.connect(url, {
      dbName: m.dbName,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(`Failed to connect to MongoDB`);
    console.error(err);
  }
})();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request for root - provide info about API
app.get('/', function (req, res) {
  res.status(200).send(`
    <body style="background: rgb(223, 179, 151);">
      <h1><a href="https://github.com/chroaster/kapi">KAPI</a></h1>
      <h2>API for historical cryptocurrency market data</h2>
      <h3>Version:</h3>
      <p>1.0.0</p>
      <h3>Usage:</h3>
      <p>Retrieve data from a specific minute (UTC)</p>
      <li><a href="${req.baseUrl}/2021/10/17/20/23">https://kapi.chroaster.com/2021/10/17/20/23</a></li>
      <p>Retrieve data for a one-hour window (UTC)</p>
      <li><a href="${req.baseUrl}/hour/2021/10/17/20/23">https://kapi.chroaster.com/hour/2021/10/17/20/23</a></li>
    </body>
  `);
  res.end();
});

// Retrieve a specific minute
app.get('/:year/:month/:day/:hour/:minute', async (req, res) => {

  const startTime = new Date(
    Number.parseInt(req.params.year),
    Number.parseInt(req.params.month) - 1,
    Number.parseInt(req.params.day),
    Number.parseInt(req.params.hour),
    Number.parseInt(req.params.minute)
  );
  startTime.setHours(startTime.getHours() + Number.parseInt(process.env.SERVER_UTC_OFFSET));

  const queryResponse = await CryptoTicker.findOne(
    {
      utc: { $gte: startTime.toISOString() },
    }
  ).lean();

  res.type('application/json');
  res.send(queryResponse);
});

// Retrieve one hour's worth of documents
app.get('/hour/:year/:month/:day/:hour/:minute', async (req, res) => {

  const startTime = new Date(
    Number.parseInt(req.params.year),
    Number.parseInt(req.params.month) - 1,
    Number.parseInt(req.params.day),
    Number.parseInt(req.params.hour),
    Number.parseInt(req.params.minute)
  );
  startTime.setHours(startTime.getHours() + Number.parseInt(process.env.SERVER_UTC_OFFSET));

  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);

  const queryResponse = await CryptoTicker.find(
    {
      utc: { $gte: startTime.toISOString(), $lt: endTime.toISOString() },
    }
  ).sort({ utc: 1 }).lean();

  res.type('application/json');
  res.send(queryResponse);
});

app.listen(port);
console.log(`------------- KAPI Launched at ${(new Date()).toLocaleTimeString()} -------------`);