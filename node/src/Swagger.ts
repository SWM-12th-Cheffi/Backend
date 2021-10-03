import { integer } from 'neo4j-driver';

var swaggerJson = {
  swagger: '2.0',
  info: {
    description: 'Api Documentation.',
    version: '0.2.0',
    title: 'Cheffi Api',
  },
  host: '18.220.121.204:2001',
  basePath: '/',
  tags: [
    {
      name: 'Test',
      description: 'for Test',
    },
    {
      name: 'Auth',
      description: 'Google, Kakao Authentication Setting',
    },
    {
      name: 'Recipe',
      description: 'Everything about Recipe Info',
    },
    {
      name: 'User',
      description: 'Everything about User Info',
    },
  ],
  schemes: ['http', 'https'],
  paths: {
    '/': {
      post: {
        tags: ['Test'],
        summary: 'Post 방식의 전송을 테스트할 때 사용합니다.',
        description: 'If you send the information through this route, the same information will be returned.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Input information that you want to return',
            required: true,
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  example: 'TestCase',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Connecting Success!',
          },
          '405': {
            description: 'Invalid input',
          },
        },
      },
    },

    '/Auth': {
      post: {
        tags: ['Auth'],
        summary: '주어진 token과 platform을 사용하여 로그인을 진행합니다.',
        description:
          '각 플랫폼의 token과 "google", "kakao" 플랫폼의 데이터를 입력하면 해당하는 플랫폼으로 로그인을 진행합니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
        ],
        responses: {
          '200': {
            description: 'Login Success',
          },
          '401': {
            description: '잘못된 입력입니다.',
          },
          '500': {
            description: 'Mongo Error입니다. 관리자에게 문의주세요.',
          },
        },
      },
    },

    '/recipe/number': {
      post: {
        tags: ['Recipe'],
        summary: '냉장고 데이터를 post로 전송, redis에 저장한 후 만들 수 있는 레시피의 개수를 반환',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform), Body(refriger) \n Output: status, num, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
          {
            in: 'body',
            name: 'refriger',
            description: '냉장고 데이터를 입력해주세요.',
            required: true,
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: '가공식품',
                  },
                  data: {
                    type: 'array',
                    items: ['햇반', '스팸', '즉석밥'],
                  },
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/recipe/list': {
      get: {
        tags: ['Recipe'],
        summary: 'redis에 저장된 냉장고 데이터로 만들 수 있는 레시피 반환, redis에 저장된 냉장고 데이터를 Mongo에 저장',
        description:
          'Authorization 2 \n /recipe/number로 저장한 냉장고 데이터를 활용하는 함수\n전송 방식: Get \n Input: Header(Token, Platform) \n Output: status, recipe, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/recipe/info': {
      get: {
        tags: ['Recipe'],
        summary: '요청한 id에 해당하는 레시피 데이터 반환',
        description:
          'Authorization 0 \n 전송 방식: Get \n Input: Header(Token, Platform), Query(id) \n Output: status, recipe, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
          {
            in: 'query',
            name: 'id',
            description: '원하는 레시피 번호를 입력해주세요.',
            required: true,
            schema: {
              type: 'integer',
              format: 'int32',
              example: 5980,
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/recipe/random-list': {
      get: {
        tags: ['Recipe'],
        summary: '원하는 수만큼의 랜덤 레시피를 불러옵니다.',
        description:
          'Authorization 0 \n 전송 방식: Get \n Input: Header(Token, Platform), Query(num) \n Output: status, recipe, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
          {
            in: 'query',
            name: 'num',
            description: '원하는 레시피의 수를 입력해주세요.',
            required: true,
            schema: {
              type: 'integer',
              format: 'int32',
              example: 20,
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/user/like': {
      get: {
        tags: ['User'],
        summary: '사용자가 like를 누른 레시피를 저장합니다.',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform), Query(id) \n Output: status, likeRecipesId, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
          {
            in: 'query',
            name: 'id',
            description: '레시피 번호를 입력해주세요',
            required: true,
            schema: {
              type: 'integer',
              format: 'int32',
              example: 5980,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/user/info/init': {
      post: {
        tags: ['User'],
        summary: '사용자 정보 초기 설정',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform), Body(data) \n Output: status, info, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
          {
            in: 'body',
            name: 'data',
            description: '사용자 데이터를 입력해주세요.',
            required: true,
            schema: {
              type: 'object',
              properties: {
                nickname: {
                  type: 'string',
                  exampel: 'exampleNickname',
                },
                dislikeIngredient: {
                  type: 'array',
                  items: ['ingre', 'ingre'],
                },
                likeRecipesId: {
                  type: 'array',
                  items: [5980, 5989],
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/user/info': {
      get: {
        tags: ['User'],
        summary: '사용자 정보 불러오기',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform) \n Output: status, info, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/user/refriger': {
      put: {
        tags: ['User'],
        summary: '냉장고 데이터를 post로 전송, Mongo에 저장.',
        description:
          'Authorization 2 \n 전송 방식: Put \n Input: Header(Token, Platform), Body(refriger) \n Output: status, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
          {
            in: 'body',
            name: 'refriger',
            description: '냉장고 데이터를 입력해주세요.',
            required: true,
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: '가공식품',
                  },
                  data: {
                    type: 'array',
                    items: ['햇반', '스팸', '즉석밥'],
                  },
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },

    '/user/recipe-count': {
      get: {
        tags: ['User'],
        summary: 'Mongo에 있는 냉장고 데이터로 만들 수 있는 레시피의 수 출력.',
        description:
          'Authorization 2 \n 전송 방식: Get \n Input: Header(Token, Platform),  \n Output: status, num, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'head',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'head',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
          },
          '401': {
            description: 'Authorization Error',
          },
          '404': {
            description: 'Data not Found',
          },
          '500': {
            description: 'Mongo Error',
          },
        },
      },
    },
  },
};
export default swaggerJson;
