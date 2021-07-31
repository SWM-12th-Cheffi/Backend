import * as express from "express";
import { addAbortSignal } from "stream";

var bodyParser = require('body-parser');
var mysql = require('mysql');
var mysql_connection = mysql.createConnection({
  host:     'localhost',
  user:     'user',
  password: 'password',
  database: 'database'
});

//import AddIG from "./func/AddIG"

const app: express.Application = express();
app.use(bodyParser.json());

app.get(
  '/', 
  function (req, res) {
  res.send('Connecting GET Test Is OK');
})

// Connecting Test ( Check Post Communication with json {"title": "connecting succesful"} )
app.post(
  '/', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})


// 냉장고에 재료를 추가하는 기능
app.post(
  '/AddIG', 
  function (req, res) {
  let postIngreData: string = req.body.title;
  let results: string = AddIG(postIngreData);
  //console.log(ingre);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})

function AddIG(ingre: string){
  mysql_connection.connect();
  mysql_connection.query('queryquery', function(error: string, results: string, fields: string){
    if (error) console.log(error);
    //results로 함수 구현
    //https://berkbach.com/node-js에서-mysql-사용하기-1-b4b69ce7433f
  })

  mysql_connection.end();
  let results: string = "test"; 
  return results;
}

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능
app.post(
  '/NumPossiRP', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})

// 재료를 통해 만들 수 있는 레시피 목록을 반환하는 기능
app.post(
  '/ListPossiRP', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
})

// 특정 레시피의 정보를 반환하는 기능
app.post(
  '/ShowRPInspect', 
  function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
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

export default app;