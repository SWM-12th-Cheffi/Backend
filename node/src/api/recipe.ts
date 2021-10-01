//router setting
import * as express from 'express';
import CoverWithQuotation from '../function/CoverWithQuotation';
const recipeRouter = express.Router();

//mongoDB setting
var Recipe = require('../model/RecipeModel');

//neo4j setting
var neo4j = require('neo4j-driver');
var driver = neo4j.driver(String(process.env.NEO_ADDR), neo4j.auth.basic('neo4j', 'r6qEpV4t'));
var session = driver.session();

//Recc setting
import axios from 'axios';
var pyAddr: string = String(process.env.PYTHON_ADDR);

// Test InputData
var UserLikeInfo: string[] = ['짜장면', '짬뽕'];

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능  fin
recipeRouter.post('/NumPossiRP', function (req, res) {
  let ingreData: string[] = req.body.ingre;
  let query: string =
    'MATCH (i:Input)-[:ELEMENT]->(r:Ingredient) WHERE i.name in [' +
    CoverWithQuotation(ingreData) +
    '] RETURN COLLECT(r.name) AS element';
  session.readTransaction(function (tx: any) {
    return tx
      .run(query)
      .then(function (resNeo: any) {
        let ret: string[] = resNeo.records[0].get('element');
        console.log('중간값: ' + ret);
        query =
          'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
          CoverWithQuotation(ret) +
          ']) RETURN count(r) AS count';
        return tx.run(query);
      })
      .then(function (resNeo: any) {
        let ret: string = resNeo.records[0].get('count').low;
        console.log('반환값: ' + ret); // 10
        res.send({ num: String(ret) });
      })
      .catch(function (error: string) {
        console.log('에러: ' + error);
      });
  });
});

// 재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수  fin
recipeRouter.post('/ListPossiRP', function (req, res) {
  let ingreData: string[] = req.body.ingre;
  let query: string =
    'MATCH (i:Input)-[:ELEMENT]->(r:Ingredient) WHERE i.name in [' +
    CoverWithQuotation(ingreData) +
    '] RETURN COLLECT(r.name) AS element';
  session.readTransaction(function (tx: any) {
    return tx
      .run(query)
      .then(function (resNeo: any) {
        let ret: string[] = resNeo.records[0].get('element');
        console.log('중간값: ' + ret);
        query =
          'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
          CoverWithQuotation(ret) +
          ']) RETURN COLLECT(r.id) AS recipe';
        return tx.run(query);
      })
      .then(function (resNeo: any) {
        let retIdList: string[] = resNeo.records[0].get('recipe');
        console.log('중간값: ' + retIdList); // 5963,5929,5908,5900,5887,5590,5549,5442,5420
        var reccObj = Object();
        reccObj.id = retIdList; // User가 만들 수 있는 Recipe.id 값
        reccObj.like = UserLikeInfo; // User가 좋아하는 Recipe.id 값
        return axios({
          method: 'post',
          //server
          url: pyAddr,
          data: reccObj,
        });
      })
      .then(function (resPy: any) {
        let recipeidList = resPy.data.id;
        console.log('반환값: ' + recipeidList); // 5802,5889,5971,5909,5738,5929,5939,5420,5869,5915,5590,5549
        Recipe.ListPossiRP(recipeidList).then((resMon: any) => {
          let resMonObjectbyRecc: any = {};
          for (let i in resMon) {
            resMonObjectbyRecc[resMon[i].recipeid] = resMon[i];
          }
          let resMonListbyRecc = [];
          for (let i in recipeidList) {
            resMonListbyRecc.push(resMonObjectbyRecc[recipeidList[i]]);
          }
          res.send(resMonListbyRecc);
        });
      })
      .catch(function (error: string) {
        console.log('에러: ' + error);
      });
  });
});

// 레시피의 정보를 해먹에서 반환하는 기능 fin
recipeRouter.post('/find/Recipe', function (req, res) {
  console.time('findRecipe');
  Recipe.findByRecipeid(req.body.id)
    .then((result: any) => {
      if (!result) return res.status(404).send({ err: 'Recipe not found' });
      res.send(result);
      console.timeEnd('findRecipe');
    })
    .catch((err: any) => res.status(500).send(err));
});

// 처음 사용자 데이터 받을 때 보여줄 랜덤 레시피
recipeRouter.post('/randomRecipeList', function (req, res) {
  console.time('randomRecipeList');
  Recipe.randomRecipe(req.body.num).then((result: number) => {
    res.send({ recipe: result });
  });
  console.timeEnd('randomRecipeList');
});

function ShowRecipeWithID(sendId: string[], postres: any) {
  //console.log(sendId);
  let modId: string[] = sendId.slice();
  for (let i in modId) {
    modId[i] = "'" + modId[i] + "'";
  }
  //console.log(sendId);
  session.readTransaction(function (tx: any) {
    return tx
      .run('MATCH (n:Recipe) WHERE n.id in [' + modId + '] return n as recipe')
      .then(function (res: any) {
        let reccResult: any[] = [];
        let reccLen: number = res.records.length;
        for (let i in res.records) {
          reccResult.push(res.records[i].get('recipe').properties);
        }
        let retlist: object[] = [];
        for (let i in sendId) {
          for (let j in reccResult) {
            if (String(reccResult[j].id) == sendId[i]) {
              retlist.push(reccResult[j]);
              break;
            }
          }
        }
        postres.send(retlist);
      })
      .catch(function (error: string) {
        console.log(error);
      });
  });
}

export default recipeRouter;
