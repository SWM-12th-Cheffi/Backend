import axios from 'axios';
var pyAddr: string = String(process.env.PYTHON_ADDR);

// 레시피를 사용자에 맞게 추천해주는 함수
export async function SortByRecc(reccObj: object) {
  console.log(reccObj);
  return axios({
    method: 'post',
    //server
    url: pyAddr + '/recommend',
    data: reccObj,
  });
}

// 저장된 유저 정보를 기반으로 선호도 데이터를 업데이트하는 함수
export async function UpdateUserPreference(reccObj: object) {
  console.log(reccObj);
  return axios({
    method: 'post',
    //server
    url: pyAddr + '/userpreference_update',
    data: reccObj,
  });
}
