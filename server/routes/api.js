var express = require('express');
var router = express.Router();

// Database Access
var mongoose = require('mongoose');

var dbConnected = false;

// Connect to the database. 
//'mongo' is defined in docker-compose.yaml and is added to /etc/hosts in the container
// /stuff is the database document we want to access
var dbLocation = 'mongodb://mongo:27017/stuff';

// Initiate the connection to the db
mongoose.connect(dbLocation);

//Once we have a connection pending, set up notifications for a successful or unsuccessful connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:')); // Without this the app will not start if the db doesn't connect
db.once('open', function() {
    console.log('db connected');
    dbConnected = true;
});

// Set up the database schema + model
var messageSchema = mongoose.Schema({content: String}); // Define a simple schema for Message, which just has a content property in it
var Message = mongoose.model('Message', messageSchema); // Compile the schema into a model

router.get('/', function(req, res, next) {
  res.send('Api says Hola');
});

//Route to test db connection
router.route('/ping')

  //get all archived batches
  .get(function(req, res) {
      res.send('Pong');
  });

//Route to check connections
router.route('/test')
    .get(function(req, res) {
        res.send(
            {
                connections: {
                    server: true,
                    db: dbConnected
                }
            }
        )
    });

//Gets and sets a message from the db
router.route('/messages')
    .get(function(req, res) {
        listMessages(res);
    })

    .post(function(req, res) {
        var content = req.body.message;
        console.log(req.body);
        if (!content) {
            console.log('No content in message');
            return res.send('No content in message');
        }
        
        var message = new Message();
        message.content = content;
        message.save(function(err){
            if (err) return res.send(err);
            listMessages(res);
        });
    });

function listMessages(res) {
    Message.find(function(err, messages) {
        if (err) return res.send(err);
        res.json(messages);
    });
}
module.exports = router;
 