const Recipe = require('../model/recipe');
const User = require('../model/user');

//router 세팅
import * as express from 'express';
const userRouter = express.Router();

// Test InputData
var UserLikeInfo: string[] = ['짜장면', '짬뽕'];

// 좋아하는 음식을 저장
userRouter.post('/SaveLikeDemo', function (req, res) {
  let postLikeData: string[] = req.body.like;
  UserLikeInfo = postLikeData;
  res.send(UserLikeInfo);
});

// 해당 요리를 끝마쳤다는 정보를 받은 뒤 추천 반영
userRouter.post('/FineCook', function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
});

// 재료를 검색할 때 동적으로 반응하여 보여주는 기능
userRouter.post('/ShowIGDynamic', function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
});

export default userRouter;
