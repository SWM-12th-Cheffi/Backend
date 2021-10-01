//router 세팅
import * as express from 'express';
const userRouter = express.Router();
var User = require('../model/UserModel');
import Authz from '../function/Authorization';

// 좋아하는 음식의 레시피 번호를 저장
userRouter.get('/like', function (req, res) {
  console.log('SaveLikeRecipes');
  let authorizationHeader: string = String(req.headers['Authorization']).split(' ')[1];
  let RecipeId = req.query.recipeid;
  User.addLikeRecipesByToken(authorizationHeader, RecipeId).then((result: any) => {
    // 정상적으로 작업을 마침
    if (result.matchedCount)
      res.send({
        status: 201,
        likeRecipesId: RecipeId,
      });
    // token으로 정보를 찾을 수 없음
    else
      res.send({
        status: 404,
        message: 'No Matched Information.',
      });
  });
});

// 사용자 정보 초기설정
userRouter.post('/info/init', function (req, res) {
  console.log('initInfo');
  User.initInfo(req.body).then((result: any) => {
    // 정상적으로 작업을 마침
    if (result.matchedCount)
      res.send({
        status: 201,
        result,
      });
    // token으로 정보를 찾을 수 없음
    else
      res.send({
        status: 404,
        message: 'No Matched Information.',
      });
  });
});

// 사용자 정보 불러오기
userRouter.post('/info', async function (req, res) {
  console.log('/user/info Api Called');
  let authorizationHeader: string = String(req.headers['Authorization']).split(' ')[1];
  const authzRes = await Authz(authorizationHeader, req.body.platform, 2);
  if (authzRes.status == 200)
    User.findOneByUserid(authzRes.securityId)
      .then((result: any) => {
        let openedInfo = {
          status: 200,
          message: 'Information Load Success',
          nickname: result.nickname,
          statusMessage: result.statusMessage,
          photo: result.photo,
          dislikeIngredient: result.dislikeIngredient,
          scrapRecipesId: result.scrapRecipesId,
          likeRecipesId: result.likeRecipesId,
          historyRecipesId: result.historyRecipesId,
          refriger: result.refriger,
        };
        res.send(openedInfo);
      })
      .catch(console.log);
  else res.send(authzRes);
});

// 냉장고 정보 저장
userRouter.post('/refriger', async function (req, res) {
  console.log('/user/refriger Api Called');
  let authorizationHeader: string = String(req.headers['Authorization']).split(' ')[1];
  const authzRes = await Authz(authorizationHeader, req.body.platform, 2);
  if (authzRes.status == 200)
    User.updateRefrigerByUserid(authzRes.securityId, req.body.refriger)
      .then(() => {
        res.send({ status: 200, message: 'refriger Save Success' });
      })
      .catch(console.log);
  else res.send(authzRes);
});

// 저장된 냉장고 데이터로 만들 수 있는 레시피 수 카운트
userRouter.post('/recipe-count', async function (req, res) {
  console.log('/user/recipeCount Api Called');
  let authorizationHeader: string = String(req.headers['Authorization']).split(' ')[1];
  const authzRes = await Authz(authorizationHeader, req.body.platform, 2);
  if (authzRes.status == 200)
    User.findOneByUserid(authzRes.securityId)
      .then((result: any) => {})
      .catch(console.log);
  else res.send(authzRes);
});

export default userRouter;
