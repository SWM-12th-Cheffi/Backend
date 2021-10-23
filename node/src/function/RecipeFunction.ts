import count from '../data/IngreCount';

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
