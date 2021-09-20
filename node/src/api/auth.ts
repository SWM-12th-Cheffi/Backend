//mongoDB 설정
const User = require('../model/userModel');

var axios = require('axios');

//router 세팅
import * as express from 'express';
const authRouter = express.Router();

var { OAuth2Client } = require('google-auth-library');
authRouter.post('/google', function (req, res) {
  console.log('Authentication Google');
  console.time('google');
  // Google oAuth Setting
  var client = new OAuth2Client(String(process.env.GOOGLE_CLIENT_ID));

  // 인증 함수
  async function verify() {
    let token = req.body.it;
    let ticket = await client.verifyIdToken({
      idToken: token,
    });
    let payload = ticket.getPayload();
    var userid = payload['sub']; // userid: 21자리의 Google 회원 id 번호
    let newUser: boolean;
    let Userinfo = { email: payload['email'], userid: userid, platform: 'Google', token: token };
    User.findOneByUserid(userid)
      .then((result: any) => {
        if (!result) {
          newUser = true;
          return User.create(Userinfo);
        } else {
          newUser = false;
          return User.findOneByUserid(userid);
        }
      })
      .then((result: any) => {
        if (!result._id)
          res.send({
            auth: {
              newUser: newUser,
              token: result.token,
            },
          });
        else
          res.send({
            auth: {
              newUser: newUser,
              token: result.token,
            },
          });
      });
  }
  verify()
    .then(() => {
      console.timeEnd('google');
    })
    .catch((err) => {
      console.error(err);
      console.timeEnd('google');
    });
});

authRouter.post('/kakao', function (req, res) {
  console.log('Authentication Kakao');
  console.time('kakao');
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
    .then(() => {
      console.timeEnd('kakao');
    })
    .catch((error) => kakaoErrorChecking(error));
});

function kakaoErrorChecking(err: any) {
  if (err.response.status == 401) {
    console.log('No Authentication');
  }
  console.log(err.response.status);
  console.timeEnd('kakao');
}

export default authRouter;
