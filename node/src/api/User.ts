//router 세팅
import * as express from 'express';
import { IngredElementOfInput, NumberOfPossiRP } from '../function/Neo4j';
import { RefrigerToIngredientList } from '../function/RecipeFunction';
const userRouter = express.Router();
var User = require('../model/UserModel');
import Authz from '../function/Authorization';

const debugRedis = require('debug')('cheffi:redis');
const debugscrap = require('debug')('cheffi:scrap');
const errorscrap = require('debug')('cheffi:scrap:error');
const debuginfo = require('debug')('cheffi:info');
const errorinfo = require('debug')('cheffi:info:error');
const debugrefriger = require('debug')('cheffi:refriger');
const errorrefriger = require('debug')('cheffi:refriger:error');

//redis setting
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_ADDR);
debugRedis('Redis: ' + client.reply);

// 좋아하는 음식의 레시피 번호 목록 불러오기
// Todo: Scrap 리스트를 불러와서 업데이트하도록 설정해야함.
userRouter.get('/scrap', async function (req, res) {
  debugscrap('/scrap get Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200)
    User.getLikeRecipeIdByUserid(authzRes.auth?.securityId)
      .then((result: any) => {
        // 정상적으로 작업을 마침 -> 미구현
        debugscrap('result: ' + result);
        res.status(200).json({ get: result });
      })
      .catch((err: any) => {
        errorscrap('Mongo Error: ' + err);
        res.status(500).send(err);
      });
  else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 좋아하는 음식의 레시피 번호를 저장
// Todo: Scrap 리스트를 불러와서 업데이트하도록 설정해야함.
userRouter.put('/scrap', async function (req, res) {
  debugscrap('/scrap put Api Called');
  debugscrap('RecipeId: ' + req.body.id);
  let RecipeId = req.body.id; // $push 사용해서 몽고에 저장
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200)
    User.addLikeRecipeIdByUserid(authzRes.auth?.securityId, Number(RecipeId)).then((result: any) => {
      // 정상적으로 작업을 마침 -> 미구현

      if (result.matchedCount) {
        debugscrap('result: ' + result);
        res.status(200).json({ add: { likeRecipesId: RecipeId } });
      }
      // token으로 정보를 찾을 수 없음
      else {
        errorscrap('Not Found In Mongo');
        res.status(404).send;
      }
    });
  else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 좋아하는 음식의 레시피 번호를 삭제
// Todo: like 리스트를 불러와서 업데이트하도록 설정해야함.
userRouter.delete('/scrap', async function (req, res) {
  debugscrap('/scrap delete Api Called');
  debugscrap('RecipeId: ' + req.body.id);
  let RecipeId = req.body.id; // $push 사용해서 몽고에 저장
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200)
    User.removeLikeRecipeIdByUserid(authzRes.auth?.securityId, Number(RecipeId)).then((result: any) => {
      // 정상적으로 작업을 마침 -> 미구현
      if (result.modifiedCount) {
        debugscrap('result: ' + RecipeId);
        res.status(200).json({ delete: { likeRecipesId: RecipeId } });
      } // token으로 정보를 찾을 수 없음
      else {
        errorscrap('Not Found In Mongo');
        res.status(404).send;
      }
    });
  else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 사용자 정보 불러오기
userRouter.get('/info', async function (req, res) {
  debuginfo('/info get Api Called');
  debuginfo('No Query Data');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200)
    User.getInfoByUserid(authzRes.auth?.securityId)
      .then((result: any) => {
        let openedInfo = {
          info: {
            recipeCount: result.recipeCount,
            nickname: result.nickname,
            photo: result.photo,
            dislikeIngredient: result.dislikeIngredient,
            scrapRecipesId: result.scrapRecipesId,
            likeRecipesId: result.likeRecipesId,
            historyRecipesId: result.historyRecipesId,
          },
          refriger: result.refriger,
        };
        debuginfo('Information Load Success');
        res.statusMessage = 'Information Load Success';
        res.status(201).json(openedInfo);
      })
      .catch((err: any) => {
        errorinfo('Mongo Error: ' + err);
        res.statusMessage = 'Mongo Error';
        res.status(500).send();
      });
  else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 사용자 정보 변경
userRouter.put('/info', async function (req, res) {
  debuginfo('/info put Api Called');
  debuginfo('data: ' + req.body.data);
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.initInfoByUserid(authzRes.auth?.securityId, req.body.data).then((result: any) => {
      // 정상적으로 작업을 마침
      if (result.matchedCount) {
        debuginfo('Save Successed');
        res.statusMessage = 'Save Successed';
        res.status(200).send();
      }
      // id로 정보를 찾을 수 없음
      else {
        errorinfo('Not found');
        res.statusMessage = 'Cannot Find User';
        res.status(404).send();
      }
    });
  else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 사용자 정보 변경
userRouter.delete('/info', async function (req, res) {
  debuginfo('/info delete Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.removeInfoByUserid(authzRes.auth?.securityId).then((result: any) => {
      // 정상적으로 작업을 마침 -> 미구현
      if (result.deletedCount) {
        debuginfo('Remove Data Success');
        res.statusMessage = 'Remove Data Success';
        res.status(200).send();
      }
      // token으로 정보를 찾을 수 없음
      else {
        errorinfo('Not Found');
        res.status(404).send();
      }
    });
  else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 냉장고 정보 저장
userRouter.put('/refriger', async function (req, res) {
  debugrefriger('/refriger Api Called');
  debugrefriger('refriger : ' + req.body.refriger);
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200) {
    let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(req.body.refriger));
    let num: number = await NumberOfPossiRP(ingreElement);
    User.updateRefrigerByUserid(authzRes.auth?.securityId, req.body.refriger, num)
      .then(() => {
        debugrefriger('num: ' + num + ' & Save Refriger Data in Mongo');
        res.statusMessage = 'Save Refriger Data In Mongo';
        res.status(200).send({
          num: num,
        });
      })
      .catch((err: any) => errorrefriger('Mongo Error: ' + err));
  } else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 저장된 냉장고 데이터로 만들 수 있는 레시피 수 카운트
userRouter.get('/recipe-count', async function (req, res) {
  debugrefriger('/recipeCount Api Called');
  debugrefriger('No Query Data');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 1);
  if (authzRes.header.status == 200)
    User.getInfoByUserid(authzRes.auth?.securityId)
      .then(async (result: any) => {
        debugrefriger('Result: ' + String(result.recipeCount));
        res.statusMessage = 'Get recipeCount Value';
        res.status(201).json({ num: result.recipeCount });
      })
      .catch((err: any) => errorrefriger('Mongo Error: ' + err));
  else {
    errorscrap(authzRes.header.message);
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

export default userRouter;
