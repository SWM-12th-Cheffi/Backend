//neo4j setting
var neo4j = require('neo4j-driver');
var driver = neo4j.driver(String(process.env.NEO_ADDR), neo4j.auth.basic('neo4j', 'r6qEpV4t'));
var session = driver.session();
const debugneo4j = require('debug')('cheffi:neo4j');
const errorneo4j = require('debug')('cheffi:neo4j:error');

//mongoDB setting
var Recipe = require('../model/RecipeModel');

import { CoverWithQuotation } from './RecipeFunction';

// 프론트에서 입력받은 재료의 Element 관계에 있는 재료로 List 만들어 반환
export async function IngredElementOfInput(input: string[]) {
  let query: string =
    'MATCH (i:Input)-[:ELEMENT]->(r:Ingredient) WHERE i.name in [' +
    CoverWithQuotation(input) +
    '] RETURN COLLECT(r.name) AS element';
  return session
    .readTransaction(function (tx: any) {
      return tx.run(query);
    })
    .then(function (resNeo: any) {
      let elementIngredientList: string[] = resNeo.records[0].get('element');
      debugneo4j('Func elementIngredientList Return');
      return elementIngredientList;
    })
    .catch(function (error: string) {
      errorneo4j('In elementIngredientList: ' + error);
    });
}

// element 재료 리스트로 만들 수 있는 레시피의 개수를 반환
export async function NumberOfPossiRP(ingredient: string[]) {
  let query: string =
    'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
    CoverWithQuotation(ingredient) +
    ']) RETURN count(r) AS count';

  return session
    .readTransaction(function (tx: any) {
      return tx.run(query);
    })
    .then(function (resNeo: any) {
      let numberOfRecipe: string = resNeo.records[0].get('count').low;
      debugneo4j('Func NumberOfPossiRP Return');
      return numberOfRecipe;
    })
    .catch(function (error: string) {
      errorneo4j('In NumberOfPOssiRP: ' + error);
    });
}

// element 재료 리스트로 만들 수 있는 레시피의 목록을 추천 알고리즘을 거쳐 반환
export async function ListOfPossiRP(ingreData: string[]) {
  let query: string =
    'MATCH (r:Recipe)<-[:USEDIN]-(i:Ingredient) WITH r, COLLECT(i.name) AS ingredient_col WHERE ALL(ing IN ingredient_col WHERE ing IN [' +
    CoverWithQuotation(ingreData) +
    ']) RETURN COLLECT(r.id) AS recipe';

  return session
    .readTransaction(function (tx: any) {
      return tx.run(query);
    })
    .then(async function (resNeo: any) {
      let listOfRecipeid: string[] = resNeo.records[0].get('recipe');
      debugneo4j('Func ListOfPossiRP Return');
      return listOfRecipeid;
    })
    .catch(function (error: string) {
      errorneo4j('In ListOfPossiRP: ' + error);
    });
}
