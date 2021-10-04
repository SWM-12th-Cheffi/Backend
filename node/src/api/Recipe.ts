import * as express from 'express';
import { SortByRecc } from '../function/Python';
import { IngredElementOfInput, ListOfPossiRP, NumberOfPossiRP } from '../function/Neo4j';
import Authz from '../function/Authorization';
import { RefrigerToIngredientList } from '../function/RecipeFunction';
const debug = require('debug')('Cheffi:Recipes');

const recipeRouter = express.Router();

//mongoDB setting
var Recipe = require('../model/RecipeModel');
var User = require('../model/UserModel');

//redis setting
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_ADDR);
debug('Redis: ' + client.reply);

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능 (tmp 저장방식)
recipeRouter.post('/number', async function (req, res) {
  debug('/number Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200) {
    await client.hset('refriger', authzRes.auth?.securityId, JSON.stringify(req.body.refriger));
    let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(req.body.refriger));
    let returnStructure: object = {
      num: String(await NumberOfPossiRP(ingreElement)),
    };
    res.statusMessage = 'Save Refriger Data In Redis';
    res.status(201).json(returnStructure);
  } else res.send(authzRes);
});

// 재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수 (tmp 데이터를 db에 넣고 출력)
recipeRouter.get('/list', async function (req, res) {
  console.log('/list Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  let reccReturnObject: any, reccRecipeList: number[];
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200) {
    client.hget('refriger', authzRes.auth?.securityId, async function (err: any, result: string) {
      result = JSON.parse(result);
      if (err) debug(err);
      let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(result));
      let listRecipeid: string[] = await ListOfPossiRP(ingreElement);
      console.log(listRecipeid);
      User.updateRefrigerByUserid(authzRes.auth?.securityId, result)
        .then(async function (userData: any) {
          reccReturnObject = await SortByRecc({
            id: listRecipeid,
            like: ['짜장면', '짬뽕'],
            likedb: {
              history: userData.historyRecipesId,
              like: userData.likeRecipesId,
              scrap: userData.scrapRecipesId,
            },
          });
          console.log(reccReturnObject);
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
            recipe: resMonListbyRecc,
          };
          res.statusMessage = 'Save Refriger Data In Mongo';
          res.status(201).json(returnStructure);
        })
        .catch((err: any) => res.status(500).send(err));
    });
  } else res.send(authzRes);
});

// 레시피의 정보를 mongo에서 반환하는 기능
recipeRouter.get('/info', async function (req, res) {
  console.log('/info Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 0);
  if (authzRes.header.status == 200)
    Recipe.findByRecipeid(Number(req.query.id))
      .then((recipeInfo: any) => {
        if (!recipeInfo) return res.status(404).send({ err: 'Recipe not found' });
        let returnStructure: object = { recipe: recipeInfo };
        res.statusMessage = 'Success To Return Recipe Info';
        res.status(201).json(returnStructure);
        res.send(returnStructure);
      })
      .catch((err: any) => res.status(500).send(err));
  else res.send(authzRes);
});

// 처음 사용자 데이터 받을 때 보여줄 랜덤 레시피
recipeRouter.get('/random-list', async function (req, res) {
  console.log('/random-list Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  let numberOfRecipeToSend = Number(req.query.num);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 0);
  if (authzRes.header.status == 200)
    Recipe.randomRecipe(numberOfRecipeToSend).then((recipeInfo: object[]) => {
      let returnStructure: object = {
        recipe: recipeInfo,
      };
      res.statusMessage = 'Success To Recuen Random-Recipe List';
      res.status(201).json(returnStructure);
    });
  else res.send(authzRes);
});

export default recipeRouter;
