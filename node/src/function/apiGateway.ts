var { OAuth2Client } = require('google-auth-library');
var crypto = require('crypto');
var axios = require('axios');
var User = require('../model/userModel');

//0: all access, 1: access when input token, 2: access when verify success
export default function authorization(token: string, platform: string, security: number = 0, init: boolean = false) {
  switch (security) {
    case 0: // All Access
      return { status: 200, message: 'Access Success' };
    case 1: // Can Access When Input Token
      if (platform == 'google' || platform == 'kakao') {
        if (token != undefined) return { status: 200, message: 'Access Success' };
        else return { status: 403, message: "Can't Find token Property" };
      } else return { status: 403, message: 'Incorrect platform Property' };
    case 2: // Can Access When Verify Success
      if (platform == 'google') verify_google(token, init).then((res) => res);
      else if (platform == 'kakao') verify_kakao(token, init).then((res) => res);
      else return { status: 400, message: 'Incorrect platform Property' };
    default:
      return { status: 400, message: 'Api Authorization Error (Security Number Error)' };
  }
}

async function verify_google(token: string, init: boolean) {
  let client = new OAuth2Client(String(process.env.GOOGLE_CLIENT_ID));
  let ticket = await client.verifyIdToken({
    idToken: token,
  });
  let userid = ticket.getPayload()['sub']; // userid: 21자리의 Google 회원 id 번호
  userid = crypto.createHash('sha512').update(userid).digest('base64');
  //token = crypto.createHash('sha512').update(token).digest('base64');
  if (init) {
    // 처음 가입할 때
    let newUser: boolean;
    let Userinfo = { userid: userid, platform: 'Google', token: token };
    User.findOneByUserid(userid).then((result: any) => {
      if (!result) {
        newUser = true;
        return User.create(Userinfo);
      } else {
        newUser = false;
        return User.updateTokenByUserid(userid, token);
      }
    });
  } else {
  }
}

async function verify_kakao(token: string, init: boolean) {
  let kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
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
        return User.updateTokenByUserid(userid, token);
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
