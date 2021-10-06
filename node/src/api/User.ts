//router 세팅
import * as express from 'express';
import { IngredElementOfInput, NumberOfPossiRP } from '../function/Neo4j';
import { RefrigerToIngredientList } from '../function/RecipeFunction';
const userRouter = express.Router();
var User = require('../model/UserModel');
import Authz from '../function/Authorization';

const debug = require('debug')('Cheffi:User');

// 좋아하는 음식의 레시피 번호를 저장
userRouter.get('/like', async function (req, res) {
  console.log('/like Api Called');
  let RecipeId = req.query.id; // $push 사용해서 몽고에 저장
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.addLikeRecipesByToken(authzRes.auth?.securityId, RecipeId).then((result: any) => {
      // 정상적으로 작업을 마침
      if (result.matchedCount) res.status(200).json({ likeRecipesId: RecipeId });
      // token으로 정보를 찾을 수 없음
      else res.status(404);
    });
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status);
  }
});

// 사용자 정보 초기설정
userRouter.post('/info/init', async function (req, res) {
  console.log('/info/init Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.initInfo(req.body.data).then((result: any) => {
      // 정상적으로 작업을 마침
      if (result.matchedCount) res.status(200).json(result);
      // token으로 정보를 찾을 수 없음
      else res.status(404);
    });
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status);
  }
});

// 사용자 정보 불러오기
userRouter.get('/info', async function (req, res) {
  console.log('/user/info Api Called');
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
        res.statusMessage = 'Information Load Success';
        res.status(201).json(openedInfo);
      })
      .catch(debug);
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status);
  }
});

// 냉장고 정보 저장
userRouter.put('/refriger', async function (req, res) {
  console.log('/user/refriger Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.updateRefrigerByUserid(authzRes.auth?.securityId, req.body.refriger)
      .then(() => {
        res.send({ status: 200, message: 'Save Refriger Data In Mongo' });
      })
      .catch(debug);
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status);
  }
});

// 저장된 냉장고 데이터로 만들 수 있는 레시피 수 카운트
userRouter.get('/recipe-count', async function (req, res) {
  console.log('/user/recipeCount Api Called');
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  const authzRes = await Authz(authorizationToken, authorizationPlatform, 2);
  if (authzRes.header.status == 200)
    User.findOneByUserid(authzRes.auth?.securityId)
      .then(async (result: any) => {
        let ingreElement: string[] = await IngredElementOfInput(RefrigerToIngredientList(result.refriger));
        let returnStructure: object = {
          status: 201,
          num: String(await NumberOfPossiRP(ingreElement)),
          message: 'Save Refriger Data In Redis',
        };
        res.send(returnStructure);
      })
      .catch(debug);
  else {
    res.statusMessage = authzRes.header.message;
    res.status(authzRes.header.status);
  }
});

export default userRouter;
