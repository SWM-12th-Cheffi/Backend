import authz from '../function/Authorization';
import * as express from 'express';
const authRouter = express.Router();

authRouter.post('/', async function (req, res) {
  let authorizationHeader: string = String(req.headers['Authorization']).split(' ')[1];
  res.send(await authz(authorizationHeader, req.body.platform, -1));
});

export default authRouter;
