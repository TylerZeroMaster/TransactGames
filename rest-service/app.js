const express = require('express'),
      morgan = require('morgan'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      port = 3000,
      app = express(),
      ObjectId = require('mongodb').ObjectID;

const session = require('./models/mongo-session').init('TransactGames'),
      validator = require('../shared-modules/validation').validator
      hashPassword = require('../shared-modules/utils').hashPassword,
      MongoEntity = require('./models/mongo-entity').MongoEntity,
      User = require('../shared-modules/user').User;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// This endpoint creates a new user account
app.post('/signup', async (req, res) => {
  const schema = validator.getSchema('#/definitions/user');
  let user = new User(req.body.user);
  let errors = [];
  try {
    // hash the user's password before it is stored
    user.password = hashPassword(user.password);
    user.signupDate = new Date();
    user.games = [];
    if(schema(user)) {
      let mongoUser;
      mongoUser = new MongoEntity(user);
      if(await mongoUser.exists()) {
        errors.push('User already exists');
      } else {
        await mongoUser.save();
      }
    } else {
      // if there was errors in the user's information that were not caught by the 
      // sign up form, relay them back to the form
      errors.push(...schema.errors.map(e => e.message));
    }
  } catch(e) {
    errors.push('An unknown error occured. Please try again later.');
  }
  if(errors.length > 0) {
    res.status(500).send(errors);
  } else {
    res.sendStatus(200);
  }
});

// This endpoint searches for a user given their username and passwore
app.post('/signin', async (req, res) => {
  const username = req.body.username;
  let password = req.body.password;
  try {
    const userColl = await session.getCollection('user');
    password = hashPassword(password);
    const user = await userColl.findOne(
      { username, password }
    );
    if(user) {
      // Note: it might be a good idea to strip some information out of the user
      // document before sending it to the page (billing info, etc.)
      res.send(user);
    } else {
      res.sendStatus(401);
    }
  } catch(e) {
    res.status(500).send('An unknown error occured');
  }
});

// This endpoint gets all games matching a specific filter from a user's inventory
app.post('/user/:uid/games', async (req, res) => {
  try {
    const filter = req.body.filter;
    const uid = new ObjectId(req.params.uid);
    const coll = await session.getCollection('user');
    // Here we are trying to get the games that are in a specific user's inventory
    const games = await coll.aggregate([
      {
        // return one document per game the user has 
        '$unwind': {
          'path': '$games', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        // get all games where the game id or trade request is equal to the ID
        // and the trade has not been completed
        '$match': {
          '_id': uid,
          ...filter
        }
      }, {
        '$replaceRoot': {
          'newRoot': '$games'
        }
      }
    ]).toArray();
    res.send(games);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Find and return the games that match a specific filter
app.post('/games', async (req, res) => {
  try {
    const filter = req.body.filter;
    const coll = await session.getCollection('game');
    const games = await coll.find(filter).sort({ '_id': 1 }).toArray();
    res.send(games);
  } catch(e) {
    res.sendStatus(500);
  }
});

// Find and return one specific game by it's _id
app.get('/game/:gid', async (req, res) => {
  try {
    // Note, here because we are using the game collection, games' _ids are ObjectIds
    // In the user collection, games' _ids are strings
    const gid = new ObjectId(req.params.gid);
    const coll = await session.getCollection('game');
    const game = await coll.findOne({ _id: gid });
    if(game) {
      res.send(game);
    } else {
      res.sendStatus(404);
    }
  } catch(e) {
    res.sendStatus(500);
  }
});

app.get('/trade-requests', async (req, res) => {
  try {
    const gid = req.query.gid;
    const uid = new ObjectId(req.query.uid);
    const coll = await session.getCollection('user');
    // The ultimate goal of this aggregation is to get the complimentary game in the trade pair
    // For example: if someone goes to Game A's page and somone wants to trade Game B 
    // for Game A, then this aggregation will return Game B and the user ID of the 
    // user who requested the trade
    const tradeRequests = await coll.aggregate([
      {
        // return one document per game the user has 
        '$unwind': {
          'path': '$games', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        // get all games where the game id or trade request is equal to the supplied
        // game ID and the trade request exists
        '$match': {
          '$or': [
            {
              'games.tradeRequest._id': gid
            }, {
              'games._id': gid
            }
          ], 
          'games.tradeRequest': {
            '$exists': true
          },
          '_id': { '$ne': uid }
        }
      }, {
        '$project': { 
          // return the game that is not equal to the one the search was performed for
          'game': {
            '$cond': {
              'if': { '$eq': [gid, '$games._id'] },
              'then': '$games.tradeRequest',
              'else': '$games'
            }
          },
          'requested': { '$eq': [gid, '$games._id'] },
          'user': {
            '_id': '$_id'
          }
        }
      },{
        '$unset': ['game.tradeRequest', 'game.completed', '_id']
      }
    ]).toArray();
    res.send(tradeRequests);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// This endpoint is used to add a game to the user's inventory
app.patch('/add-game', async (req, res) => {
  try {
    const { uid, game } = req.body;
    const coll = await session.getCollection('user');
    const schema = validator.getSchema('#/definitions/game');
    if(schema(game)) { 
      const result = await coll.updateOne(
        { '_id': new ObjectId(uid) },
        // Use addToSet to limit users to having only one of a particular game at a time
        { '$addToSet': { 'games': game } }
      );
      if(result.modifiedCount === 0) {
        res.status(409).send('That game is already in the user\'s inventory');
      } else {
        res.sendStatus(200);
      }
    } else {
      // In this case, we don't want to give the user as much information as in
      // the sign up function because games should be taken directly from the game
      // collection. Consequently only attempted exploitation should throw this error. 
      console.log(schema.errors);
      throw new Error('The game was invalid.');
    }
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// This endpoint is used to remove a game to the user's inventory
app.patch('/remove-game', async (req, res) => {
  try {
    const { uid, gid } = req.body;
    const coll = await session.getCollection('user');
    const result = await coll.updateOne(
      { '_id': new ObjectId(uid) }, 
      {
        '$pull': {
          'games': {
            '_id': gid 
          }
        }
      }
    );
    if(result.modifiedCount === 0) {
      res.status(409).send('That game was not in the user\'s inventory');
    } else {
      res.sendStatus(200);
    }
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// This endpoint takes two arguments, p1 and p2. The p is short for participant.
// Each participant has a user and a game associated with it.
// If the user in p2 is absent, then a trade request is created. If p2 has a user,
// this endpoint performs a trade, swapping games between the two user's inventories
app.patch('/trade', async (req, res) => {
  try {
    const { p1, p2 } = req.body;
    const coll = await session.getCollection('user');
    const p1UID = new ObjectId(p1.user._id);
    const game1 = p1.game;
    const game2 = p2.game;
    const schema = validator.getSchema('#/definitions/game');
    if(schema(game1) && schema(game2)) {
      if(!p2.user) {
        const result = await coll.updateOne(
          { 
            '_id': p1UID, 
            'games._id': game1._id
          }, { 
            // https://docs.mongodb.com/manual/reference/operator/update/positional/
            '$set': { 'games.$.tradeRequest': game2 }
          }
        );
        if(result.modifiedCount === 0) {
          res.status(409).send('That game was not in the user\'s inventory');
        } else {
          res.sendStatus(200);
        }
      } else {
        const p2UID = new ObjectId(p2.user._id);
        // Check if both users have the games they are trading
        const users = await coll.find({
          '$or': [
            { 
              '_id': p1UID,
              'games._id': game1._id
            },
            { 
              '_id': p2UID,
              'games._id': game2._id
            },
          ]
        }).toArray();
        if(users.length === 2) {
          const updateUser1Result = coll.updateOne(
            {
              '_id': p1UID,
              'games._id': game1._id
            }, {
              '$set': { 'games.$': game2 }
            }
          );
          const updateUser2Result = coll.updateOne(
            {
              '_id': p2UID,
              'games._id': game2._id
            }, {
              '$set': { 'games.$': game1 }
            }
          );
          if(updateUser1Result.modifiedCount === 0 
              || updateUser2Result.modifiedCount === 0
          ) {
            throw new Error('Could not update both users\' games.');
          } else {
            res.sendStatus(200);
          }
        } else {
          throw new Error('Both users and their games could not be found.');
        }
      } 
    } else {
      // Again, this error should only occur if someeone is trying to
      // run an exploit
      throw new Error('One of the games traded was invalid.')
    }
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// This endpoint removes a tradeRequest from a game in a user's inventory
app.delete('/trade-request', async (req, res) => {
  try {
    const uid = new ObjectId(req.query.uid);
    const gid = req.query.gid;
    const coll = await session.getCollection('user');
    const result = coll.updateOne(
      {
        '_id': new ObjectId(uid), 
        'games._id': gid
      }, {
        '$unset': {
          'games.$.tradeRequest': 1
        }
      }
    );
    if(result.modifiedCount === 0) {
      res.status(409).send('That game was not in the user\'s inventory');
    } else {
      res.sendStatus(200);
    }
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// This endpoint is used by the RemoteChipGroup to get a list of chip values
app.get('/distinct', async (req, res) => {
  // Limit the amount of information that can be selected
  const whiteList = {
    game: ['publisher', 'genre', 'title']
  };
  const collName = req.query.coll;
  const property = req.query.property;
  if(!(collName in whiteList) 
      || whiteList[collName].indexOf(property) === -1) {
    res.sendStatus(403);
  } else {
    try {
      const coll = await session.getCollection(collName);
      const result = await coll.distinct(property);
      res.send(result);
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});