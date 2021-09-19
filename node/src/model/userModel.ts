var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: Schema.Types.ObjectID,
  nickname: { type: String, require: true, unique: true },
  prefVector: { type: Array, require: true },
  ingredient: { type: Array, require: false },
  statusMessage: { type: String, require: false },
  historyRecipe: { type: Array, require: false },
  scrapRecipe: { type: Array, require: false },
  uneatable: { type: Array, require: false },
  token: { type: String, require: true, unique: true },
});

const User = mongoose.model('user', UserSchema);

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
UserSchema.statics.findOneByuserid = function (userid: number) {
  return this.findOne({ userid });
};

// Update by userid
UserSchema.statics.updateByuserid = function (userid: number, payload: any) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ userid }, payload, { new: true });
};

// Create Model & Export
module.exports = mongoose.model('user', UserSchema);
