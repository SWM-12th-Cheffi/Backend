const debug = require('debug')('Cheffi:Mongo');

var mongoose = require('mongoose');
var mongoAddr: string = String(process.env.MONGO_ADDR);
export const user_db = mongoose.createConnection(mongoAddr + 'user');

var handleOpen = () => {
  debug(`Connected to user_db`);
};

user_db.once('open', handleOpen);

var Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
    id: Schema.Types.ObjectID,
    recipeCount: { type: Number, require: false, default: 0 },
    nickname: { type: String, require: false, default: '' },
    statusMessage: { type: String, require: false, default: '' },
    photo: { type: String, require: false, default: '' },
    dislikeIngredient: { type: Array, require: false },
    scrapRecipesId: { type: Array, require: false },
    likeRecipesId: { type: Array, require: false },
    historyRecipesId: { type: Array, require: false },
    refriger: { type: Array, require: false },

    preferenceVector: { type: Array, require: false },
    userid: { type: String, require: true, unique: true },
    token: { type: String, require: true },
    platform: { type: String, require: true },
  },
  {
    versionKey: false,
  },
);

// - 사용자의 정보를 만들기 func Authorization
UserSchema.statics.createInfo = function (payload: any) {
  // this === Model
  const user = new this(payload);
  // return Promise
  return user.save();
};

// - 초기설정 /user/info/init
UserSchema.statics.initInfoByUserid = function (securityId: String, reqData: any) {
  return this.updateOne(
    { userid: securityId },
    {
      nickname: reqData.nickname,
      dislikeIngredient: reqData.dislike,
      likeRecipesId: reqData.like,
      photo: reqData.photo,
    },
  );
};

// - Userid로 사용자의 정보를 받아옴 func Authorization /user/info /user/recipe-count
UserSchema.statics.getInfoByUserid = function (userid: string) {
  return this.findOne({ userid: userid });
};

// - 사용자의 토큰을 업데이트 func Authorization
UserSchema.statics.updateTokenByUserid = function (userid: string, payload: string) {
  return this.findOneAndUpdate({ userid: userid }, { token: payload });
};

// - 냉장고 데이터를 사용자 db에 업데이트 /user/refriger /recipe/list
UserSchema.statics.updateRefrigerByUserid = function (userid: string, fridge: object, recipecount: number) {
  return this.findOneAndUpdate({ userid: userid }, { refriger: fridge, recipeCount: recipecount });
};

// - 좋아요 버튼 /user/like
UserSchema.statics.addLikeRecipeIdByUserid = function (userid: string, likeRecipeId: number) {
  return this.updateOne({ userid: userid }, { $addToSet: { likeRecipesId: likeRecipeId } });
};

// Create Model & Export
module.exports = user_db.model('user', UserSchema);
