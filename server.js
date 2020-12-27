/* eslint-disable no-console */
const dotenv = require('dotenv');
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
