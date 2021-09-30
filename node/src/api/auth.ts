//mongoDB 설정
var User = require('../model/userModel');
import authz from '../function/Authorization';

//router 세팅
import * as express from 'express';
const authRouter = express.Router();

authRouter.post('/', async function (req, res) {
  console.log('Authentication');
  res.send(await authz(req.body.token, req.body.platform, 2, true));
});

/*
  verify()
    .then(() => {
      console.timeEnd('Auth');
    })
    .catch((err) => {
      console.error(err);
      console.timeEnd('Auth');
    });
    */

function kakaoErrorChecking(err: any) {
  console.log(err);
  if (err.response.status == 401) {
    console.log('No Authentication');
  }
  console.log(err.response.status);
  console.timeEnd('kakao');
}

authRouter.post('/info', function (req, res) {
  console.log('Post User Info to Front');
  console.time('info');

  let token = req.body.token;
  User.findOneByUserToken(token).then((result: any) => {
    let openedInfo = {
      nickname: result.nickname,
      statusMessage: result.statusMessage,
      photo: result.photo,
      dislikeIngredient: result.dislikeIngredient,
      scrapRecipesId: result.scrapRecipesId,
      likeRecipesId: result.likeRecipesId,
      historyRecipesId: result.historyRecipesId,
      refriger: result.refriger,
    };
    res.send(openedInfo);
    console.timeEnd('info');
  });
});

export default authRouter;
