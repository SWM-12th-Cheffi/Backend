//mongoDB 설정
const User = require('../model/userModel');
const crypto = require('crypto');
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
    let userid = payload['sub']; // userid: 21자리의 Google 회원 id 번호
    userid = crypto.createHash('sha512').update(userid).digest('base64');
    token = crypto.createHash('sha512').update(token).digest('base64');
    let newUser: boolean;
    let Userinfo = { userid: userid, platform: 'Google', token: token };
    User.findOneByUserid(userid)
      .then((result: any) => {
        if (!result) {
          newUser = true;
          return User.create(Userinfo);
        } else {
          newUser = false;
          return User.updateByUserid(userid, token);
        }
      })
      .then(() => {
        res.send({
          auth: {
            newUser: newUser,
            token: token,
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
  let token = req.body.at;
  let kakao_profile;

  async function verify() {
    kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });
    let userid = kakao_profile.data.id;
    userid = crypto.createHash('sha512').update(String(userid)).digest('base64');
    token = crypto.createHash('sha512').update(String(token)).digest('base64');
    let newUser: boolean;
    let Userinfo = { userid: userid, platform: 'Kakao', token: token };
    User.findOneByUserid(userid)
      .then((result: any) => {
        if (!result) {
          newUser = true;
          return User.create(Userinfo);
        } else {
          newUser = false;
          return User.updateByUserid(userid, token);
        }
      })
      .then(() => {
        res.send({
          auth: {
            newUser: newUser,
            token: token,
          },
        });
      });
  }
  verify()
    .then(() => {
      console.timeEnd('kakao');
    })
    .catch((error) => kakaoErrorChecking(error));
});

function kakaoErrorChecking(err: any) {
  console.log(err);
  if (err.response.status == 401) {
    console.log('No Authentication');
  }
  console.log(err.response.status);
  console.timeEnd('kakao');
}

export default authRouter;
