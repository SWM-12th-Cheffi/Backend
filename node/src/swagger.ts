var swaggerJson = {
  swagger: '2.0',
  info: {
    description: 'Api Documentation.',
    version: '0.1.2',
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
      name: 'Recipe',
      description: 'Everything about Recipe Info',
    },
    {
      name: 'User',
      description: 'Everything about User Info',
    },
    {
      name: 'etc',
      description: 'It could be used one day',
    },
    {
      name: 'Auth',
      description: 'Google, Kakao Authentication Setting',
    },
    {
      name: 'admin',
      description: 'Function for Admin',
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

    '/recipe/NumPossiRP': {
      post: {
        tags: ['Recipe'],
        summary: '재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능(유사재료 검색 미포함)',
        description:
          '재료 목록을 input으로 주게 된다면 해당 목록을 기반으로 만들 수 있는 레시피의 개수를 반환해줍니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '재료의 목록을 입력해주세요.',
            required: true,
            schema: {
              type: 'object',
              properties: {
                ingre: {
                  type: 'array',
                  example: [
                    '당근',
                    '소금',
                    '양파',
                    '후추',
                    '쪽파',
                    '설탕',
                    '대파',
                    '계란',
                    '달걀',
                    '마늘',
                    '다진마늘',
                    '간장',
                    '밥',
                    '배추김치',
                    '김치',
                    '고춧가루',
                    '식용유',
                    '두부',
                    '물',
                    '식초',
                    '무',
                    '꿀',
                    '오징어',
                    '밀가루',
                    '콩나물',
                  ],
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
    '/recipe/NumPossiRP_Sim': {
      post: {
        tags: ['Recipe'],
        summary: '재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능(유사재료 검색 포함)',
        description:
          '재료 목록을 input으로 주게 된다면 유사재료를 포함한 재료의 목록을 기반으로 만들 수 있는 레시피의 개수를 반환해줍니다.(유사재료를 Neo4j에서 가져오기 때문에 시간이 좀 걸립니다.)',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '재료의 목록을 입력해주세요.',
            required: true,
            schema: {
              type: 'object',
              properties: {
                ingre: {
                  type: 'array',
                  example: [
                    '당근',
                    '소금',
                    '양파',
                    '후추',
                    '쪽파',
                    '설탕',
                    '대파',
                    '계란',
                    '달걀',
                    '마늘',
                    '다진마늘',
                    '간장',
                    '밥',
                    '배추김치',
                    '김치',
                    '고춧가루',
                    '식용유',
                    '두부',
                    '물',
                    '식초',
                    '무',
                    '꿀',
                    '오징어',
                    '밀가루',
                    '콩나물',
                  ],
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
    '/recipe/ListPossiRP': {
      post: {
        tags: ['Recipe'],
        summary: '재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수 (유사재료 검색 미포함)',
        description:
          '재료 목록을 input으로 주게 된다면 해당 목록을 기반으로 만들 수 있는 레시피의 목록를 추천순으로 정렬하여 반환해줍니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '재료의 목록을 입력해주세요.',
            required: true,
            schema: {
              type: 'object',
              properties: {
                ingre: {
                  type: 'array',
                  example: [
                    '당근',
                    '소금',
                    '양파',
                    '후추',
                    '쪽파',
                    '설탕',
                    '대파',
                    '계란',
                    '달걀',
                    '마늘',
                    '다진마늘',
                    '간장',
                    '밥',
                    '배추김치',
                    '김치',
                    '고춧가루',
                    '식용유',
                    '두부',
                    '물',
                    '식초',
                    '무',
                    '꿀',
                    '오징어',
                    '밀가루',
                    '콩나물',
                  ],
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
    '/recipe/ListPossiRP_Sim': {
      post: {
        tags: ['Recipe'],
        summary: '재료를 통해 만들 수 있는 레시피 번호 리스트를 반환하는 함수 (유사재료 검색 포함)',
        description:
          '재료 목록을 입력하면, 대체재료를 고려하여 만들 수 있는 레시피의 목록을 파이썬의 추천 알고리즘을 거쳐서 추천순으로 나타냅니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '재료의 목록을 입력해주세요.',
            required: true,
            schema: {
              type: 'object',
              properties: {
                ingre: {
                  type: 'array',
                  example: [
                    '당근',
                    '소금',
                    '양파',
                    '후추',
                    '쪽파',
                    '설탕',
                    '대파',
                    '계란',
                    '달걀',
                    '마늘',
                    '다진마늘',
                    '간장',
                    '밥',
                    '배추김치',
                    '김치',
                    '고춧가루',
                    '식용유',
                    '두부',
                    '물',
                    '식초',
                    '무',
                    '꿀',
                    '오징어',
                    '밀가루',
                    '콩나물',
                  ],
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
    '/recipe/find/haemuk': {
      post: {
        tags: ['Recipe'],
        summary: '레시피 번호에 해당하는 정보 반환',
        description:
          '레시피 번호에 해당하는 정보를 반환한다. 레시피 번호를 배열로 입력하면 여러개의 정보가 모두 나온다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '레시피 번호를 입력',
            required: true,
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'array',
                  items: {
                    type: 'integer',
                    format: 'int32',
                  },
                  example: [5977, 5979],
                },
              },
            },
          },
        ],
        responses: {},
      },
    },
    '/recipe/randomRecipeList': {
      post: {
        tags: ['Recipe'],
        summary: '랜덤으로 레시피 데이터를 가져옵니다.',
        description: '원하는 레시피의 개수를 입력하면 해당하는 개수만큼 레시피의 id값과 title값을 가져옵니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '원하는 레시피의 수를 입력',
            required: true,
            schema: {
              type: 'object',
              properties: {
                num: {
                  type: 'integer',
                  format: 'int32',
                  example: 13,
                },
              },
            },
          },
        ],
        responses: {},
      },
    },

    '/user/addLikeRecipe': {
      post: {
        tags: ['User'],
        summary: '좋아하는 음식의 id 값을 추가합니다.',
        description:
          '처음 데이터를 입력할 때에는 아니고, 레시피를 탐색하다가 아 이건 내가 좋아하는 레시피야 하는것들을 저장할 때 사용합니다. 한번에 하나씩 추가할 수 있습니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '레시피의 번호를 입력해주세요.',
            required: true,
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'Hb37ZdQXZ7Pbvk4QMrqtwsd4rdoVRGmBxtf1XGZT4/Nc41V8OQiZQNApC0Enz1f6W+YccLSc1F44Lf1TRv41gQ==',
                },
                likeRecipeId: {
                  type: 'string',
                  example: '5480',
                },
              },
            },
          },
        ],
        responses: {
          '404': {
            description: 'token에 해당하는 유저가 없습니다.',
          },
          '405': {
            description: 'Invalid input',
          },
        },
      },
    },
    '/user/info': {
      post: {
        tags: ['user'],
        summary: '사용자의 정보를 가져오기 위해서 사용합니다.',
        description: 'token과, platform을 적으면 해당되는 사용자의 정보를 불러옵니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Input Token, platform',
            required: true,
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'wuLkMiCXCOXWSpQKTfq3_oTEawDAAU8IO_quUAopb1QAAAF8NXns2g',
                },
                platform: {
                  type: 'string',
                  example: 'kakao',
                },
              },
            },
          },
        ],
        responses: {
          '401': {
            description: ' OAuth 인증에 실패했습니다. 잘못된 정보가 없는지 확인해주세요.',
          },
          '404': {
            description: 'Data를 찾을 수 없습니다. 로그인 해주세요.',
          },
        },
      },
    },
    '/user/refriger': {
      post: {
        tags: ['user'],
        summary: '사용자의 냉장고 정보를 저장하기 위해서 사용합니다.',
        description:
          'token, platform, refriger 정보를 전송하면 해당되는 사용자의 refriger에 데이터를 저장합니다. 덮어씌우기 되는 것으로 []을 refriger에 보내면 빈 냉장고로 변경됩니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Input token, platform, refriger',
            required: true,
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'wuLkMiCXCOXWSpQKTfq3_oTEawDAAU8IO_quUAopb1QAAAF8NXns2g',
                },
                platform: {
                  type: 'string',
                  example: 'kakao',
                },
                refriger: {
                  type: 'array',
                },
              },
            },
          },
        ],
        responses: {
          '401': {
            description: ' OAuth 인증에 실패했습니다. 잘못된 정보가 없는지 확인해주세요.',
          },
          '404': {
            description: 'Data를 찾을 수 없습니다. 로그인 해주세요.',
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
            in: 'body',
            name: 'body',
            description: 'token과 platform을 입력해주세요.',
            required: true,
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: '예시는 없습니다... 겁나 깁니다...',
                },
                platform: {
                  type: 'string',
                  example: 'google or kakao',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Login Success',
          },
          '400': {
            description: 'Mongo Error입니다. 관리자에게 문의주세요.',
          },
          '401': {
            description: '잘못된 입력입니다.',
          },
        },
      },
    },

    '/admin/insert/haemuk': {
      post: {
        tags: ['admin'],
        summary: 'recipe 데이터를 mongo에 추가하기 위해서 사용합니다.',
        description: 'json 배열로 주어지면 데이터가 입력됩니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Input Recipe Inspection',
            required: true,
            schema: {
              type: 'object',
              properties: {
                recipe: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      scrap: {
                        type: 'integer',
                        format: 'int32',
                        example: 42,
                      },
                      time: {
                        type: 'string',
                        example: '30분',
                      },
                      calories: {
                        type: 'number',
                        format: 'float',
                        example: 132.4,
                      },
                      recipeid: {
                        type: 'integer',
                        format: 'int32',
                        example: 10000,
                      },
                      title: {
                        type: 'string',
                        example: '테스트레시피',
                      },
                      test: {
                        type: 'boolean',
                        example: 'true',
                      },
                    },
                  },
                },
              },
            },
          },
        ],
        responses: {
          '401': {
            description: 'Access Token에 해당하는 사용자의 정보가 없습니다.',
          },
        },
      },
    },
  },
};
export default swaggerJson;
