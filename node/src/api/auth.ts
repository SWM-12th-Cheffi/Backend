//mongoDB 설정
const User = require('../model/user');

var axios = require('axios');

//router 세팅
import * as express from 'express';
const authRouter = express.Router();

var { OAuth2Client } = require('google-auth-library');
const Client_ID = '79925141410-m12cesgdqn3sksv9a49sgk57ij0p3jmn.apps.googleusercontent.com';
authRouter.post('/google', function (req, res) {
  // Google oAuth Setting
  var client = new OAuth2Client(Client_ID);

  // 인증 함수
  async function verify() {
    var ticket = await client.verifyIdToken({
      idToken: req.body.it,
    });
    console.log(req.body.it);
    var payload = ticket.getPayload();
    var userid = payload['sub']; // userid: 21자리의 Google 회원 id 번호

    console.log(userid);
    res.send('Success Find User, ' + userid);

    /*connection.execute('SELECT `TOKEN` FROM `innoboost_user` WHERE `ID`= ?', [userid], (err, results) => {
      if (err) throw err;
      let token = '';
      if (results.length > 0) {
        console.log('DB에 있는 유저', results);
        token = updateToken(payload);
      } else {
        console.log('DB에 없는 유저');
        //새로 유저를 만들면 jwt 토큰값을 받아온다.
        token = insertUserIntoDB(payload);
      }
      res.send({
        token,
      });
      
    });
    */
  }
  verify()
    .then(() => {})
    .catch(console.error);
});

authRouter.post('/kakao', function (req, res) {
  var accessToken = req.body.at;
  let kakao_profile;

  async function verify() {
    kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    });
    console.log(req.body.accessToken);
    console.log(kakao_profile.data.id);
    console.log(kakao_profile.data.kakao_account.has_age_range);
    res.send('Success Find User, ' + kakao_profile.data.id);
    /*connection.execute('SELECT `TOKEN` FROM `innoboost_user` WHERE `ID`= ?', [userid], (err, results) => {
      if (err) throw err;
      let token = '';
      if (results.length > 0) {
        console.log('DB에 있는 유저', results);
        token = updateToken(payload);
      } else {
        console.log('DB에 없는 유저');
        //새로 유저를 만들면 jwt 토큰값을 받아온다.
        token = insertUserIntoDB(payload);
      }
      res.send({
        token,
      });
      
    });
    */
  }
  verify()
    .then(() => {})
    .catch((error) => kakaoErrorChecking(error));
});

function kakaoErrorChecking(err: any) {
  if (err.response.status == 401) {
    console.log('No Authentication');
  }
  console.log(err.response.status);
}

export default authRouter;
