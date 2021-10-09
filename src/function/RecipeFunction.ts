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
