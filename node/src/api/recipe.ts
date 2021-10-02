import * as express from 'express';
import { SortByRecc } from '../function/Python';
import { IngredElementOfInput, ListOfPossiRP, NumberOfPossiRP } from '../function/Neo4j';
import Authz from '../function/Authorization';

const recipeRouter = express.Router();

//mongoDB setting
var Recipe = require('../model/RecipeModel');
var User = require('../model/UserModel');

// 전역 데이터 저장 변수
type ingredientType = { title: string; data: string[] };
type tmpUserIngredientType = { userid: string; ingredient: ingredientType[] };
var tmpUserIngredient: tmpUserIngredientType[];

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능 (tmp 저장방식)
recipeRouter.post('/number', async function (req, res) {
  console.log('NumPossiRP');
  let authorizationHeader: string = String(req.headers['Authorization']).split(' ')[1];
  const authzRes = await Authz(authorizationHeader, req.body.platform, 2);
  if (authzRes.status == 200) {
    let ingreElement: string[] = await IngredElementOfInput(req.body.ingre);
    let returnStructure: object = { num: String(await NumberOfPossiRP(ingreElement)) };
    res.send(returnStructure);
  } else res.send(authzRes);
});

/*
// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능
recipeRouter.post('/number', async function (req, res) {
  console.log('NumPossiRP');
  let ingreElement: string[] = await IngredElementOfInput(req.body.ingre);
  let returnStructure: object = { num: String(await NumberOfPossiRP(ingreElement)) };
  res.send(returnStructure);
});
*/

// 재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수
recipeRouter.post('/list', async function (req, res) {
  console.log('ListPossiRP');
  let authorizationHeader: string = String(req.headers['Authorization']).split(' ')[1];
  let ingreElement: string[] = await IngredElementOfInput(req.body.ingre);
  let listRecipeid: any = await ListOfPossiRP(ingreElement);
  let reccReturnObject: any, reccRecipeList: number[];
  const authzRes = await Authz(authorizationHeader, req.body.platform, 1);
  User.findOneByUserid(authzRes.securityId)
    .then(async function (userData: any) {
      reccReturnObject = await SortByRecc({
        id: listRecipeid,
        like: { history: userData.historyRecipesId, like: userData.likeRecipesId, scrap: userData.scrapRecipesId },
      });
      reccRecipeList = reccReturnObject.data.id.map(Number);

      return Recipe.ListPossiRP(reccRecipeList);
    })
    .then((resMon: any) => {
      let resMonObjectbyRecc: any = {};
      for (let i in resMon) {
        resMonObjectbyRecc[resMon[i].recipeid] = resMon[i];
      }
      let resMonListbyRecc = [];
      for (let i in reccRecipeList) {
        resMonListbyRecc.push(resMonObjectbyRecc[reccRecipeList[i]]);
      }

      let returnStructure: object = { recipe: resMonListbyRecc };
      res.send(returnStructure);
    })
    .catch((err: any) => res.status(500).send(err));
});

// 레시피의 정보를 해먹에서 반환하는 기능
recipeRouter.post('/info', function (req, res) {
  console.log('findRecipe');

  Recipe.findByRecipeid(req.body.id)
    .then((recipeInfo: any) => {
      if (!recipeInfo) return res.status(404).send({ err: 'Recipe not found' });
      let returnStructure: object = { recipe: recipeInfo };
      res.send(returnStructure);
    })
    .catch((err: any) => res.status(500).send(err));
});

// 처음 사용자 데이터 받을 때 보여줄 랜덤 레시피
recipeRouter.post('/random-list', function (req, res) {
  console.log('randomRecipeList');
  Recipe.randomRecipe(req.body.num).then((recipeInfo: object[]) => {
    let returnStructure: object = { recipe: recipeInfo };
    res.send(returnStructure);
  });
});

export default recipeRouter;
