var mongoose = require('mongoose');
var mongoAddr: string = String(process.env.MONGO_ADDR);
const recipe_db = mongoose.createConnection(mongoAddr + 'recipe');

var handleOpen = () => {
  console.log(`Connected to recipe_db`);
};

recipe_db.once('open', handleOpen);

var Schema = mongoose.Schema;

var HaemukSchema = new Schema(
  {
    id: Schema.Types.ObjectID,
    recipeid: { type: Number, require: true, unique: true },
    title: { type: String, require: true },
    scrap: { type: Number, require: false },
    time: { type: String, require: false },
    calories: { type: Number, require: false },
    test: { type: Boolean, require: false },
  },
  {
    versionKey: false,
  },
);

// Create new recipe document
HaemukSchema.statics.create = function (payload: any) {
  // this === Model
  const recipe = new this(payload);
  // return Promise
  return recipe.save();
};

// 랜덤으로 레시피를 뽑아옴
HaemukSchema.statics.randomRecipe = function (num: number) {
  return this.aggregate([{ $sample: { size: num } }, { $project: { _id: 0, recipeid: 1, title: 1 } }]);
};

// Find by recipeid
HaemukSchema.statics.findByRecipeid = function (recipeid: number[]) {
  return this.find({ recipeid });
};

// Update by recipeid
HaemukSchema.statics.updateByRecipeid = function (recipeid: number, payload: any) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ recipeid }, payload, { new: true });
};

// Create Model & Export
module.exports = recipe_db.model('haemuk', HaemukSchema);
