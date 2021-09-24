var mongoose = require('mongoose');

var mongoAddr: string = String(process.env.MONGO_ADDR);
const user_db = mongoose.createConnection(mongoAddr + 'user');

var handleOpen = () => {
  console.log(`Connected to user_db`);
};

user_db.once('open', handleOpen);

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    id: Schema.Types.ObjectID,
    nickname: { type: String, require: false },
    statusMessage: { type: String, require: false },
    photo: { type: String, require: false },
    dislikeIngredient: { type: Array, require: false, default: undefined },
    scrapRecipesId: { type: Array, require: false, default: undefined },
    likeRecipesId: { type: Array, require: false, default: undefined },
    historyRecipesId: { type: Array, require: false, default: undefined },
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

UserSchema.statics.findOneByUserToken = function (token: string) {
  return this.findOne({ token: token });
};

// Update by userid
UserSchema.statics.updateTokenByUserid = function (userid: string, payload: string) {
  return this.findOneAndUpdate({ userid: userid }, { token: payload });
};

// Update by userid
UserSchema.statics.updateLikeRecipesByToken = function (token: string, likeRecipe: number[]) {
  return this.updateOne({ token }, { $addToSet: { likeRecipesId: likeRecipe } });
};

// Create Model & Export
module.exports = user_db.model('user', UserSchema);
