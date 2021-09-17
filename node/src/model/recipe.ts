var mongoose = require('mongoose');

var Schema = mongoose.Schema,
  ObjectID = Schema.ObjectID;

var RecipeSchema = new Schema({
  id: { type: ObjectID, require: true, unique: true },
  recipeId: { type: Number, require: true, unique: true },
  title: { type: String, require: true },
  scrap: { type: String, require: false },
  time: { type: String, require: false },
  kcal: { type: String, require: false },
});

const Haemuk = mongoose.model('haemuk', RecipeSchema);

// Create new recipe document
RecipeSchema.statics.create = function (payload: any) {
  // this === Model
  const recipe = new this(payload);
  // return Promise
  return recipe.save();
};

// Find All
RecipeSchema.statics.findAll = function () {
  // return promise
  // V4부터 exec() 필요없음
  return this.find({});
};

// Find One by recipeid
RecipeSchema.statics.findOneByrecipeid = function (recipeid: number) {
  return this.findOne({ recipeid });
};

// Update by recipeid
RecipeSchema.statics.updateByrecipeid = function (recipeid: number, payload: any) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ recipeid }, payload, { new: true });
};

// Create Model & Export
module.exports = mongoose.model('recipe', RecipeSchema);
