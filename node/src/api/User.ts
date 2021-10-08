//router 세팅
import * as express from 'express';
import { IngredElementOfInput, NumberOfPossiRP } from '../function/Neo4j';
import { RefrigerToIngredientList } from '../function/RecipeFunction';
const userRouter = express.Router();
var User = require('../model/UserModel');
import Authz from '../function/Authorization';

const debug = require('debug')('Cheffi:User');

//redis setting
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_ADDR);
debug('Redis: ' + client.reply);

// 좋아하는 음식의 레시피 번호를 저장
userRouter.get('/like', async function (req, res) {
  console.log('API:USER /like Api Called');
  console.log('API:USER RecipeId: ' + req.query.RecipeId);
  let RecipeId = req.query.id; // $push 사용해서 몽고에 저장
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.addLikeRecipesByToken(authzRes.auth?.securityId, RecipeId).then((result: any) => {
      // 정상적으로 작업을 마침 -> 미구현
      if (result.matchedCount) res.status(200).json({ likeRecipesId: RecipeId });
      // token으로 정보를 찾을 수 없음
      else res.status(404);
    });
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 사용자 정보 초기설정
userRouter.post('/info/init', async function (req, res) {
  console.log('API:USER /info/init Api Called');
  console.log('API:USER data: ' + req.body.data);
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.initInfo(req.body.data).then((result: any) => {
      // 정상적으로 작업을 마침
      if (result.matchedCount) {
        console.log('API:USER Result: ' + result);
        res.status(200).json(result);
      }
      // token으로 정보를 찾을 수 없음
      else res.status(404);
    });
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 사용자 정보 불러오기
userRouter.get('/info', async function (req, res) {
  console.log('API:USER /user/info Api Called');
  console.log('API:USER No Query Data');
  let authorizationToken: string = String(req.headers['Authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.findOneByUserid(authzRes.auth?.securityId)
      .then((result: any) => {
        let openedInfo = {
          nickname: result.nickname,
          statusMessage: result.statusMessage,
          photo: result.photo,
          dislikeIngredient: result.dislikeIngredient,
          scrapRecipesId: result.scrapRecipesId,
          likeRecipesId: result.likeRecipesId,
          historyRecipesId: result.historyRecipesId,
          refriger: result.refriger,
        };
        console.log('API:USER Result: ' + openedInfo);
        res.statusMessage = 'Information Load Success';
        res.status(201).json(openedInfo);
      })
      .catch(debug);
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 냉장고 정보 저장
userRouter.put('/refriger', async function (req, res) {
  console.log('API:USER /user/refriger Api Called');
  console.log('API:USER refriger : ' + req.body.refriger);
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200) {
    let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(req.body.refriger));
    let num: number = await NumberOfPossiRP(ingreElement);
    User.updateRefrigerByUserid(authzRes.auth?.securityId, req.body.refriger, num)
      .then(() => {
        console.log('API:USER Result: No Return Data');
        res.send({ status: 200, message: 'Save Refriger Data In Mongo' });
      })
      .catch(debug);
  } else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 저장된 냉장고 데이터로 만들 수 있는 레시피 수 카운트
userRouter.get('/recipe-count', async function (req, res) {
  console.log('API:USER /user/recipeCount Api Called');
  console.log('API:USER No Query Data');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.findOneByUserid(authzRes.auth?.securityId)
      .then(async (result: any) => {
        console.log('API:USER Result: ' + { num: result.recipeCount });
        res.statusMessage = 'Get recipeCount Value';
        res.status(201).json({ num: result.recipeCount });
      })
      .catch(debug);
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

export default userRouter;
