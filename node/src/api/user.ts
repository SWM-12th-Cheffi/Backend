//router 세팅
import * as express from 'express';
const userRouter = express.Router();
var User = require('../model/userModel');

// 좋아하는 음식의 레시피 번호를 저장
userRouter.post('/SaveLikeRecipes', function (req, res) {
  console.log('SaveLikeRecipes');
  console.time('SaveLikeRecipes');
  let token = req.body.token;
  let RecipeId: string[] = req.body.likeRecipesId;
  User.findOneByUserToken(token)
    .then((result: any) => {
      console.log(result);
      console.log(RecipeId);
      let today = new Date();
      console.log(today);
      return User.updateLikeRecipesByToken(token, RecipeId);
    })
    .then((result: any) => {
      console.log(result);
      res.send({
        status: 201,
        likeRecipesId: RecipeId,
      });
    });
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
