var neo4j = require('neo4j-driver')
//local
//var driver = neo4j.driver('neo4j://18.220.121.204:7687', neo4j.auth.basic('neo4j', 'r6qEpV4t'))
//server
var driver = neo4j.driver('neo4j://172.17.0.6:7687', neo4j.auth.basic('neo4j', 'r6qEpV4t'))
var session = driver.session()

import axios from "axios";

export function NumPossiRP(ingre: string[], postres: any){
    session.readTransaction(function (tx: any) {
      return tx.run(
        "MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [" + ingre + "]) RETURN count(r.title) AS count"
      )
        .then(function (res: any) {
          let ret: string = res.records[0].get('count').low;
          //console.log(ret);
          postres.send(String(ret));
        })
        .catch(function (error: string) {
          console.log(error)
        })
    }) 
}

export function ListPossiRP(ingre: string[], postres: any){
  session.readTransaction(function (tx: any) {
    return tx.run(
      "MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [" + ingre + "]) RETURN r AS recipe"
    )
      .then(function (res: any) {
        let retlist:object[] = [];
        for(let i in res.records){
          retlist.push(res.records[i].get('recipe').properties);
        }
        //console.log(retlist);
        postres.send(retlist);
      })
      .catch(function (error: string) {
        console.log(error)
      })
  }) 
}

export function ListPossiRPWithRecc(ingre: string[], userlike: string[],postres: any){
  session.readTransaction(function (tx: any) {
    return tx.run(
      "MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [" + ingre + "]) RETURN r.id AS recipe"
    )
      .then(function (res: any) {
        var member = Object()
        member.id = [];
        for(let i in res.records){
          member.id.push(Number(res.records[i].get('recipe')));
        }
        member.like = userlike
        axios({
          method: 'post',
          //local
          //url: 'http://172.17.0.3:3001/recc',
          //server
          url: 'http://172.17.0.2:3001/recc',
          data: member
        }).then(function(response){
          ShowRecipeWithID(response.data.id, postres);
        });
      })
      .catch(function (error: string) {
        console.log(error)
      })
  }) 
}

function ShowRecipeWithID(id: string[], postres: any){
  for(let i in id){
    id[i] = "'"+ id[i] + "'";
  }
  session.readTransaction(function (tx: any) {
    return tx.run(
      "MATCH (n:Recipe) WHERE n.id in [" + id + "] return n as recipe"
    )
      .then(function (res: any) {
        let retlist:object[] = [];
        for(let i in res.records){
          retlist.push(res.records[i].get('recipe').properties);
        }
        //console.log(retlist);
        postres.send(retlist);
      })
      .catch(function (error: string) {
        console.log(error)
      })
  }) 
}

export function ShowRPInspect(id: string[], postres: any){
  session.readTransaction(function (tx: any) {
    return tx.run(
      "MATCH (r:Recipe{id:'"+ id +"'})<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient RETURN r as recipe, ingredient"
    )
      .then(function (res: any) {
        let ret: any = res.records[0].get('recipe').properties;
        ret.ingredient = res.records[0].get('ingredient');;
        postres.send(ret);
        //console.log(ret);
      })
      .catch(function (error: string) {
        console.log(error)
      })
  }) 
}


