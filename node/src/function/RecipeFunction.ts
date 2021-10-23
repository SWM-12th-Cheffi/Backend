import count from '../data/IngreCount';
const debugpagination = require('debug')('cheffi:pagination');
const errorpagination = require('debug')('cheffi:pagination:error');

export function CoverWithQuotation(list: string[]) {
  let tmp: string[] = Object.assign([], list);
  for (let i in tmp) {
    tmp[i] = "'" + tmp[i] + "'";
  }
  return tmp;
}

export function RefrigerToIngredientList(refriger: any) {
  let ingredientList: Array<string> = new Array();
  for (let i in refriger) {
    for (let j in refriger[i].data) ingredientList.push(refriger[i].data[j]);
  }
  return ingredientList;
}

export function GetReccIngred(ingredientList: string[]) {
  let reccIngredList: any = [];
  let num = 0;
  for (let i in count) {
    // each object index
    for (let j in count[i]) {
      if (num >= 20) return reccIngredList;
      if (!ingredientList.includes(j)) reccIngredList.push({ name: j, category: count[i][j].category });
      num = num + 1;
    }
  }
}

export function SortRecipeInfoByOrder(recipeInfo: any[], orderStandard: number[]) {
  let arrayToObject: any = {}; // 레시피 정보 리스트
  for (let i in recipeInfo) arrayToObject[recipeInfo[i].recipeid] = recipeInfo[i]; // 레시피 id 객체로 저장
  let sortedRecipeInfo = [];
  for (let i in orderStandard) sortedRecipeInfo.push(arrayToObject[orderStandard[i]]); // 순서 맞추기
  return sortedRecipeInfo;
}

export function Pagination(recipeInfo: any[], step: number, nowPage: number) {
  let maxPage: number = parseInt(String(recipeInfo.length / step));
  if (recipeInfo.length % step != 0) maxPage += 1; // maxPage를 계산하는 부분
  if (nowPage > maxPage) {
    // maxPage를 nowPage가 넘으면 안됨
    errorpagination('max Page: ' + maxPage + ', request Page: ' + nowPage);
    return { statusMessage: 'max Page: ' + maxPage, statusCode: 400, return: {} };
  } else {
    let returnStructure: object = {
      recipe: recipeInfo.slice((nowPage - 1) * step, nowPage * step),
      //recipe: resMon.slice((nowPage - 1) * step, nowPage * step),
      maxPage: maxPage,
    };
    debugpagination('Result: ' + returnStructure);
    return {
      statusMessage: 'Pagenation Success',
      statusCode: 201,
      return: returnStructure,
    };
  }
}
