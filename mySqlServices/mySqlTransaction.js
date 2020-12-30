/* eslint-disable no-console */
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { db } = require('./index');

const { QueryTypes } = db.Sequelize;
const transactionMongoModel = require('../mongoDbModels/transactionModel');
const variableNames = require('../constant/variable');

class MySqlTransaction {
  async getResponse(uri, tableName) {
    this.uri = uri;
    http.get(uri, (res) => {
      let str = '';
      let sqlString = '';
      let columnString = '';
      res.on('data', (chunk) => {
        str += chunk;
      });

      res.on('end', async () => {
        const obj = JSON.parse(str);
        let tempVal = '';
        obj.records.map((ele) => {
          tempVal = `'${Object.values(ele).join("','")}'`;
          columnString = `insert into ${tableName} (${Object.keys(ele).join(',')}) values `;
          sqlString += ` (${tempVal.replace(/''/g, 'null')}),`;
        });
        // eslint-disable-next-line max-len
        await db.sequelize.query(columnString + sqlString.slice(0, -1),
          {
            type: QueryTypes.INSERT,
          });
      });
    });
  }

  async addRecord(tableName, recordValue) {
    let result = '';
    const transactionId = uuidv4();
    this.tableName = tableName;
    this.recordValue = recordValue;

    // eslint-disable-next-line no-underscore-dangle
    const existTrans = await transactionMongoModel.find({ _id: transactionId });
    if (existTrans.length === 0) {
      const existRecord = await db.sequelize.query(`SELECT * FROM ${this.tableName}  WHERE id ='${this.recordValue.id}'`,
        {
          type: QueryTypes.SELECT,
        });
      if (existRecord.length === 0) {
        await db.sequelize.query(`INSERT INTO ${this.tableName}  (${Object.keys(this.recordValue)}) values  (?)`,
          {
            replacements: [Object.values(this.recordValue)],
            type: QueryTypes.INSERT,
          });
        await transactionMongoModel.create({
          _id: transactionId,
          recordId: this.recordValue.id,
          tableName: this.tableName,
          transactionType: variableNames.insertTransaction,
          dataAfter: this.recordValue,
          changedProperties: Object.keys(this.recordValue),
          changeSource: 'myClientDevice',
          creationTime: Date.now(),
          syncTo: ['myClientDevice'],
          entityId: this.recordValue.entityId,
        });
        result = 'Saved';
      } else {
        result = 'this record inserted before in RDBMS';
      }
    } else {
      result = 'this transaction inserted before in logs DB';
    }
    return result;
  }

  async deleteRecord(tableName, recordValue) {
    let result = '';
    const transactionId = uuidv4();
    this.tableName = tableName;
    this.recordValue = recordValue;

    // eslint-disable-next-line no-underscore-dangle
    const existTrans = await transactionMongoModel.find({ _id: transactionId });
    if (existTrans.length === 0) {
      const existRecord = await db.sequelize.query(`SELECT * FROM ${this.tableName}  WHERE id ='${this.recordValue.id}'`,
        {
          type: QueryTypes.SELECT,
        });

      if (existRecord.length > 0) {
        await db.sequelize.query(`DELETE FROM ${this.tableName}  WHERE id ='${this.recordValue.id}'`,
          {
            type: QueryTypes.DELETE,
          });
        await transactionMongoModel.create({
          _id: transactionId,
          recordId: this.recordValue.id,
          tableName: this.tableName,
          transactionType: variableNames.deleteTransaction,
          dataBefore: existRecord[0],
          changedProperties: Object.keys(existRecord[0]),
          changeSource: 'myClientDevice',
          creationTime: Date.now(),
          syncTo: ['myClientDevice'],
          entityId: this.recordValue.entityId,
        });
        result = 'Deleted';
      } else {
        result = 'this record deleted before in RDBMS';
      }
    } else {
      result = 'this transaction inserted before in logs DB please try another transaction id';
    }
    return result;
  }

  async updateRecord(tableName, recordValue) {
    let result = '';
    const transactionId = uuidv4();
    this.tableName = tableName;
    this.recordValue = recordValue;

    // eslint-disable-next-line no-underscore-dangle
    const existTrans = await transactionMongoModel.find({ _id: transactionId });
    if (existTrans.length === 0) {
      const existRecord = await db.sequelize.query(`SELECT * FROM ${this.tableName}  WHERE id ='${this.recordValue.id}'`,
        {
          type: QueryTypes.SELECT,
        });

      if (existRecord.length > 0) {
        const updateValArr = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(this.recordValue)) {
          if (key !== 'id') {
            updateValArr.push(`${key}='${value}'`);
          }
        }

        await db.sequelize.query(`UPDATE  ${this.tableName} SET  ${updateValArr.join()} WHERE id ='${this.recordValue.id}'`,
          {
            type: QueryTypes.UPDATE,
          });

        const updatedRecord = await db.sequelize.query(`SELECT * FROM ${this.tableName}  WHERE id ='${this.recordValue.id}'`,
          {
            type: QueryTypes.SELECT,
          });

        await transactionMongoModel.create({
          _id: transactionId,
          recordId: this.recordValue.id,
          tableName: this.tableName,
          transactionType: variableNames.updateTransaction,
          dataBefore: existRecord[0],
          dataAfter: updatedRecord[0],
          changedProperties: Object.keys(this.recordValue).filter((key) => key !== 'id'),
          changeSource: 'myClientDevice',
          creationTime: Date.now(),
          syncTo: ['myClientDevice'],
          entityId: this.recordValue.entityId,
        });
        result = 'Updated';
      } else {
        result = 'this record is not exist in RDBMS';
      }
    } else {
      result = 'this transaction inserted before in logs DB please try another transaction id';
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async getTransactions() {
    const result = await transactionMongoModel.find({});
    return result;
  }

  async getRecords(tableName) {
    this.tableName = tableName;
    const result = await db.sequelize.query(`SELECT * FROM ${this.tableName} `,
      {
        type: QueryTypes.SELECT,
      });
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async putActivity(host, path, payLoad) {
    this.host = host;
    this.path = path;
    this.payLoad = payLoad;
    const body = JSON.stringify(this.payLoad);
    const options = {
      host: `${this.host}`,
      path: `${this.path}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    // eslint-disable-next-line no-undef
    http.request(options, (response) => {
      let str = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        str += chunk;
      });

      // eslint-disable-next-line func-names
      response.on('end', () => {
        console.log(str);
      });
    }).end(body);
  }
}

module.exports = new MySqlTransaction();
