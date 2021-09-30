//router 세팅
import * as express from 'express';
const userRouter = express.Router();
var User = require('../model/userModel');
import authz from '../function/Authorization';

// 좋아하는 음식의 레시피 번호를 저장
userRouter.post('/addLikeRecipe', function (req, res) {
  console.log('SaveLikeRecipes');
  console.time('SaveLikeRecipes');
  let token = req.body.token;
  let RecipeId: string = req.body.likeRecipeId;
  User.addLikeRecipesByToken(token, RecipeId).then((result: any) => {
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
    console.timeEnd('SaveLikeRecipes');
  });
});

// 사용자 정보 초기설정
userRouter.post('/initInfo', function (req, res) {
  console.time('initInfo');
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
    console.timeEnd('initInfo');
  });
});

// 사용자 정보 불러오기
userRouter.post('/info', async function (req, res) {
  console.log('Post User Info to Front');
  const authzRes = await authz(req.body.token, req.body.platform, 2);
  if (authzRes.status == 200)
    User.findOneByUserToken(authzRes.securityTk)
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

// 해당 요리를 끝마쳤다는 정보를 받은 뒤 추천 반영
userRouter.post('/FineCook', function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
});

// 재료를 검색할 때 동적으로 반응하여 보여주는 기능
userRouter.post('/ShowIGDynamic', function (req, res) {
  console.log(req.body.title);
  res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
});

export default userRouter;
