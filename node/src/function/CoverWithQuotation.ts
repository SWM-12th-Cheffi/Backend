export default function CoverWithQuotation(list: string[]) {
  let tmp: string[] = Object.assign([], list);
  for (let i in tmp) {
    tmp[i] = "'" + tmp[i] + "'";
  }
  return tmp;
}
