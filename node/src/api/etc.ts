//const Recipe = require('../model/recipe');
//const User = require('../model/user');

//router 세팅
import * as express from 'express';
const etcRouter = express.Router();

import axios from 'axios';

// 레시피 목록을 선호도를 기반으로 정렬하는 기능
etcRouter.post('/OrderByFavorite', function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
});

// 재료를 입력받으면
etcRouter.post('/Recc', function (req, res) {
  axios({
    method: 'post',
    url: 'http://172.17.0.2:3001/recc',
    data: req.body,
  }).then(function (resPy) {
    res.send(resPy.data);
  });
});

export default etcRouter;
