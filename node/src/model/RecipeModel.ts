var mongoose = require('mongoose');
var mongoAddr: string = String(process.env.MONGO_ADDR);
const recipe_db = mongoose.createConnection(mongoAddr + 'recipe');

var handleOpen = () => {
  console.log(`Connected to recipe_db`);
};

recipe_db.once('open', handleOpen);

var Schema = mongoose.Schema;

var RecipeSchema = new Schema(
  {
    id: Schema.Types.ObjectID,
    recipeid: { type: Number, require: true, unique: true },
    title: { type: String, require: true },
    scrap: { type: Number, require: false, default: null }, // 만개의 레시피에는 없음
    time: { type: String, require: false },
    calories: { type: Number, require: false, default: null }, // 만개의 레시피에는 없음
    size: { type: Number, require: false, default: null }, // 해먹에는 없음
    difficulty: { type: String, require: false, default: '' }, // 해먹에는 없음
    ingredient: { type: Array, require: false, default: [] }, // 해먹 재료 데이터 업데이트 필요
    test: { type: Boolean, require: false },
  },
  {
    versionKey: false,
  },
);

// Create new recipe document
RecipeSchema.statics.create = function (payload: any) {
  // this === Model
  const recipe = new this(payload);
  // return Promise
  return recipe.save();
};

// 랜덤으로 레시피를 뽑아옴
RecipeSchema.statics.randomRecipe = function (num: number) {
  return this.aggregate([{ $sample: { size: num } }, { $project: { _id: 0, recipeid: 1, title: 1 } }]);
};

// 입력받은 레시피 번호 배열로 각 레시피 정보를 받아옴.
RecipeSchema.statics.ListPossiRP = function (num: number[]) {
  return this.find({
    $or: num.map((x) => {
      return { recipeid: x };
    }),
  });
};

// Find by recipeid
RecipeSchema.statics.findByRecipeid = function (recipeid: number[]) {
  return this.find({ recipeid });
};

// Update by recipeid
RecipeSchema.statics.updateByRecipeid = function (recipeid: number, payload: any) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ recipeid }, payload, { new: true });
};

// Create Model & Export
module.exports = recipe_db.model('haemuk', RecipeSchema);
