const debugAuth = require('debug')('cheffi:auth');
const errorAuth = require('debug')('cheffi:auth:error');

var { OAuth2Client } = require('google-auth-library');
var crypto = require('crypto');
var axios = require('axios');
var User = require('../model/UserModel');
import { UpdateUserPreference } from './Python';

//redis setting
const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient(process.env.REDIS_ADDR);
const redisSet = promisify(client.set).bind(client);
const redisHset = promisify(client.hset).bind(client);
const redisGet = promisify(client.get).bind(client);

const expirationTime: number = 3600;

//-1: Login,  0: all access, 1: Have Already Authorized token 2: Have good states when Authorizing token
export default async function Authorization(token: string, platform: string, security: number = 0) {
  debugAuth('Authorization ' + platform + ' level: ' + security + ' token: ' + token);
  switch (security) {
    case -1: // For Login
      let newUser: boolean = false;
      let isAuthz: boolean = false;
      let returnStructure: any = {};
      if (platform && platform == 'google') {
        try {
          const authRes = await verify_google(token, true);
          if (Object.entries(authRes).length == 6) newUser = true;
          else if (Object.entries(authRes).length == 7) newUser = false;
          else {
            errorAuth('Mongo Error-2');
            return { header: { status: 500, message: 'Mongo Error-1' }, auth: {} };
          }
          let resSet = await redisSet(token, authRes.userid, 'EX', expirationTime);
          let resScrap = await redisHset(
            'scrap',
            authRes.userid,
            JSON.stringify(authRes.scrapRecipesId),
            'EX',
            expirationTime,
          );
          let resHistory = await redisHset(
            'history',
            authRes.userid,
            JSON.stringify(authRes.historyRecipesId),
            'EX',
            expirationTime,
          );
          if (resSet == 'OK') isAuthz = true;
          debugAuth(token + ' redis 저장완료 EX: ' + String(expirationTime) + '(s) ' + resSet + resScrap + resHistory);
          returnStructure = {
            header: { status: 201, message: 'Login Success' },
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
          let inputPy = {
            id: [],
            like: {
              history: authRes.historyRecipesIdInfo,
              like: authRes.likeRecipesIdInfo,
              scrap: authRes.scrapRecipesIdInfo,
            },
          };
          let resPython = await UpdateUserPreference(inputPy);
          debugAuth(resPython.data);
          User.userPreference(authRes.userid, resPython.data.scrap, resPython.data.like, resPython.data.history);
          return returnStructure;
          // 데이터 오면 업데이트.
        } catch (err) {
          if (isAuthz) {
            // python error
            errorAuth('Python Error in Google Authorization');
            errorAuth(err);
            returnStructure.header.status = 206;
            returnStructure.header.message = '로그인은 되었지만 파이썬 에러, 서버문제';
            return returnStructure;
          } else {
            errorAuth('Error in Google Authorization');
            errorAuth(err);
            returnStructure = { header: { status: 401, message: 'Token Error' }, auth: {} };
            return returnStructure;
          }
        }
      } else if (platform && platform == 'kakao') {
        try {
          const authRes = await verify_kakao(token, true);
          if (Object.entries(authRes).length == 6) newUser = true;
          else if (Object.entries(authRes).length == 7) newUser = false;
          else {
            errorAuth('Mongo Error-2');
            return { header: { status: 500, message: 'Mongo Error-2' }, auth: {} };
          }
          let resSet = await redisSet(token, authRes.userid, 'EX', expirationTime);
          let resScrap = await redisHset(
            'scrap',
            authRes.userid,
            JSON.stringify(authRes.scrapRecipesId),
            'EX',
            expirationTime,
          );
          let resHistory = await redisHset(
            'history',
            authRes.userid,
            JSON.stringify(authRes.historyRecipesId),
            'EX',
            expirationTime,
          );
          if (resSet == 'OK') isAuthz = true;
          debugAuth(token + ' redis 저장완료 EX: ' + String(expirationTime) + '(s) ' + resSet + resScrap + resHistory);
          returnStructure = {
            header: { status: 201, message: 'Login Success' },
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
          let inputPy = {
            id: [],
            like: {
              history: authRes.historyRecipesIdInfo,
              like: authRes.likeRecipesIdInfo,
              scrap: authRes.scrapRecipesIdInfo,
            },
          };
          let resPython = await UpdateUserPreference(inputPy);
          debugAuth(resPython.data);
          User.userPreference(authRes.userid, resPython.data.scrap, resPython.data.like, resPython.data.history);
          return returnStructure;
        } catch (err) {
          if (isAuthz) {
            // python error
            errorAuth('Python Error in Kakao Authorization');
            errorAuth(err);
            returnStructure.header.status = 206;
            returnStructure.header.message = 'Login Success, But Python Error';
            return returnStructure;
          } else {
            errorAuth('Error in Kakao Authorization');
            errorAuth(err);
            returnStructure = { header: { status: 401, message: 'Token Error' }, auth: {} };
            return returnStructure;
          }
        }
      } else if (platform && platform == 'apple') {
        try {
          const authRes = await verify_apple(token, true);
          if (Object.entries(authRes).length == 6) newUser = true;
          else if (Object.entries(authRes).length == 7) newUser = false;
          else {
            errorAuth('Mongo Error-2');
            return { header: { status: 500, message: 'Mongo Error-2' }, auth: {} };
          }
          let resSet = await redisSet(token, authRes.userid, 'EX', expirationTime);
          let resScrap = await redisHset(
            'scrap',
            authRes.userid,
            JSON.stringify(authRes.scrapRecipesId),
            'EX',
            expirationTime,
          );
          let resHistory = await redisHset(
            'history',
            authRes.userid,
            JSON.stringify(authRes.historyRecipesId),
            'EX',
            expirationTime,
          );
          if (resSet == 'OK') isAuthz = true;
          debugAuth(token + ' redis 저장완료 EX: ' + String(expirationTime) + '(s) ' + resSet + resScrap + resHistory);
          returnStructure = {
            header: { status: 201, message: 'Login Success' },
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
          let inputPy = {
            id: [],
            like: {
              history: authRes.historyRecipesIdInfo,
              like: authRes.likeRecipesIdInfo,
              scrap: authRes.scrapRecipesIdInfo,
            },
          };
          let resPython = await UpdateUserPreference(inputPy);
          debugAuth(resPython.data);
          User.userPreference(authRes.userid, resPython.data.scrap, resPython.data.like, resPython.data.history);
          return returnStructure;
        } catch (err) {
          if (isAuthz) {
            // python error
            errorAuth('Python Error in Apple Authorization');
            errorAuth(err);
            returnStructure.header.status = 206;
            returnStructure.header.message = 'Login Success, But Python Error';
            return returnStructure;
          } else {
            errorAuth('Error in Apple Authorization');
            errorAuth(err);
            returnStructure = { header: { status: 401, message: 'Token Error' }, auth: {} };
            return returnStructure;
          }
        }
      } else {
        errorAuth('Incorrect platform Property');
        return { header: { status: 401, message: 'Incorrect platform Property' }, auth: {} };
      }
    case 0: // All Access
      debugAuth('Access Success');
      return { header: { status: 200, message: 'Access Success' } };
    case 1: // Have Already Authorized token
      if (platform && (platform == 'google' || platform == 'kakao' || platform == 'apple')) {
        let resRedis = await redisGet(token);
        debugAuth('Redis: ' + resRedis);
        if (!resRedis) {
          errorAuth('Token Error');
          return { header: { status: 401, message: 'Token Error' } };
        } else {
          debugAuth('Access Success');
          return {
            header: { status: 200, message: 'Access Success' },
            auth: { securityId: resRedis },
          };
        }
      } else {
        errorAuth('Incorrect platform Property');
        return { header: { status: 401, message: 'Incorrect platform Property' } };
      }
    case 2: // Have good states when Authorizing token
      if (platform && platform == 'google') {
        try {
          const authRes = await verify_google(token, false);
          if (!authRes) throw { response: { status: 404, statusText: "Cant' find Data" } }; // mongo에 데이터가 없을 때
          debugAuth('Access Success');
          return { header: { status: 200, message: 'Access Success' }, auth: { securityId: String(authRes.userid) } };
        } catch (err: any) {
          if (err.hasOwnProperty('response')) {
            errorAuth(err.response.statusText);
            return { header: { status: err.response.status, message: err.response.statusText } };
          } else {
            errorAuth(String(err).split(':')[1]);
            return { header: { status: 401, message: String(err).split(':')[1] } };
          }
        }
      } else if (platform && platform == 'kakao') {
        try {
          const authRes = await verify_kakao(token, false);
          if (!authRes) throw { response: { status: 404, statusText: "Cant' find Data" } }; // mongo에 데이터가 없을 때
          debugAuth('Access Success');
          return { header: { status: 200, message: 'Access Success' }, auth: { securityId: String(authRes.userid) } };
        } catch (err: any) {
          errorAuth(err.response.statusText);
          return { header: { status: err.response.status, message: err.response.statusText } };
        }
      } else if (platform && platform == 'apple') {
        try {
          const authRes = await verify_apple(token, false);
          if (!authRes) throw { response: { status: 404, statusText: "Cant' find Data" } }; // mongo에 데이터가 없을 때
          debugAuth('Access Success');
          return { header: { status: 200, message: 'Access Success' }, auth: { securityId: String(authRes.userid) } };
        } catch (err: any) {
          errorAuth(err.response.statusText);
          return { header: { status: err.response.status, message: err.response.statusText } };
        }
      } else {
        errorAuth('Incorrect platform Property');
        return { header: { status: 401, message: 'Incorrect platform Property' } };
      }
    default:
      errorAuth('Api Authorization Error (Security Number Error)');
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
  debugAuth('Google UserID: ' + userid);
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
  debugAuth('Kakao UserId: ' + userid);
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

async function verify_apple(token: string, init: boolean) {
  let userid = token;
  userid = crypto.createHash('sha512').update(String(userid)).digest('base64');
  let securityTk = crypto.createHash('sha512').update(String(token)).digest('base64');
  debugAuth('Apple UserId: ' + userid);
  if (init) {
    // 처음 로그인할 때
    let Userinfo = { userid: userid, platform: 'Apple', token: securityTk };
    return User.getInfoByUserid(userid).then((result: object) => {
      if (!result) return User.createInfo(Userinfo);
      else return User.updateTokenByUserid(userid, securityTk);
    });
  } else {
    // 이후 권한 확인할 때
    return User.getInfoByUserid(userid);
  }
}
