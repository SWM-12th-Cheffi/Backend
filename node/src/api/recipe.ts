//router 세팅
import * as express from 'express';
const recipeRouter = express.Router();

var neo4j = require('neo4j-driver');
//local
//var driver = neo4j.driver('neo4j://18.220.121.204:7687', neo4j.auth.basic('neo4j', 'r6qEpV4t'));
//server
var driver = neo4j.driver('neo4j://172.29.0.4:7687', neo4j.auth.basic('neo4j', 'r6qEpV4t'));
var session = driver.session();

//Recc 세팅
import axios from 'axios';
//local
//var pyAddr: string = 'http://172.17.0.2:3001/recc';
//server
var pyAddr: string = 'http://172.29.0.2:3001/recc';

// Test InputData
var UserLikeInfo: string[] = ['짜장면', '짬뽕'];

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능(유사재료 검색 미포함)
recipeRouter.post('/NumPossiRP', function (req, res) {
  console.time('NumPossiRP');
  let ingreData: string[] = req.body.ingre;
  let query: string =
    'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
    CoverWithQuotation(ingreData) +
    ']) RETURN count(r) AS count';
  session.readTransaction(function (tx: any) {
    return tx
      .run(query)
      .then(function (resNeo: any) {
        let ret: string = resNeo.records[0].get('count').low;
        console.log('반환값: ' + ret); // 9
        res.send(String(ret));
        console.timeEnd('NumPossiRP');
      })
      .catch(function (error: string) {
        console.log('에러: ' + error);
        console.timeEnd('NumPossiRP');
      });
  });
});

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능(유사재료 검색 포함)
recipeRouter.post('/NumPossiRP_Sim', function (req, res) {
  console.time('NumPossiRP_Sim');
  let ingreData: string[] = req.body.ingre;
  let query: string =
    'MATCH (i:Ingredient)-[:SIMILAR]->(r:Ingredient) WHERE i.name in [' +
    CoverWithQuotation(ingreData) +
    '] RETURN COLLECT(r.name) AS similar';
  session.readTransaction(function (tx: any) {
    return tx
      .run(query)
      .then(function (resNeo: any) {
        let ret: string[] = resNeo.records[0].get('similar');
        console.log('중간값: ' + ret);
        query =
          'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
          CoverWithQuotation(ingreData) +
          ', ' +
          CoverWithQuotation(ret) +
          ']) RETURN count(r) AS count';
        return tx.run(query);
      })
      .then(function (resNeo: any) {
        let ret: string = resNeo.records[0].get('count').low;
        console.log('반환값: ' + ret); // 10
        res.send(String(ret));
        console.timeEnd('NumPossiRP_Sim');
      })
      .catch(function (error: string) {
        console.log('에러: ' + error);
        console.timeEnd('NumPossiRP_Sim');
      });
  });
});

// 재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수 (유사재료 검색 미포함)
recipeRouter.post('/ListPossiRP', function (req, res) {
  console.time('ListPossiRP');
  let ingreData: string[] = req.body.ingre;
  let query: string =
    'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
    CoverWithQuotation(ingreData) +
    ']) RETURN COLLECT(r.id) AS recipe';
  session.readTransaction(function (tx: any) {
    return tx
      .run(query)
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
        console.log('반환값: ' + resPy.data.id); // 5802,5889,5971,5909,5738,5929,5939,5420,5869,5915,5590,5549
        res.send(resPy.data.id);
        console.timeEnd('ListPossiRP');
      })
      .catch(function (error: string) {
        console.log('에러: ' + error);
        console.timeEnd('ListPossiRP');
      });
  });
});

// 재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수 (유사재료 검색 포함)
recipeRouter.post('/ListPossiRP_Sim', function (req, res) {
  console.time('ListPossiRP_Sim');
  let ingreData: string[] = req.body.ingre;
  let query: string =
    'MATCH (i:Ingredient)-[:SIMILAR]->(r:Ingredient) WHERE i.name in [' +
    CoverWithQuotation(ingreData) +
    '] RETURN COLLECT(r.name) AS similar';
  session.readTransaction(function (tx: any) {
    return tx
      .run(query)
      .then(function (resNeo: any) {
        let ret: string[] = resNeo.records[0].get('similar');
        console.log('중간값: ' + ret);
        query =
          'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
          CoverWithQuotation(ingreData) +
          ', ' +
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
          url: 'http://172.17.0.2:3001/recc',
          data: reccObj,
        });
      })
      .then(function (resPy: any) {
        console.log('반환값: ' + resPy.data.id); // 5802,5889,5971,5909,5738,5929,5939,5420,5869,5915,5590,5549
        res.send(resPy.data.id);
        console.timeEnd('ListPossiRP_Sim');
      })
      .catch(function (error: string) {
        console.log('에러: ' + error);
        console.timeEnd('NumPossiRP_Sim');
      });
  });
});

// 특정 레시피의 정보를 반환하는 기능
recipeRouter.post('/ShowRPInspect', function (req, res) {
  console.log('ShowRPInspect Function is Request');
  // mongodb에 데이터 저장후 사용 예정
});

function CoverWithQuotation(list: string[]) {
  let tmp: string[] = Object.assign([], list);
  for (let i in tmp) {
    tmp[i] = "'" + tmp[i] + "'";
  }
  return tmp;
}

function ShowRecipeWithID(sendId: string[], postres: any) {
  //console.log(sendId);
  let modId: string[] = sendId.slice();
  for (let i in modId) {
    modId[i] = "'" + modId[i] + "'";
  }
  //console.log(sendId);
  session.readTranㄴsaction(function (tx: any) {
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
