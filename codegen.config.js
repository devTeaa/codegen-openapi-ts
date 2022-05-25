'use strict'

const baseOutput = value => 'default/src/api-types/' + value

module.exports = [
  {
    source: 'ssh://git@stash.gdn-app.com:7999/oxford/pyeongyang-official.git herman-schema.json -- docs/api-schema.json',
    from: 'openapi_3',
    output: baseOutput('pyeongyang-official'),
    urlMethodMapping: [
      ['/backend/official/merchant-favorites', 'get', 'GetFollowerList'],
      ['/backend/official/merchant-favorites/{merchantId}', 'get', 'GetStoreFollower'],
      ['/backend/official/merchant-favorites/{merchantId}/_follow', 'post', 'PostFollowStore'],
      [
        '/backend/official/merchant-favorites/{merchantId}/_unfollow',
        'delete',
        'DeleteUnfollowStore'
      ]
    ],
    selectedOnly: true,
    modelNameMapping: [
      [
        new RegExp(
          'com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetListMerchantFavoritesWebResponse\\$Badge',
          'g'
        ),
        'MerchantFavoriteBadge'
      ]
    ]
  },
  // {
  //   source: 'ssh://git@stash.gdn-app.com:7999/oxford/pyeongyang-official.git herman/api-schema.json docs/api-schema.json',
  //   from: 'openapi_3',
  //   output: baseOutput('git-pyeongyang-official'),
  // }, 
  // {
  //   source: 'http://oxford.qa1-sg.cld/v2/api-docs',
  //   from: 'swagger_2',
  //   output: baseOutput('oxford'),
  //   urlMethodMapping: [['/backend/officialstore/stores', 'get', 'GetOfficialStoresList']],
  //   selectedOnly: true
  // },
  // {
  //   source:
  //     'http://siva-services.qa1-sg.cld/siva-services/api-docs/default/public-page-content-sections',
  //   from: 'swagger_1',
  //   output: baseOutput('siva/public-page-content-sections'),
  //   urlMethodMapping: [
  //     ['/backend/content/pages/{id}/sections', 'get', 'GetPageSections'],
  //     [
  //       '/backend/content/pages/{pageName}/sections/{sectionName}/blocks/{blockName}',
  //       'get',
  //       'GetBlock'
  //     ]
  //   ]
  // }
  // {
  //   source: 'http://pyeongyang-search.qa1-sg.cld/v2/api-docs',
  //   from: 'swagger_2',
  //   output: baseOutput('py-search'),
  //   urlMethodMapping: [
  //     ['/backend/search/infinite-recommendations', 'post', 'GetInfiniteRecommendations'],
  //     ['/backend/search/homepage-recommendation', 'get', 'GetHomepageRecommendation']
  //   ],
  //   selectedOnly: true,
  //   // voidUrlResponse: [
  //   //   ['/backend/search/infinite-recommendations', 'post', '200'],
  //   //   ['/backend/search/homepage-recommendation', 'get', '200']
  //   // ]
  // },
  // // {
  // //   source: 'http://official-store-analytics.qa1-sg.cld/docs/api ',
  // //   from: 'openapi_3',
  // //   output: baseOutput('official-store-analytics')
  // // }
]
