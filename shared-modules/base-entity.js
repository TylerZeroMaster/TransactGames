class BaseEntity {
  // This is used in MongoEntity to uniquely identify each entity occurence
  // by default, use the entire document as a primary key
  get primaryKey() {
    return this;
  }

  // This defines the schema to use to validate the entity and the MongoDB collection to use
  // Should be overriden in derived classes
  get className() {
    throw new Error('Class name not implemented');
  }
}

module.exports = {
  BaseEntity
}