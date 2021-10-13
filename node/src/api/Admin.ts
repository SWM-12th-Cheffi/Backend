const debugAuthTest = require('debug')('cheffi:authtest');
const errorAuthTest = require('debug')('cheffi:authtest:error');

//mongoDB 설정
var Recipe = require('../model/RecipeModel');
import authz from '../function/Authorization';

//router 세팅
import * as express from 'express';
const adminRouter = express.Router();

/*
import recipeData from '../data/mangae_recipe';
adminRouter.post('/insert/Recipe', function (req, res) {
  console.time('insert_Recipe');
  console.log('Insert Recipe Recipe');
  let j = 0;
  for (var i in recipeData) {
    //if (j > 1) break;
    j += 1;
    let data = recipeData[i];
    console.log(i);
    let openedInfo = {
      recipeid: Number(i),
      title: String(data.name).replace(/'/gi, ''),
      time: String(data.within).split(' ')[0],
      size: Number(String(data.size).split('인분')[0]),
      difficulty: String(data.difficulty),
      ingredient: data.renew,
    };
    console.log(openedInfo);
    Recipe.create(openedInfo)
      .then((result: any) => {
        if (!result) return console.log('not found: ' + openedInfo.recipeid);
        console.log(`create successfully: ${openedInfo.recipeid}`);
      })
      .catch((err: any) => console.error('error: ' + openedInfo.recipeid));
  }
  res.send('insert command running');
  console.timeEnd('insert_Recipe');
});
*/

adminRouter.get('/auth/:level', async function (req, res) {
  let authorizationToken: string = String(req.headers['authorization']).split(' ')[1];
  let authorizationPlatform: string = String(req.headers['platform']);
  debugAuthTest('Authorization Test Request Id: ' + req.params.level);
  debugAuthTest('Token: ' + authorizationToken + '  & Platform: ' + authorizationPlatform);
  let returnStructure = await authz(authorizationToken, authorizationPlatform, Number(req.params.level));
  debugAuthTest(returnStructure.header.message);
  res.statusMessage = returnStructure.header.message;
  res.status(returnStructure.header.status).send(returnStructure.auth);
});

export default adminRouter;
