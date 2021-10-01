//mongoDB 설정
var Recipe = require('../model/RecipeModel');

//router 세팅
import * as express from 'express';
const adminRouter = express.Router();

adminRouter.post('/insert/Recipe', function (req, res) {
  console.time('insert_Recipe');
  console.log('Insert Recipe Recipe');
  let recipeData = req.body.recipe;
  for (var i in recipeData) {
    Recipe.create(recipeData[i])
      .then((result: any) => {
        if (!result) return console.log('not found: ' + recipeData[i].recipeid);
        console.log(`create successfully: ${result.recipeid}`);
      })
      .catch((err: any) => console.log('error: ' + recipeData[i].recipeid));
  }
  res.send('insert command running');
  console.timeEnd('insert_Recipe');
});

export default adminRouter;
