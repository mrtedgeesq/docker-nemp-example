var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Api says Hola');
});

router.route('/ping')

  //get all archived batches
  .get(function(req, res) {
      res.send('Pong');
  });

module.exports = router;
 