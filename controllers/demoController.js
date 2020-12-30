/* eslint-disable consistent-return */
/* eslint-disable no-console */
const mySqlTransaction = require('../mySqlServices/mySqlTransaction');

exports.login = async (req, res, next) => {
  try {
    res.json({
      message: 'success',
    });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
exports.sync = async (req, res, next) => {
  try {
    const {
      tableName, entityId, token, lastSyncDate, pages, limits,
    } = req.query;
    await mySqlTransaction.getResponse(`http://vp-sync-staging.herokuapp.com/api/v1/sync/list?table=${tableName}&entityId=${entityId}`, tableName);
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
exports.insert = async (req, res, next) => {
  try {
    const {
      tableName,
    } = req.query;
    const result = await mySqlTransaction.addRecord(tableName, req.body);
    res.json({ messgae: result });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
exports.delete = async (req, res, next) => {
  try {
    const {
      tableName,
    } = req.query;
    const result = await mySqlTransaction.deleteRecord(tableName, req.body);
    res.json({ messgae: result });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
exports.update = async (req, res, next) => {
  try {
    const {
      tableName,
    } = req.query;
    const result = await mySqlTransaction.updateRecord(tableName, req.body);
    res.json({ messgae: result });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
exports.getTransactions = async (req, res, next) => {
  try {
    const result = await mySqlTransaction.getTransactions();
    res.json({ result });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
exports.getRecords = async (req, res, next) => {
  try {
    const { tableName } = req.query;
    const result = await mySqlTransaction.getRecords(tableName);
    res.json({ result });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
exports.putActivity = async (req, res, next) => {
  try {
    await mySqlTransaction.putActivity(process.env.API_HOST, '/api/v1/sync/putActivity', req.body);
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};
