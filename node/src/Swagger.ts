var swaggerJson = {
  swagger: '2.0',
  info: {
    description: 'Api Documentation.',
    version: '0.4.0',
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
      name: 'Info',
      description: 'Everything about User Info',
    },
    {
      name: 'Scrap',
      description: 'Everything about User Scrap',
    },
    {
      name: 'History',
      description: 'Everything about User History',
    },
    {
      name: 'Admin',
      description: 'Everything about Admin',
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
            schema: {
              type: 'string',
              example: 'Connecting POST Test Is OK, Title Value is {POST VALUE}',
            },
          },
          '405': {
            description: 'Invalid input',
          },
        },
      },
    },

    '/auth': {
      post: {
        tags: ['Auth'],
        summary: '주어진 token과 platform을 사용하여 로그인을 진행합니다.',
        description:
          '각 플랫폼의 token과 "google", "kakao" 플랫폼의 데이터를 입력하면 해당하는 플랫폼으로 로그인을 진행합니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
            name: 'platform',
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
            description: 'Login Success',
            schema: {
              type: 'object',
              properties: {
                auth: {
                  type: 'object',
                  properties: {
                    newUser: {
                      type: 'boolean',
                      example: false,
                    },
                    token: {
                      type: 'string',
                      example: 'zwO-mwjKcNpB3UVKO01C1sO_62T0y3xjOP0gMgopb1QAAAF8WaBSsA',
                    },
                    platform: {
                      type: 'string',
                      example: 'kakao',
                    },
                  },
                },
                info: {
                  type: 'object',
                  properties: {
                    recipeCount: {
                      type: 'integer',
                      format: 'int32',
                      example: 38,
                    },
                    nickname: {
                      type: 'string',
                      example: '',
                    },
                    photo: {
                      type: 'string',
                      example: '',
                    },
                    dislikeIngredient: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    scrapRecipesId: {
                      type: 'array',
                      items: {
                        type: 'integer',
                        foemat: 'int32',
                        example: [5980, 5981],
                      },
                    },
                    likeRecipesId: {
                      type: 'array',
                      items: {
                        type: 'integer',
                        foemat: 'int32',
                        example: [5980, 5981],
                      },
                    },
                    historyRecipesId: {
                      type: 'array',
                      items: {
                        type: 'integer',
                        foemat: 'int32',
                        example: [5980, 5981],
                      },
                    },
                  },
                },
                refriger: {
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
            },
          },
          '206': {
            description: '로그인은 되었지만 서버에서 문제가 발생했습니다..',
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

    '/auth/expire-time': {
      get: {
        tags: ['Auth'],
        summary: '토큰이 있다면 토큰 만료 시간을 알려줍니다.',
        description:
          '로그인을 한 뒤에 토큰 만료시간이 몇초남았는지 궁금할 때 호출하는 api... 그냥 테스트용으로 만든겁니다!',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
            name: 'platform',
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
            description: '토큰이 있음. (단위: 초)',
            schema: {
              type: 'object',
              properties: {
                timeToExpire: {
                  type: 'integer',
                  format: 'int32',
                  example: 56,
                },
              },
            },
          },
          '404': {
            description: '토큰이 없음',
          },
          '500': {
            description: 'Redis Error입니다. 관리자에게 문의주세요.',
          },
        },
      },
      delete: {
        tags: ['Auth'],
        summary: 'Redis에 저장된 토큰이 있다면 해당 토큰을 삭제합니다.',
        description: 'Redis의 토큰을 만료시켜버리는 api...입니다',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
            name: 'platform',
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
            description: '토큰 시간을 만료시킴',
          },
          '404': {
            description: '해당하는 토큰이 없음',
          },
          '500': {
            description: 'Redis Error입니다. 관리자에게 문의주세요.',
          },
        },
      },
    },

    '/recipe/number': {
      post: {
        tags: ['Recipe'],
        summary:
          '냉장고 데이터를 post로 전송, redis에 저장한 후 만들 수 있는 레시피의 개수를 반환 (Mongo에는 저장하지 않음)',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform), Body(refriger) \n Output: status, num, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
              type: 'object',
              properties: {
                refriger: {
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
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                num: {
                  type: 'integer',
                  format: 'int32',
                  example: 38,
                },
              },
            },
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
        summary:
          'redis에 저장된 냉장고 데이터로 만들 수 있는 레시피 반환, redis에 저장된 냉장고 데이터를 Mongo에 저장 Pagenation 추가',
        description:
          'Authorization 2 \n /recipe/number로 저장한 냉장고 데이터를 활용하는 함수\n전송 방식: Get \n Input: Header(Token, Platform) \n Output: status, recipe, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            name: 'page',
            description: '원하는 페이지를 입력해주세요. (1페이지부터 시작)',
            required: true,
            schema: {
              page: {
                type: 'integer',
                format: 'int32',
                example: 1,
              },
            },
          },
          {
            in: 'query',
            name: 'step',
            description: '원하는 레시피의 수를 입력해주세요. (한 페이지당 보일 레시피 수)',
            required: true,
            schema: {
              step: {
                type: 'integer',
                format: 'int32',
                example: 10,
              },
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                recipe: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      recipeid: {
                        type: 'number',
                        example: 6926681,
                      },
                      title: {
                        type: 'string',
                        example: '고기야채만두 소만들기 + 찌는법&찌는시간',
                      },
                      scrap: {
                        type: 'integer',
                        format: 'int32',
                        example: null,
                      },
                      time: {
                        type: 'string',
                        example: '20분',
                      },
                      calories: {
                        type: 'integer',
                        format: 'int32',
                        example: null,
                      },
                      size: {
                        type: 'integer',
                        format: 'int32',
                        example: 2,
                      },
                      difficulty: {
                        type: 'string',
                        example: '아무나',
                      },
                      platform: {
                        type: 'string',
                        example: 'mangae',
                      },
                    },
                  },
                },
                maxPage: {
                  type: 'integer',
                  format: 'int32',
                  example: 5,
                },
              },
            },
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
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
          '200': {
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                recipe: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      size: {
                        type: 'string',
                        example: 'asdf',
                      },
                      difficulty: {
                        type: 'string',
                        example: '',
                      },
                      ingredient: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      _id: {
                        type: 'string',
                        example: '1484bddf0f21d67096d7f43',
                      },
                      recipeid: {
                        type: 'integer',
                        format: 'int32',
                        example: 5980,
                      },
                      title: {
                        type: 'string',
                        example: '단호박 스프',
                      },
                      scrap: {
                        type: 'integer',
                        format: 'int32',
                        example: 42,
                      },
                      time: {
                        type: 'string',
                        example: '30분',
                      },
                      calories: {
                        type: 'string',
                        example: 'asdf',
                      },
                    },
                  },
                },
              },
            },
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

    '/recipe/info-list': {
      get: {
        tags: ['Recipe'],
        summary: '요청한 id에 해당하는 레시피 데이터 배열 반환',
        description: '입력한 ids 배열에 맞추어 레시피 데이터를 반환합니다.',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            name: 'ids',
            description: '원하는 레시피 번호를 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: '1234,2345,3456,4567,5678,1234,2345,3456,4567,5768,2345,3456,4567',
            },
          },
          {
            in: 'query',
            name: 'page',
            description: '원하는 페이지를 입력해주세요. pagination 기능이 있습니다',
            required: true,
            schema: {
              type: 'integer',
              format: 'int32',
              example: 1,
            },
          },
          {
            in: 'query',
            name: 'step',
            description: '한번에 보길 원하는 레시피의 개수를 입력해주세요.',
            required: true,
            schema: {
              type: 'integer',
              format: 'int32',
              example: 4,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              type: 'object',
              properties: {
                recipe: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      size: {
                        type: 'string',
                        example: 'asdf',
                      },
                      difficulty: {
                        type: 'string',
                        example: '',
                      },
                      ingredient: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      _id: {
                        type: 'string',
                        example: '1484bddf0f21d67096d7f43',
                      },
                      recipeid: {
                        type: 'integer',
                        format: 'int32',
                        example: 5980,
                      },
                      title: {
                        type: 'string',
                        example: '단호박 스프',
                      },
                      scrap: {
                        type: 'integer',
                        format: 'int32',
                        example: 42,
                      },
                      time: {
                        type: 'string',
                        example: '30분',
                      },
                      calories: {
                        type: 'string',
                        example: 'asdf',
                      },
                    },
                  },
                },
              },
            },
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
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
              type: 'object',
              properties: {
                num: {
                  type: 'integer',
                  format: 'int32',
                  example: 20,
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                recipe: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      recipeid: {
                        type: 'number',
                        example: 6926681,
                      },
                      title: {
                        type: 'string',
                        example: '고기야채만두 소만들기 + 찌는법&찌는시간',
                      },
                      scrap: {
                        type: 'integer',
                        format: 'int32',
                        example: null,
                      },
                      time: {
                        type: 'string',
                        example: '20분',
                      },
                      calories: {
                        type: 'integer',
                        format: 'int32',
                        example: null,
                      },
                      size: {
                        type: 'integer',
                        format: 'int32',
                        example: 2,
                      },
                      difficulty: {
                        type: 'string',
                        example: '아무나',
                      },
                      platform: {
                        type: 'string',
                        example: 'mangae',
                      },
                    },
                  },
                },
              },
            },
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

    '/user/ingre-recc': {
      post: {
        tags: ['Recipe'],
        summary: '추천 재료 반환',
        description: '재료의 빈도수에 따라서 추천 재료를 반환함',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: false,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: false,
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
                refriger: {
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
            },
          },
        ],
        responses: {
          '200': {
            description: 'Load Success',
            schema: {
              type: 'object',
              properties: {
                ingredient: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      category: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
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

    '/user/preference': {
      put: {
        tags: ['Info'],
        summary: 'python Preference-update 함수 호출',
        description: '추천시스템의 api중 하나인 선호도 업데이트 기능을 실행',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            description: 'Python Update Success',
            schema: {
              type: 'object',
              properties: {
                ingredient: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      category: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Python Error',
          },
        },
      },
    },

    '/user/info': {
      get: {
        tags: ['Info'],
        summary: '사용자 정보 불러오기',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform) \n Output: status, info, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                info: {
                  type: 'object',
                  properties: {
                    recipeCount: {
                      type: 'integer',
                      format: 'int32',
                      example: 38,
                    },
                    nickname: {
                      type: 'string',
                      example: '',
                    },
                    photo: {
                      type: 'string',
                      example: '',
                    },
                    dislikeIngredient: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    scrapRecipesId: {
                      type: 'array',
                      items: {
                        type: 'integer',
                        foemat: 'int32',
                        example: [5980, 5981],
                      },
                    },
                    likeRecipesId: {
                      type: 'array',
                      items: {
                        type: 'integer',
                        foemat: 'int32',
                        example: [5980, 5981],
                      },
                    },
                    historyRecipesId: {
                      type: 'array',
                      items: {
                        type: 'integer',
                        foemat: 'int32',
                        example: [5980, 5981],
                      },
                    },
                  },
                },
                refriger: {
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
            },
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
      put: {
        tags: ['Info'],
        summary: '사용자 정보 초기 설정',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform), Body(data) \n Output: status, info, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
                data: {
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
            },
          },
        ],
        responses: {
          '201': {
            description: 'Save Successed',
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
      delete: {
        tags: ['Info'],
        summary: '사용자 정보 삭제',
        description:
          'Authorization 2 \n 전송 방식: Post \n Input: Header(Token, Platform) \n Output: status, info, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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

    '/user/scrap': {
      get: {
        tags: ['Scrap'],
        summary: '사용자가 Scrap한 레시피를 저장합니다.',
        description: '',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            description: '사용자에게 저장된 전체 값을 출력합니다.',
            schema: {
              type: 'object',
              properties: {
                get: {
                  type: 'array',
                  items: {
                    type: 'integer',
                    format: 'int32',
                    example: 5980,
                  },
                },
              },
            },
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
      put: {
        tags: ['Scrap'],
        summary: '사용자가 Scrap한 레시피를 저장합니다.',
        description: '',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            name: 'id',
            description: 'Recipe Id를 입력해주세요',
            required: true,
            schema: {
              type: 'object',
              properties: {
                recipeInfo: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int32',
                      example: 5980,
                    },
                    place: {
                      type: 'integer',
                      format: 'int32',
                      example: 1,
                    },
                    rating: {
                      type: 'integer',
                      format: 'int32',
                      example: 3,
                    },
                  },
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: '사용자에게 저장된 전체 값을 출력합니다.',
            schema: {
              type: 'object',
              properties: {
                put: {
                  type: 'array',
                  items: {
                    type: 'integer',
                    format: 'int32',
                    example: 5980,
                  },
                },
              },
            },
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
      delete: {
        tags: ['Scrap'],
        summary: '사용자가 Scrap한 레시피 목록에서 삭제합니다.',
        description: '',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            name: 'id',
            description: 'Recipe Id를 입력해주세요',
            required: true,
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  format: 'int32',
                  example: 5980,
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: '사용자에게 저장된 전체 값을 출력합니다.',
            schema: {
              type: 'object',
              properties: {
                delete: {
                  type: 'array',
                  items: {
                    type: 'integer',
                    format: 'int32',
                    example: 5980,
                  },
                },
              },
            },
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

    '/user/history': {
      get: {
        tags: ['History'],
        summary: '사용자가 과거에 본 레시피를 저장합니다.',
        description: '',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            description: '사용자에게 저장된 전체 값을 출력합니다.',
            schema: {
              type: 'object',
              properties: {
                get: {
                  type: 'array',
                  items: {
                    type: 'integer',
                    format: 'int32',
                    example: 5980,
                  },
                },
              },
            },
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
      put: {
        tags: ['History'],
        summary: '사용자가 과거에 본 레시피를 저장합니다.',
        description: '',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            name: 'id',
            description: 'Recipe Id를 입력해주세요',
            required: true,
            schema: {
              type: 'object',
              properties: {
                recipeInfo: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int32',
                      example: 5980,
                    },
                    place: {
                      type: 'integer',
                      format: 'int32',
                      example: 1,
                    },
                    rating: {
                      type: 'integer',
                      format: 'int32',
                      example: 3,
                    },
                  },
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: '사용자에게 저장된 전체 값을 출력합니다.',
            schema: {
              type: 'object',
              properties: {
                put: {
                  type: 'array',
                  items: {
                    type: 'integer',
                    format: 'int32',
                    example: 5980,
                  },
                },
              },
            },
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
      delete: {
        tags: ['History'],
        summary: '사용자가 과거에 본 레시피 목록에서 삭제합니다.',
        description: '',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            name: 'id',
            description: 'Recipe Id를 입력해주세요',
            required: true,
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  format: 'int32',
                  example: 5980,
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: '사용자에게 저장된 전체 값을 출력합니다.',
            schema: {
              type: 'object',
              properties: {
                delete: {
                  type: 'array',
                  items: {
                    type: 'integer',
                    format: 'int32',
                    example: 5980,
                  },
                },
              },
            },
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
      get: {
        tags: ['Info'],
        summary: '냉장고 데이터를 불러옴',
        description: '냉장고 데이터를 Mongo에서 불러오고 해당 냉장고 데이터로 Redis에 업데이트함.',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                refriger: {
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
            },
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
      put: {
        tags: ['Info'],
        summary: '냉장고 데이터를 post로 전송, Mongo에 저장.',
        description: '받아온 냉장고 데이터를 Mongo에 저장하고, Redis에도 해당 냉장고 데이터로 변경함.',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
              type: 'object',
              properties: {
                refriger: {
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
            },
          },
        ],
        responses: {
          '201': {
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                num: {
                  type: 'integer',
                  format: 'int32',
                  example: 33,
                },
              },
            },
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
        tags: ['Info'],
        summary: 'Mongo에 있는 냉장고 데이터로 만들 수 있는 레시피의 수 출력.',
        description:
          'Authorization 2 \n 전송 방식: Get \n Input: Header(Token, Platform),  \n Output: status, num, message',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
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
            schema: {
              type: 'object',
              properties: {
                num: {
                  type: 'integer',
                  format: 'int32',
                  example: 33,
                },
              },
            },
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

    '/admin/auth/': {
      get: {
        tags: ['Admin'],
        summary: 'Authorization 테스트 ',
        description:
          '0: all access(토큰같은거 없어도 됨.), </br>1: Have Already Authorized token (로그인으로 인증된 토큰이고, 만료되지도 않았다면 사용할 수 있음.)) </br>2: Have good states when Authorizing token (인증을 직접 받아야하는 API - 로그인 아님!) </br> Postman으로 넘겨주세요... swagger JSON 형식이 데이터가 너무 없어서... 어캐 써야할지 모르겠어... </br> /admin/auth/1 처럼 url상에 level 정보를 주면 됩니다.',
        consumes: 'application/json',
        produces: 'application/json',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            description: '인증 방식과 토큰을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              example: 'Bearer TOTOTOTOOTOTTOOKENENEKENKENKENE',
            },
          },
          {
            in: 'header',
            name: 'Platform',
            description: '인증 플랫폼을 입력해주세요.',
            required: true,
            schema: {
              type: 'string',
              enum: ['kakao', 'google'],
            },
          },
          {
            in: 'path',
            name: 'level',
            description: '인증 레벨을 입력해주세요',
            required: true,
            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Good Status',
            schema: {
              type: 'object',
              properties: {
                securityId: {
                  type: 'String',
                  example: 'qwerqwfdsagasvasvasdfvcqewvsvv==',
                },
              },
            },
          },
          '401': {
            description: 'Authorization Error (인증되지 않은 토큰 오류)',
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
