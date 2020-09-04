const session = require('./mongo-session').session,
      validator = require('../../shared-modules/validation').validator;

class MongoEntity {
  constructor(baseEntity) {
    this.baseEntity = baseEntity;
  }

  get collection() {
    return session.getCollection(this.baseEntity.className);
  }

  async find() {
    return (await this.collection).findOne(this.baseEntity.primaryKey);
  }

  async exists() {
    return !!(await this.find());
  }

  async save() {
    const schema = validator.getSchema(`#/definitions/${this.baseEntity.className}`);
    // use the schema to validate the information in this class
    if(schema(this.baseEntity)) {
      return (await this.collection).findOneAndUpdate(
        this.baseEntity.primaryKey,
        { $set: this.baseEntity },
        { upsert: true }
      );
    } else {
      throw new Error(`Invalid input for ${this.baseEntity.className}`);
    }
  }
}

module.exports = {
  MongoEntity
};