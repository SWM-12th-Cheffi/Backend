import * as express from "express";
import { addAbortSignal } from "stream";
import {NumPossiRP, ListPossiRP, ListPossiRPWithRecc, ShowRPInspect} from "./func/function";
import axios from "axios";

const app: express.Application = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var UserLikeInfo: string[] = ["짜장면", "짬뽕"];

app.get(
  '/', 
  function (req, res) {
  res.send('Connecting GET Test Is OK!!');
})

// Connecting Test ( Check Post Communication with json {"title": "connecting succesful"} )
app.post(
  '/', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})

/*
// 냉장고에 재료를 추가하는 기능
app.post(
  '/AddIG', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})
*/

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능
app.post(
  '/NumPossiRP', 
  function (req, res) {
  let postIngreData: string[] = req.body.ingre;
  for(let i in postIngreData){
      postIngreData[i] = "'" + postIngreData[i] + "'";
  }
  //console.log(postIngreData);
  NumPossiRP(postIngreData, res)
})

// 재료를 통해 만들 수 있는 레시피 목록을 반환하는 기능
app.post(
  '/ListPossiRP', 
  function (req, res) {
  let postIngreData: string[] = req.body.ingre;
  for(let i in postIngreData){
    postIngreData[i] = "'" + postIngreData[i] + "'";
  }
  //console.log(postIngreData);
  ListPossiRP(postIngreData, res)
})

app.post( // Front에서 ingre 목록을 줌.
  '/ListPossiRPWithRecc', 
  function (req, res) {
  let postIngreData: string[] = req.body.ingre;
  for(let i in postIngreData){
    postIngreData[i] = "'" + postIngreData[i] + "'";
  }
  //console.log(postIngreData);
  ListPossiRPWithRecc(postIngreData, UserLikeInfo, res)
})

app.post( // 좋아하는 음식을 저장
  '/SaveLikeDemo', 
  function (req, res) {
  let postLikeData: string[] = req.body.like;
  for(let i in postLikeData){
    postLikeData[i] = "'" + postLikeData[i] + "'";
  }
  UserLikeInfo = postLikeData;
  res.send(UserLikeInfo);
  //console.log(postIngreData);
})

// 특정 레시피의 정보를 반환하는 기능
app.post(
  '/ShowRPInspect', 
  function (req, res) {
  //console.log(req.body.id);
  ShowRPInspect(req.body.id, res);
  //res.send('Connecting POST Test Is OK, Title Value is ' + req.body.id);
})

// 해당 요리를 끝마쳤다는 정보를 받은 뒤 추천 반영
app.post(
  '/FineCook', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})

// 재료를 검색할 때 동적으로 반응하여 보여주는 기능
app.post(
  '/ShowIGDynamic', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})

// 레시피 목록을 선호도를 기반으로 정렬하는 기능
app.post(
  '/OrderByFavorite', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})

app.post(
  '/Recc', 
  function (req, res) {
    axios({
      method: 'post',
      url: 'http://172.17.0.2:3001/recc',
      data: req.body
    }).then(function(response){
      res.send(response.data);
    });
  
})

export default app;