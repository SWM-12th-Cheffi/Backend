//Recc setting
import axios from 'axios';
var pyAddr: string = String(process.env.PYTHON_ADDR);

export async function SortByRecc(reccObj: object) {
  return axios({
    method: 'post',
    //server
    url: pyAddr,
    data: reccObj,
  });
}
