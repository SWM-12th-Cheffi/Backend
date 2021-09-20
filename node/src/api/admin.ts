//mongoDB 설정
const Haemuk = require('../model/haemukModel');

//router 세팅
import * as express from 'express';
const manageRouter = express.Router();

// haemuk에 레시피 입력
manageRouter.post('/findAll/haemuk', function (req, res) {
  //console.log(req.body.title);
  Haemuk.findAll().then((result: any) => {
    console.log(result);
  });
  //res.send('Connecting POST Test Is OK, Title Value is ' + req.body.title);
});

manageRouter.post('/find/haemuk', function (req, res) {
  Haemuk.findOneByRecipeid(req.body.id)
    .then((result: any) => {
      if (!result) return res.status(404).send({ err: 'Todo not found' });
      res.send(`findOne successfully: ${result}`);
    })
    .catch((err: any) => res.status(500).send(err));
});

manageRouter.post('/insert/haemuk', function (req, res) {
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

export default manageRouter;
