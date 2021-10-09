import authz from '../function/Authorization';
import * as express from 'express';
const authRouter = express.Router();
const debug = require('debug')('Cheffi:Auth');

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

export default authRouter;
