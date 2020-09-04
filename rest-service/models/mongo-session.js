const MongoClient = require("mongodb").MongoClient;
let _session = null;

// This class is used to store a constant connection to the MongoDB server
class MongoSession {
  constructor(dbName, url) {
    this._connection = null;
    url = url || 'mongodb://127.0.0.1:27017/';
    this.client = new MongoClient(url, 
      { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = dbName;
  }
  
  async getConnection() {
    if(!this._connection) {
      this._connection = await this.client.connect();
    }
    return this._connection;
  }

  async getDb(dbName) {
    return (await this.getConnection()).db(dbName);
  }

  async getCollection(collName) {
    return (await this.getDb(this.dbName)).collection(collName);
  }

  close() {
    if(this._connection) {
      this._connection.close();
    }
  }
}

module.exports = { 
  MongoSession, 
  init(dbName, url) {
    _session = new MongoSession(dbName, url);
    return _session;
  }, 
  get session() {
    if(!_session) {
      throw new Error('Must call init before using session');
    }
    return _session;
  }
};