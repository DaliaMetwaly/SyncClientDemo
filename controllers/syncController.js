/* eslint-disable consistent-return */
/* eslint-disable no-console */
const mqService = require('../services/mqService');
const mySqlService = require('../services/mySqlService');
const mongoDbService = require('../services/mongoDbService');

exports.putActivity = async (req, res, next) => {
  try {
    const { payLoad } = req.body;
    mqService.publishToQueue(payLoad);
    // mqService.publishToSubscribers('testMsg');
    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};

exports.clientRegisteration = async (req, res, next) => {
  try {
    mqService.consumeToSubscribers();
    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};

exports.syncApi = async (req, res, next) => {
  try {
    const {
      tableName, entityId, token, lastSyncDate,
    } = req.params;
    let records;
    if (lastSyncDate !== 'undefined') {
      records = await mySqlService.getTableRecords(tableName, entityId, token, lastSyncDate);
    } else {
      records = await mySqlService.getTableRecords(tableName, entityId, token);
    }
    return res.status(200).json({
      records,
      status: 'success',
    });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};

exports.transactionSync = async (req, res, next) => {
  try {
    const {
      tableName, entityId, token, lastSyncDate, identifier,
    } = req.params;
    const transactions = await mongoDbService.getTransactions(
      tableName, entityId, token, lastSyncDate, identifier,
    );

    if (typeof (transactions) !== 'string') {
      return res.status(200).json({
        transactions,
        status: 'success',
      });
    }
    return res.status(500).json({
      transactions,
      status: 'failure',
    });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
