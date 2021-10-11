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
    refriger: {
      type: Array,
      require: false,
      default: [
        {
          title: '가공식품',
          data: [],
        },
        {
          title: '계란/유제품',
          data: [],
        },
        {
          title: '과일류',
          data: [],
        },
        {
          title: '떡/밥/곡류',
          data: [],
        },
        {
          title: '빵/면/만두류',
          data: [],
        },
        {
          title: '채소류',
          data: [],
        },
        {
          title: '수산/건어물',
          data: [],
        },
        {
          title: '육류',
          data: [],
        },
        {
          title: '음료/주류',
          data: [],
        },
        {
          title: '장/양념/소스류',
          data: [],
        },
        {
          title: '초콜릿/과자/견과류',
          data: [],
        },
        {
          title: '향신료/가루류',
          data: [],
        },
      ],
    },

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

// - 초기설정 /user/info put
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

// - Userid로 사용자의 정보를 받아옴 func Authorization /user/info get /user/recipe-count
UserSchema.statics.getInfoByUserid = function (userid: string) {
  return this.findOne({ userid: userid });
};

// - Userid로 사용자의 정보를 받아옴 func Authorization /user/info get /user/recipe-count
UserSchema.statics.removeInfoByUserid = function (userid: string) {
  return this.deleteOne({ userid: userid });
};

// - 사용자의 토큰을 업데이트 func Authorization
UserSchema.statics.updateTokenByUserid = function (userid: string, payload: string) {
  return this.findOneAndUpdate({ userid: userid }, { token: payload });
};

// - 냉장고 데이터를 사용자 db에 업데이트 /user/refriger /recipe/list
UserSchema.statics.updateRefrigerByUserid = function (userid: string, fridge: object, recipecount: number) {
  return this.findOneAndUpdate({ userid: userid }, { refriger: fridge, recipeCount: recipecount });
};

// - 좋아요 버튼 /user/like get
UserSchema.statics.getLikeRecipeIdByUserid = function (userid: string) {
  return this.findOne({ userid: userid }, { _id: 0, likeRecipesId: 1 });
};

// - 좋아요 버튼 /user/like put
UserSchema.statics.addLikeRecipeIdByUserid = function (userid: string, likeRecipeId: number) {
  return this.updateOne({ userid: userid }, { $addToSet: { likeRecipesId: likeRecipeId } });
};

// - 좋아요 버튼 /user/like delete
UserSchema.statics.removeLikeRecipeIdByUserid = function (userid: string, likeRecipeId: number) {
  return this.updateOne({ userid: userid }, { $pull: { likeRecipesId: likeRecipeId } });
};

// Create Model & Export
module.exports = user_db.model('user', UserSchema);
