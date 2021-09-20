//mongoDB 설정
const Haemuk = require('../model/haemukModel');

//router 세팅
import * as express from 'express';
const adminRouter = express.Router();

adminRouter.post('/insert/haemuk', function (req, res) {
  console.time('insert_haemuk');
  console.log('Insert Haemuk Recipe');
  let recipeData = req.body.recipe;
  for (var i in recipeData) {
    Haemuk.create(recipeData[i])
      .then((result: any) => {
        if (!result) return console.log('not found: ' + recipeData[i].recipeid);
        console.log(`create successfully: ${result.recipeid}`);
      })
      .catch((err: any) => console.log('error: ' + recipeData[i].recipeid));
  }
  res.send('insert command running');
  console.timeEnd('insert_haemuk');
});

export default adminRouter;
