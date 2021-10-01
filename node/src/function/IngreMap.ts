const fs = require('fs');

export default async function IngreMapping(ingreList: string[]) {
  fs.readFile('../data/mapping.json', (err: any, data: any) => {
    if (err) throw err;
    const ingreMap = JSON.parse(data);
  });
}
