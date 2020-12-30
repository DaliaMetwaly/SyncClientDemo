/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// const express = require('express');

dotenv.config({
  path: './config.env',
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!! shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
// Connect the mongoDB tansaction database
const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
// eslint-disable-next-line no-unused-vars
}).then((_con) => {
  console.log('DB connection Successfully!');
});

// Start the server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!!  shutting down ...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
