import authz from '../function/Authorization';
import * as express from 'express';
const authRouter = express.Router();
const debug = require('debug')('Cheffi:Auth');

//redis setting
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_ADDR);

authRouter.post('/', async function (req, res) {
  console.log('API:AUTH Authorization Api Called');
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
  console.log('API:AUTH Expire Time Check');
  client.ttl(String(authorizationToken), (err: any, result: string) => {
    if (err) {
      res.statusMessage = 'Redis Error';
      res.status(500).send();
    }
    if (result == String(-1)) {
      res.statusMessage = 'Have No Expiration Time';
      res.status(404).send();
    } else if (result == String(-2)) {
      res.status(404).send();
    } else {
      console.log(result + '(s) Remain');
      res.statusMessage = 'Load Success';
      res.status(201).json({ timeToExpire: result });
    }
  });
});

export default authRouter;
