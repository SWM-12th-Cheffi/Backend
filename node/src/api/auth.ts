import authz from '../function/Authorization';
import * as express from 'express';
const authRouter = express.Router();
const debug = require('debug')('Cheffi:Auth');

authRouter.post('/', async function (req, res) {
  console.log('Authorization Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']).split(' ')[1];
  let returnStructure = await authz(authorizationToken, authorizationPlatform, -1);
  res.statusMessage = returnStructure.header.message;
  res.status(returnStructure.header.status).json(returnStructure.auth);
});

export default authRouter;
