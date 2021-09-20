import { builtinModules } from 'module';

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

// Find All
HaemukSchema.statics.findAll = function () {
  // return promise
  // V4부터 exec() 필요없음
  return this.find({});
};

// Find One by recipeid
HaemukSchema.statics.findOneByRecipeid = function (recipeid: number) {
  return this.findOne({ recipeid });
};

// Update by recipeid
HaemukSchema.statics.updateByRecipeid = function (recipeid: number, payload: any) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ recipeid }, payload, { new: true });
};

// Create Model & Export
module.exports = recipe_db.model('haemuk', HaemukSchema);
