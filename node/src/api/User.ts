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
// Todo: Scrap 리스트를 불러와서 업데이트하도록 설정해야함.
userRouter.get('/scrap', async function (req, res) {
  console.log('API:USER /like Api Called');
  console.log('API:USER RecipeId: ' + req.query.id);
  let RecipeId = req.query.id; // $push 사용해서 몽고에 저장
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.addLikeRecipeIdByUserid(authzRes.auth?.securityId, Number(RecipeId)).then((result: any) => {
      // 정상적으로 작업을 마침 -> 미구현
      if (result.matchedCount) res.status(200).json({ add: { likeRecipesId: RecipeId } });
      // token으로 정보를 찾을 수 없음
      else res.status(404).send;
    });
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status).send();
  }
});

// 좋아하는 음식의 레시피 번호를 삭제
// Todo: like 리스트를 불러와서 업데이트하도록 설정해야함.
userRouter.delete('/scrap', async function (req, res) {
  console.log('API:USER /like Api Called');
  console.log('API:USER RecipeId: ' + req.body.id);
  let RecipeId = req.body.id; // $push 사용해서 몽고에 저장
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.removeLikeRecipeIdByUserid(authzRes.auth?.securityId, Number(RecipeId)).then((result: any) => {
      // 정상적으로 작업을 마침 -> 미구현
      console.log(result);
      if (result.modifiedCount) res.status(200).json({ delete: { likeRecipesId: RecipeId } });
      // token으로 정보를 찾을 수 없음
      else res.status(404).send();
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
    User.initInfoByUserid(authzRes.auth?.securityId, req.body.data).then((result: any) => {
      // 정상적으로 작업을 마침
      if (result.matchedCount) {
        console.log('API:USER Result: ' + result);
        res.statusMessage = 'Save Successed';
        res.status(200).send();
      }
      // id로 정보를 찾을 수 없음
      else {
        res.statusMessage = 'Cannot Find User';
        res.status(404).send();
      }
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
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
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
        res.statusMessage = 'Save Refriger Data In Mongo';
        res.status(200).send({
          num: num,
        });
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
    User.getInfoByUserid(authzRes.auth?.securityId)
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
