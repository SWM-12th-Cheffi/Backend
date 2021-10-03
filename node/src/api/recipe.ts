import * as express from 'express';
import { SortByRecc } from '../function/Python';
import { IngredElementOfInput, ListOfPossiRP, NumberOfPossiRP } from '../function/Neo4j';
import Authz from '../function/Authorization';
import { RefrigerToIngredientList } from '../function/RecipeFunction';

const recipeRouter = express.Router();

//mongoDB setting
var Recipe = require('../model/RecipeModel');
var User = require('../model/UserModel');

//redis setting
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_ADDR);
console.log('Redis: ' + client.reply);

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능 (tmp 저장방식)
recipeRouter.post('/number', async function (req, res) {
  console.log('NumPossiRP');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.status == 200) {
    await client.hset('refriger', authzRes.securityId, JSON.stringify(req.body.refriger));
    let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(req.body.refriger));
    let returnStructure: object = {
      status: 201,
      num: String(await NumberOfPossiRP(ingreElement)),
      message: 'Save Refriger Data In Redis',
    };
    res.send(returnStructure);
  } else res.send(authzRes);
});

// 재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수 (tmp 데이터를 db에 넣고 출력)
recipeRouter.get('/list', async function (req, res) {
  console.log('ListPossiRP');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  let reccReturnObject: any, reccRecipeList: number[];
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.status == 200) {
    client.hget('refriger', authzRes.securityId, async function (err: any, result: any) {
      if (err) console.log(err);
      let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(result));
      let listRecipeid: any = await ListOfPossiRP(ingreElement);
      User.updateRefrigerByUserid(authzRes.securityId, result)
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
          let returnStructure: object = {
            status: 201,
            recipe: resMonListbyRecc,
            message: 'Save Refriger Data In Mongo ',
          };
          res.send(returnStructure);
        })
        .catch((err: any) => res.status(500).send(err));
    });
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
*/

// 레시피의 정보를 mongo에서 반환하는 기능
recipeRouter.get('/info', async function (req, res) {
  console.log('findRecipe');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 0);
  if (authzRes.status == 200)
    Recipe.findByRecipeid(Number(req.query.id))
      .then((recipeInfo: any) => {
        if (!recipeInfo) return res.status(404).send({ err: 'Recipe not found' });
        let returnStructure: object = { status: 201, recipe: recipeInfo, message: 'Success To Return Recipe Info' };
        res.send(returnStructure);
      })
      .catch((err: any) => res.status(500).send(err));
  else res.send(authzRes);
});

// 처음 사용자 데이터 받을 때 보여줄 랜덤 레시피
recipeRouter.get('/random-list', async function (req, res) {
  console.log('randomRecipeList');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  let numberOfRecipeToSend = Number(req.query.num);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 0);
  if (authzRes.status == 200)
    Recipe.randomRecipe(numberOfRecipeToSend).then((recipeInfo: object[]) => {
      let returnStructure: object = {
        status: 201,
        recipe: recipeInfo,
        message: 'Success To Recuen Random-Recipe List',
      };
      res.send(returnStructure);
    });
  else res.send(authzRes);
});

export default recipeRouter;
