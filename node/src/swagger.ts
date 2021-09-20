var swaggerJson = {
  swagger: '2.0',
  info: {
    description: 'Api Documentation.',
    version: '1.1.0',
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

    '/user/SaveLikeDemo': {
      post: {
        tags: ['User'],
        summary: '좋아하는 음식을 저장합니다. (처음 입력했을 때)',
        description: '좋아하는 음식의 목록을 저장합니다.',
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
                id: {
                  type: 'array',
                  example: ['짬뽕', '짜장면'],
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

    '/user/FineCook': {
      post: {
        tags: ['User'],
        summary: '사용자가 요리를 마쳤음을 확인',
        description: '레시피의 번호를 입력하면 해당 레시피의 자세한 정보를 불러와서 반환해줍니다.',
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
          '200': {
            description: 'Connecting Success!',
          },
          '405': {
            description: 'Invalid input',
          },
        },
      },
    },

    '/user/ShowIGDynamic': {
      post: {
        tags: ['User'],
        summary: '재료 목록을 동적으로 불러와서 완성',
        description: '레시피의 번호를 입력하면 해당 레시피의 자세한 정보를 불러와서 반환해줍니다.',
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
                id: {
                  type: 'string',
                  example: '양',
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

    '/etc/OrderByFavorite': {
      post: {
        tags: ['etc'],
        summary: '레시피의 자세한 정보를 가져옵니다.',
        description: '레시피의 번호를 입력하면 해당 레시피의 자세한 정보를 불러와서 반환해줍니다.',
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
          '200': {
            description: 'Connecting Success!',
          },
          '405': {
            description: 'Invalid input',
          },
        },
      },
    },

    '/etc/Recc': {
      post: {
        tags: ['etc'],
        summary: '레시피의 자세한 정보를 가져옵니다.',
        description: '레시피의 번호를 입력하면 해당 레시피의 자세한 정보를 불러와서 반환해줍니다.',
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
          '200': {
            description: 'Connecting Success!',
          },
          '405': {
            description: 'Invalid input',
          },
        },
      },
    },

    '/Auth/google': {
      post: {
        tags: ['Auth'],
        summary: 'Google Authentication을 위해서 사용합니다.',
        description:
          'Google ID_Token을 인자로 입력하면 새로운 유저인지 확인하고, 암호화된 token을 반환합니다. Token의 Expiration 시간은 1시간입니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Input Id_Token',
            required: true,
            schema: {
              type: 'object',
              properties: {
                it: {
                  type: 'string',
                  example: '예시는 없습니다... 겁나 깁니다...',
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

    '/Auth/kakao': {
      post: {
        tags: ['Auth'],
        summary: 'Kakao Authentication을 위해서 사용합니다.',
        description:
          'Kakao AccessToken을 인자로 입력하면 새로운 유저인지 확인하고, 암호화된 토큰을 반환합니다. Token의 Expiration 시간은 24시간입니다.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Input AccessToken',
            required: true,
            schema: {
              type: 'object',
              properties: {
                at: {
                  type: 'string',
                  example: '예시는 없습니다... .google보다는 짧습니다.',
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
