var mongoose = require('mongoose');

var mongoAddr: string = String(process.env.MONGO_ADDR);
export const user_db = mongoose.createConnection(mongoAddr + 'user');
const debug = require('debug')('Cheffi:Mongo');
var collectionSet = new Set();

var handleOpen = () => {
  debug(`Connected to user_db`);
  user_db.db.listCollections().toArray(function (err: any, names: any) {
    for (let i in names) {
      collectionSet.add(names[i].name);
    }
    debug(collectionSet);
  });
};
/*
function createUserHistoryCollection(id) {
  if (!collectionSet.has(id)) {
    var history = new Schema({
      time: { type: Date, default: Date.now, require: true },
      recipeId: { type: Number, require: true },
    });
    collectionSet[id] = mongoose.model(id, history);
  }
  return collectionSet[id];
}
*/
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

// Create new user document
UserSchema.statics.create = function (payload: any) {
  // this === Model
  const user = new this(payload);
  // return Promise
  return user.save();
};

// Find All
UserSchema.statics.findAll = function () {
  // return promise
  // V4부터 exec() 필요없음
  return this.find({});
};

// Find One by userid
UserSchema.statics.findOneByUserid = function (userid: string) {
  return this.findOne({ userid: userid });
};

// Find One by userid
UserSchema.statics.findRefrigerByUserid = function (userid: string) {
  return this.findOne([{ userid: userid }, { $project: { _id: 0, refriger: 1 } }]);
};

UserSchema.statics.findOneByUserToken = function (token: string) {
  return this.findOne({ token: token });
};

// Update by userid
UserSchema.statics.updateTokenByUserid = function (userid: string, payload: string) {
  return this.findOneAndUpdate({ userid: userid }, { token: payload });
};

// Update by userid
UserSchema.statics.updateRefrigerByUserid = function (userid: string, fridge: object, recipecount: number) {
  return this.findOneAndUpdate({ userid: userid }, { refriger: fridge, recipeCount: recipecount });
};

// 초기설정
UserSchema.statics.initUserInfo = function (reqData: any) {
  return this.updateOne(
    { token: reqData.token },
    {
      nickname: reqData.nickname,
      dislikeIngredient: reqData.dislike,
      likeRecipesId: reqData.like,
      photo: reqData.photo,
    },
  );
};

// 좋아하는 레시피라고 클릭했을 때 몽고에 추가함. 1개씩 가능
UserSchema.statics.addLikeRecipesByToken = function (userid: string, likeRecipe: string) {
  return this.updateOne({ userid: userid }, { $addToSet: { likeRecipesId: likeRecipe } });
};

// Create Model & Export
module.exports = user_db.model('user', UserSchema);
