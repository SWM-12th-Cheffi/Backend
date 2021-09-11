//router 세팅
import * as express from "express";
const recipeRouter = express.Router();

var neo4j = require('neo4j-driver')
//local
//var driver = neo4j.driver('neo4j://18.220.121.204:7687', neo4j.auth.basic('neo4j', 'r6qEpV4t'))
//server
var driver = neo4j.driver('neo4j://172.29.0.4:7687', neo4j.auth.basic('neo4j', 'r6qEpV4t'))
var session = driver.session()
import axios from "axios";

// Test InputData
var UserLikeInfo: string[] = ["짜장면", "짬뽕"];

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능
recipeRouter.post('/NumPossiRP', function (req, res) {
    console.log("NumPossiRP Function is Request")
    let postIngreData: string[] = req.body.ingre;
    for(let i in postIngreData){
        postIngreData[i] = "'" + postIngreData[i] + "'";
    }

    session.readTransaction(function (tx: any) {
        return tx.run(
        "MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [" + postIngreData + "]) RETURN count(r) AS count"
        )
        .then(function (resNeo: any) {
            let ret: string = resNeo.records[0].get('count').low;
            console.log(ret);
            res.send(String(ret));
        })
        .catch(function (error: string) {
            console.log(error)
        })
    }) 
  })
  
  // 재료를 통해 만들 수 있는 레시피 목록을 반환하는 기능
  recipeRouter.post('/ListPossiRP', function (req, res) {
    console.log("ListPossiRP Function is Request")
    let postIngreData: string[] = req.body.ingre;
    for(let i in postIngreData){
      postIngreData[i] = "'" + postIngreData[i] + "'";
    }

    session.readTransaction(function (tx: any) {
        return tx.run(
        "MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [" + postIngreData + "]) RETURN r AS recipe"
        )
        .then(function (resNeo: any) {
            let retlist:object[] = [];
            for(let i in resNeo.records){
            retlist.push(resNeo.records[i].get('recipe').properties);
            }
            //console.log(retlist);
            res.send(retlist);
        })
        .catch(function (error: string) {
            console.log(error)
        })
    }) 
  })
  
  // Front에서 ingre 목록을 줌.
  recipeRouter.post( '/ListPossiRPWithRecc', function (req, res) {
    console.log("ListPossiRPWithRecc Function is Request")
    let postIngreData: string[] = req.body.ingre;
    for(let i in postIngreData){
      postIngreData[i] = "'" + postIngreData[i] + "'";
    }

    session.readTransaction(function (tx: any) {
        return tx.run(
        "MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [" + postIngreData + "]) RETURN r.id AS recipe"
        )
        .then(function (resNeo: any) {
            var member = Object()
            member.id = [];
            for(let i in resNeo.records){
            member.id.push(Number(resNeo.records[i].get('recipe')));
            }
            member.like = UserLikeInfo
            axios({
            method: 'post',
            //local
            //url: 'http://172.17.0.3:3001/recc',
            //server
            url: 'http://172.17.0.2:3001/recc',
            data: member
            }).then(function(resPy){
            ShowRecipeWithID(resPy.data.id, res);
            });
        })
        .catch(function (error: string) {
            console.log(error)
        })
    }) 

  })
  
  // 특정 레시피의 정보를 반환하는 기능
  recipeRouter.post('/ShowRPInspect', function (req, res) {
    console.log("ShowRPInspect Function is Request")
    session.readTransaction(function (tx: any) {
        return tx.run(
        "MATCH (r:Recipe{id:'"+ req.body.id +"'})<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient RETURN r as recipe, ingredient"
        )
        .then(function (resNeo: any) {
            let ret: any = resNeo.records[0].get('recipe').properties;
            ret.ingredient = resNeo.records[0].get('ingredient');;
            res.send(ret);
            //console.log(ret);
        })
        .catch(function (error: string) {
            console.log(error)
        })
    }) 
  })




function ShowRecipeWithID(sendId: string[], postres: any){
    //console.log(sendId);
    let modId: string[] = sendId.slice()
    for(let i in modId){
      modId[i] = "'"+ modId[i] + "'";
    }
    //console.log(sendId);
    session.readTransaction(function (tx: any) {
      return tx.run(
        "MATCH (n:Recipe) WHERE n.id in [" + modId + "] return n as recipe"
      )
        .then(function (res: any) {
          let reccResult:any[] = [];
          let reccLen:number = res.records.length;
          for(let i in res.records){
            reccResult.push(res.records[i].get('recipe').properties);
          }
          let retlist:object[] = [];
          for(let i in sendId){
              for(let j in reccResult){
                if(String(reccResult[j].id) == sendId[i]){
                  retlist.push(reccResult[j]);
                  break;
                }
              }
          }
          postres.send(retlist);
          }
        )
        .catch(function (error: string) {
          console.log(error)
        })
    }) 
  }


  
  export default recipeRouter;