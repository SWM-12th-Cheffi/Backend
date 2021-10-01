import authz from '../function/Authorization';
import * as express from 'express';
const authRouter = express.Router();

authRouter.post('/', async function (req, res) {
  res.send(await authz(req.body.token, req.body.platform, -1));
});

export default authRouter;
