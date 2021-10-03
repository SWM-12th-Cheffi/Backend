import authz from '../function/Authorization';
import * as express from 'express';
const authRouter = express.Router();

authRouter.post('/', async function (req, res) {
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']).split(' ')[1];
  res.send(await authz(authorizationToken, authorizationPlatform, -1));
});

export default authRouter;
