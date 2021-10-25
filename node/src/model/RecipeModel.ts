const debug = require('debug')('cheffi:mongo');

var mongoose = require('mongoose');
var mongoAddr: string = String(process.env.MONGO_ADDR);
export const recipe_db = mongoose.createConnection(mongoAddr + 'recipe');

var handleOpen = () => {
  debug(`Connected to recipe_db`);
};

recipe_db.once('open', handleOpen);

var Schema = mongoose.Schema;
var RecipeSchema = new Schema(
  {
    id: Schema.Types.ObjectID,
    recipeid: { type: Number, require: true, unique: true },
    title: { type: String, require: true },
    summary: { type: String, require: false, default: '' },
    scrap: { type: Number, require: false, default: null }, // 만개의 레시피에는 없음
    time: { type: String, require: false },
    calories: { type: Number, require: false, default: null }, // 만개의 레시피에는 없음
    size: { type: Number, require: false, default: null }, // 해먹에는 없음
    difficulty: { type: String, require: false, default: '' }, // 해먹에는 없음
    ingredient: { type: Array, require: false, default: [] }, // 해먹 재료 데이터 업데이트 필요
    test: { type: Boolean, require: false },
    innerscrap: { type: Number, require: true, default: 0 }, // 어플 내부에서 사용하는 스크랩 수
  },
  {
    versionKey: false,
  },
);

// - 랜덤으로 레시피를 뽑아옴 /recipe/random-recipe
RecipeSchema.statics.getRandomRecipe = function (num: number) {
  return this.aggregate([
    { $sample: { size: num } },
    { $project: { _id: 0, ingredient: 0 /*recipeid: 1, title: 1*/ } },
  ]);
};

// 입력받은 레시피 번호 배열로 각 레시피 정보를 받아옴. /recipe/list
RecipeSchema.statics.getListRecipeInfo = function (num: number[]) {
  return this.find(
    {
      $or: num.map((x) => {
        return { recipeid: x };
      }),
    },
    { _id: 0, ingredient: 0 /*recipeid: 1, title: 1*/ },
  );
};

// RecipeId에 해당하는 레시피 정보를 가져옴 /recipe/info
RecipeSchema.statics.getRecipeInfoByRecipeId = function (recipeid: number[]) {
  return this.find({ recipeid });
};

// Create Model & Export
module.exports = recipe_db.model('haemuk', RecipeSchema);
