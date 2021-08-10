var neo4j = require('neo4j-driver')
var driver = neo4j.driver('neo4j://172.17.0.6:7687', neo4j.auth.basic('neo4j', 'r6qEpV4t'))
var session = driver.session()

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
