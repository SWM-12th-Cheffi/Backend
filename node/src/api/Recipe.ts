const debugRedis = require('debug')('cheffi:redis');
const debugNumber = require('debug')('cheffi:number');
const errorNumber = require('debug')('cheffi:number:error');
const debugList = require('debug')('cheffi:list');
const errorList = require('debug')('cheffi:list:error');
const debuginfo = require('debug')('cheffi:info');
const errorinfo = require('debug')('cheffi:info:error');
const debugrandomlist = require('debug')('cheffi:randomlist');
const errorrandomlist = require('debug')('cheffi:randomlist:error');

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
debugRedis('Redis: ' + client.reply);

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능 (tmp 저장방식)
recipeRouter.post('/number', async function (req, res) {
  debugNumber('/number Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200) {
    debugNumber('refriger: ' + req.body.refriger);
    let resRedis = await client.hset('refriger', authzRes.auth?.securityId, JSON.stringify(req.body.refriger));
    debugNumber('Save Refriger Data in Redis: ' + resRedis);
    let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(req.body.refriger));
    let num = Number(await NumberOfPossiRP(ingreElement));
    debugNumber('Number of Recipes: ' + num);
    let returnStructure: object = {
      num: num,
    };
    res.statusMessage = 'Save Refriger Data In Redis';
    res.status(201).json(returnStructure);
  } else {
    errorNumber(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수 (tmp 데이터를 db에 넣고 출력)
recipeRouter.get('/list', async function (req, res) {
  debugList('/list Api Called & No Query Data');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  let reccReturnObject: any, reccRecipeList: number[];
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200) {
    client.hget('refriger', authzRes.auth?.securityId, async function (err: any, result: string) {
      if (err) {
        errorList('Redis Error: ' + err);
        res.statusMessage = 'Redis Error';
        res.status(500).send();
      } else {
        result = JSON.parse(result);
        debugList('Redis Data: ' + result);
        let ingredientList: string[] = RefrigerToIngredientList(result);
        if (ingredientList.length != 0) {
          let ingreElement: string[] = await IngredElementOfInput(ingredientList);
          let listRecipeid: string[] = await ListOfPossiRP(ingreElement);
          debugList('Array of Recipes: ' + listRecipeid);
          User.updateRefrigerByUserid(authzRes.auth?.securityId, result, listRecipeid.length)
            .then(async function (userData: any) {
              reccRecipeList = listRecipeid.map(Number);
              /*
            reccReturnObject = await SortByRecc({
              id: listRecipeid,
              like: ['짜장면', '짬뽕'],
              likedb: {
                history: userData.historyRecipesId,
                like: userData.likeRecipesId,
                scrap: userData.scrapRecipesId,
              },
            });
            reccRecipeList = reccReturnObject.data.id.map(Number);*/
              return Recipe.getListPossiRP(reccRecipeList);
            })
            .then((resMon: any) => {
              /*
            let resMonObjectbyRecc: any = {};
            for (let i in resMon) {
              resMonObjectbyRecc[resMon[i].recipeid] = resMon[i];
            }
            let resMonListbyRecc = [];
            for (let i in reccRecipeList) {
              resMonListbyRecc.push(resMonObjectbyRecc[reccRecipeList[i]]);
            }*/
              let nowPage: number = Number(req.query.page);
              let step: number = Number(req.query.step);
              let maxPage: number = parseInt(String(resMon.length / step)) + 1;
              if (nowPage > maxPage) {
                errorList('max Page: ' + maxPage + ', request Page: ' + nowPage);
                res.statusMessage = 'max Page: ' + maxPage;
                res.status(400).send();
              } else {
                // 에러 핸들링 필요
                let returnStructure: object = {
                  //recipe: resMonListbyRecc,
                  recipe: resMon.slice((nowPage - 1) * step, nowPage * step),
                  maxPage: maxPage,
                };
                debugList('Result: ' + returnStructure);
                res.statusMessage = 'Save Refriger Data In Mongo';
                res.status(201).json(returnStructure);
              }
            })
            .catch((err: any) => {
              errorList('Mongo Error: ' + err);
              res.status(500).send(err);
            });
        } else {
          User.updateRefrigerByUserid(authzRes.auth?.securityId, result, 0)
            .then((resMon: any) => {
              debugList('No Refriger Data, Set to Empty Refriger');
              res.statusMessage = 'No Refriger Data';
              res.status(201).json({ recipe: [] });
            })
            .catch((err: any) => {
              errorList('Mongo Error: ' + err);
              res.status(500).send(err);
            });
        }
      }
    });
  } else {
    errorList(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 레시피의 정보를 mongo에서 반환하는 기능
recipeRouter.get('/info', async function (req, res) {
  debuginfo('/info Api Called');
  debuginfo('RecipeId: ' + req.query.id);
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 0);
  if (authzRes.header.status == 200)
    Recipe.getRecipeInfoByRecipeId(Number(req.query.id))
      .then((recipeInfo: any) => {
        if (!recipeInfo) {
          errorinfo('Recipe not found');
          return res.status(404).send({ err: 'Recipe not found' });
        }
        let returnStructure: object = { recipe: recipeInfo };
        debuginfo('Success To Return Recipe Info');
        res.statusMessage = 'Success To Return Recipe Info';
        res.status(201).json(returnStructure);
      })
      .catch((err: any) => {
        errorinfo('Recipe not Found');
        res.statusMessage = 'Recipe not found';
        res.status(404).send(err);
      });
  else {
    errorinfo(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 처음 사용자 데이터 받을 때 보여줄 랜덤 레시피 + 일단 추천할 때 쓸 레시피
recipeRouter.get('/random-list', async function (req, res) {
  debugrandomlist('/random-list Api Called');
  debugrandomlist('number of Recipe: ' + req.query.num);
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 0);
  if (authzRes.header.status == 200) {
    let numberOfRecipeToSend = Number(req.query.num);
    Recipe.getRandomRecipe(numberOfRecipeToSend).then((recipeInfo: object[]) => {
      let returnStructure: object = {
        recipe: recipeInfo,
      };
      debugrandomlist('Success To Return Random-Recipe List');
      res.statusMessage = 'Success To Return Random-Recipe List';
      res.status(201).json(returnStructure);
    });
  } else {
    errorrandomlist(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

export default recipeRouter;
