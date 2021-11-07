import authz from '../function/Authorization';
import * as express from 'express';
const authRouter = express.Router();
const debugAuth = require('debug')('cheffi:auth');
const errorAuth = require('debug')('cheffi:auth:error');

//redis setting
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_ADDR);

authRouter.post('/', async function (req, res) {
  debugAuth('Authorization Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  let returnStructure = await authz(authorizationToken, authorizationPlatform, -1);
  res.statusMessage = returnStructure.header.message;
  res
    .status(returnStructure.header.status)
    .json({ auth: returnStructure.auth, info: returnStructure.info, refriger: returnStructure.refriger });
});

authRouter.get('/expire-time', function (req, res) {
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  debugAuth('Expire Time Check : ' + authorizationToken);
  client.ttl(String(authorizationToken), (err: any, result: string) => {
    if (err) {
      errorAuth('Redis Error');
      res.statusMessage = 'Redis Error';
      res.status(500).send();
    }
    if (result == String(-1)) {
      errorAuth('Have No Expiration Time');
      res.statusMessage = 'Have No Expiration Time';
      res.status(404).send();
    } else if (result == String(-2)) {
      errorAuth('Not Found');
      res.status(404).send();
    } else {
      debugAuth(result + '(s) Remain');
      res.statusMessage = 'Load Success';
      res.status(200).json({ timeToExpire: result });
    }
  });
});

authRouter.delete('/expire-time', function (req, res) {
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  debugAuth('Delete Expire Time : ' + authorizationToken);
  client.del(String(authorizationToken), (err: any, result: string) => {
    if (err) {
      errorAuth('Redis Error' + err);
      res.statusMessage = 'Redis Error(1)';
      res.status(500).send();
    }
    if (result == String(1)) {
      debugAuth('Delete Success');
      res.statusMessage = 'Delete Success';
      res.status(201).send();
    } else if (result == String(0)) {
      errorAuth('Not Found');
      res.status(404).send();
    } else {
      errorAuth('Redis Error: ' + err);
      res.statusMessage = 'Redis Error(3)';
      res.status(500).send();
    }
  });
});

export default authRouter;
