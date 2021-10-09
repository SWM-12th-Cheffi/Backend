var { OAuth2Client } = require('google-auth-library');
var crypto = require('crypto');
var axios = require('axios');
var User = require('../model/userModel');

//-1: Login,  0: all access, 1: access when input token, 2: access when verify success
export default async function Authorization(token: string, platform: string, security: number = 0) {
  console.log('FUNC:AUTHZ Authorization ' + platform + ' level: ' + security + ' token: ' + token);
  switch (security) {
    case -1: // For Login
      let newUser: boolean = false;
      if (platform && platform == 'google') {
        try {
          const authRes = await verify_google(token, true);
          console.log(authRes);
          if (Object.entries(authRes).length == 6) newUser = true;
          else if (Object.entries(authRes).length == 7) newUser = false;
          else return { header: { status: 500, message: 'Mongo Error-1' }, auth: {} };
          return {
            header: { status: 200, message: 'Login Success' },
            auth: { newUser: newUser, token: token, platform: platform },
            info: {
              recipeCount: authRes.recipeCount,
              nickname: authRes.nickname,
              photo: authRes.photo,
              dislikeIngredient: authRes.dislikeIngredient,
              scrapRecipesId: authRes.scrapRecipesId,
              likeRecipesId: authRes.likeRecipesId,
              historyRecipesId: authRes.historyRecipesId,
            },
            refriger: authRes.refriger,
          };
        } catch (err) {
          return { header: { status: 401, message: err }, auth: {} };
        }
      } else if (platform && platform == 'kakao') {
        try {
          const authRes = await verify_kakao(token, true);
          console.log(authRes);
          if (Object.entries(authRes).length == 6) newUser = true;
          else if (Object.entries(authRes).length == 7) newUser = false;
          else return { header: { status: 500, message: 'Mongo Error-2' }, auth: {} };
          return {
            header: { status: 200, message: 'Login Success' },
            auth: { newUser: newUser, token: token, platform: platform },
            info: {
              recipeCount: authRes.recipeCount,
              nickname: authRes.nickname,
              photo: authRes.photo,
              dislikeIngredient: authRes.dislikeIngredient,
              scrapRecipesId: authRes.scrapRecipesId,
              likeRecipesId: authRes.likeRecipesId,
              historyRecipesId: authRes.historyRecipesId,
            },
            refriger: authRes.refriger,
          };
        } catch (err) {
          return { header: { status: 401, message: err }, auth: {} };
        }
      } else return { header: { status: 401, message: 'Incorrect platform Property' }, auth: {} };
    case 0: // All Access
      return { header: { status: 200, message: 'Access Success' } };
    case 1: // Can Access When Input Token
      if (platform && (platform == 'google' || platform == 'kakao')) {
        if (token) return { header: { status: 200, message: 'Access Success' } };
        else return { header: { status: 401, message: "Can't Find token Property" } };
      } else return { header: { status: 401, message: 'Incorrect platform Property' } };
    case 2: // Can Access When Verify Success
      if (platform && platform == 'google') {
        try {
          const authRes = await verify_google(token, false);
          if (!authRes) throw { response: { status: 404, statusText: "Cant' find Data" } }; // mongo에 데이터가 없을 때
          return { header: { status: 200, message: 'Access Success' }, auth: { securityId: String(authRes.userid) } };
        } catch (err: any) {
          if (err.hasOwnProperty('response'))
            return { header: { status: err.response.status, message: err.response.statusText } };
          else return { header: { status: 401, message: String(err).split(':')[1] } };
        }
      } else if (platform && platform == 'kakao') {
        try {
          const authRes = await verify_kakao(token, false);
          if (!authRes) throw { response: { status: 404, statusText: "Cant' find Data" } }; // mongo에 데이터가 없을 때
          return { header: { status: 200, message: 'Access Success' }, auth: { securityId: String(authRes.userid) } };
        } catch (err: any) {
          return { header: { status: err.response.status, message: err.response.statusText } };
        }
      } else {
        return { header: { status: 401, message: 'Incorrect platform Property' } };
      }
    default:
      return { header: { status: 401, message: 'Api Authorization Error (Security Number Error)' } };
  }
}

async function verify_google(token: string, init: boolean) {
  let client = new OAuth2Client(String(process.env.GOOGLE_CLIENT_ID));
  let ticket = await client.verifyIdToken({
    idToken: token,
  });
  let userid = ticket.getPayload()['sub']; // userid: 21자리의 Google 회원 id 번호
  userid = crypto.createHash('sha512').update(userid).digest('base64');
  let securityTk = crypto.createHash('sha512').update(token).digest('base64');
  if (init) {
    // 처음 로그인할 때
    let Userinfo = { userid: userid, platform: 'Google', token: securityTk };
    return User.getInfoByUserid(userid).then((result: object) => {
      if (!result) return User.createInfo(Userinfo);
      else return User.updateTokenByUserid(userid, securityTk);
    });
  } else {
    // 이후 권한 확인할 때
    return User.getInfoByUserid(userid);
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
  let securityTk = crypto.createHash('sha512').update(String(token)).digest('base64');
  if (init) {
    // 처음 로그인할 때
    let Userinfo = { userid: userid, platform: 'Kakao', token: securityTk };
    return User.getInfoByUserid(userid).then((result: object) => {
      if (!result) return User.createInfo(Userinfo);
      else return User.updateTokenByUserid(userid, securityTk);
    });
  } else {
    // 이후 권한 확인할 때
    return User.getInfoByUserid(userid);
  }
}
