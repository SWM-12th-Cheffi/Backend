//router 세팅
import * as express from 'express';
const authRouter = express.Router();

var { OAuth2Client } = require('google-auth-library');
const Client_ID = '79925141410-m12cesgdqn3sksv9a49sgk57ij0p3jmn.apps.googleusercontent.com';
const jwt = require('jsonwebtoken');

authRouter.post('/google', function (req, res) {
  // Google oAuth Setting
  var client = new OAuth2Client(Client_ID);

  // 인증 함수
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.it,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub']; // userid: 21자리의 Google 회원 id 번호

    console.log(userid);

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

export default authRouter;
