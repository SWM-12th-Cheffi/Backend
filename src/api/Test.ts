const debugTest = require('debug')('cheffi:test');
//router 세팅
import * as express from 'express';
const testRouter = express.Router();

// Connecting Test ( Check Post Communication with json {"title": "connecting succesful"} )
testRouter.post('/', function (req, res) {
  debugTest(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
});

export default testRouter;
