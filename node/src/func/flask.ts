import axios, { AxiosPromise } from 'axios';

// reqres 사이트와 통신에 사용할 axios 객체 하나만들어두고 재사용하기
const reqresApi = axios.create({
    baseURL: 'https://reqres.in', // Url
    timeout: 5000 // timeout 5초
});

/*
export function fetchUser(id: number): AxiosPromise<UserResponse> {
    return reqresApi.get(`/api/users/${id}`);
    postres.send(
        fetch("http://localhost:3001/recc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Test",
            body: "I am testing!",
            userId: 1,
          }),ß
        })
        .then((data)=>{
          if(data.error) {
            console.log(data.error);
          }
          else{
            console.log(data.title);
          }
        })
        );
}
*/