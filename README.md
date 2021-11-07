Cheffi_Backend
==============
> 소프트웨어 마에스트로 12기 Cheffi팀의 백엔드 Git Readme.md 입니다.

## Cheffi 프로젝트 요약
#### 사용자가 가지고 있는 재료로 만들 수 있는 레시피를 구하여 사용자의 정보에 맞추어 추천하는 순서대로 레시피를 제공한다. 재료간의 유사도를 측정하여 비슷한 재료는 대체하여 사용할 수 있도록 하였다.

## Node
    npm install
        : package.json 파일 내의 패키지 설치
    npm run start:dev
        : 개발 명령어
    npm run build
    npm run start
        : 배포 명령어
### Node API 
Cheffi API의 내용을 정리한 Swagger 페이지입니다. 다음 페이지에서 모든 기능을 시험해볼 수 있습니다.

API Category: Test, Auth, Recipe, Info, Scrap, History, Admin
API의 종류는 위와같이 나눌 수 있습니다. 대부분의 기능은 Auth의 /auth API를 통해 로그인을 진행하여야 하며, 로그인을 진행하지 않으면, 다른 api의 접근이 막힙니다. 이는 백엔드 내에 API Gateway를 구현해놓았기 때문입니다.
Link: [Cheffi][CheffiLink]

[CheffiLink]: https://cheffi-api.link/api-json/ "Go google"
    
