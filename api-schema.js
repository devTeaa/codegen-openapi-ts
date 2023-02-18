const data = {
  "openapi": "3.0.1",
  "info": {
    "title": "PY Official",
    "version": "0.17.1-1"
  },
  "servers": [
    {
      "url": "http://pyeongyang-official.qa1-sg.cld",
      "description": "Generated server url"
    }
  ],
  "paths": {
    "/backend/scheduler/reset-subscription-status": {
      "post": {
        "tags": [
          "scheduler-controller"
        ],
        "operationId": "resetSubscriptionStatus",
        "parameters": [
          {
            "name": "storeId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.lang.Boolean"
                }
              }
            }
          }
        }
      }
    },
    "/backend/publish/merchant-favorites": {
      "post": {
        "tags": [
          "publish-controller"
        ],
        "operationId": "merchantFavorites",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.lang.Boolean"
                }
              }
            }
          }
        }
      }
    },
    "/backend/official/merchant-favorites/{merchantId}/_follow": {
      "post": {
        "tags": [
          "merchant-favorite-controller"
        ],
        "operationId": "save",
        "parameters": [
          {
            "name": "merchantId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.lang.Boolean"
                }
              }
            }
          }
        }
      }
    },
    "/backend/official/broadcast-chats/{merchantId}/_unsubscribe": {
      "post": {
        "tags": [
          "broadcast-chat-controller"
        ],
        "operationId": "unsubscribe",
        "parameters": [
          {
            "name": "merchantId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/com.gdn.pyeongyang.official.web.model.request.broadcastchat.UnsubscribeBroadcastChatWebRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseCom.gdn.pyeongyang.official.web.model.response.broadcastchat.UnsubscribeBroadcastChatWebResponse"
                }
              }
            }
          }
        }
      }
    },
    "/backend/official/broadcast-chats/{merchantId}/_subscribe": {
      "post": {
        "tags": [
          "broadcast-chat-controller"
        ],
        "operationId": "subscribe",
        "parameters": [
          {
            "name": "merchantId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.lang.Boolean"
                }
              }
            }
          }
        }
      }
    },
    "/backend/index/moengage-users": {
      "post": {
        "tags": [
          "index-controller"
        ],
        "operationId": "moengageUsers",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.lang.Boolean"
                }
              }
            }
          }
        }
      }
    },
    "/backend/index/members": {
      "post": {
        "tags": [
          "index-controller"
        ],
        "operationId": "members",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.lang.Boolean"
                }
              }
            }
          }
        }
      }
    },
    "/backend/official/merchant-favorites/{merchantId}": {
      "get": {
        "tags": [
          "merchant-favorite-controller"
        ],
        "operationId": "getDetail",
        "parameters": [
          {
            "name": "merchantId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseCom.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetMerchantFavoriteWebResponse"
                }
              }
            }
          }
        }
      }
    },
    "/backend/official/merchant-favorites/_detail": {
      "get": {
        "tags": [
          "merchant-favorite-controller"
        ],
        "operationId": "getDetail_1",
        "parameters": [
          {
            "name": "merchantId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.util.ListCom.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetMerchantFavoriteWebResponse"
                }
              }
            }
          }
        }
      }
    },
    "/backend/official/merchant-favorites": {
      "get": {
        "tags": [
          "merchant-favorite-controller"
        ],
        "operationId": "getList",
        "parameters": [
          {
            "name": "scrollableRequest",
            "in": "query",
            "required": true,
            "schema": {
              "$ref": "#/components/schemas/com.gdn.pyeongyang.official.common.model.web.request.ScrollableRequest"
            }
          },
          {
            "name": "merchantName",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "official",
            "in": "query",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.util.ListCom.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetListMerchantFavoritesWebResponse"
                }
              }
            }
          }
        }
      }
    },
    "/backend/official/merchant-favorites/{merchantId}/_unfollow": {
      "delete": {
        "tags": [
          "merchant-favorite-controller"
        ],
        "operationId": "delete",
        "parameters": [
          {
            "name": "merchantId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/com.blibli.oss.common.response.ResponseJava.lang.Boolean"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "com.blibli.oss.common.paging.Paging": {
        "type": "object",
        "properties": {
          "page": {
            "type": "integer",
            "format": "int32"
          },
          "total_page": {
            "type": "integer",
            "format": "int32"
          },
          "item_per_page": {
            "type": "integer",
            "format": "int32"
          },
          "total_item": {
            "type": "integer",
            "format": "int32"
          },
          "sort_by": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/com.blibli.oss.common.paging.SortBy"
            }
          }
        }
      },
      "com.blibli.oss.common.paging.SortBy": {
        "type": "object",
        "properties": {
          "propertyName": {
            "type": "string"
          },
          "direction": {
            "type": "string"
          }
        }
      },
      "com.blibli.oss.common.response.ResponseJava.lang.Boolean": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "status": {
            "type": "string"
          },
          "data": {
            "type": "boolean"
          },
          "paging": {
            "$ref": "#/components/schemas/com.blibli.oss.common.paging.Paging"
          },
          "errors": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "com.gdn.pyeongyang.official.web.model.request.broadcastchat.UnsubscribeBroadcastChatWebRequest": {
        "type": "object",
        "properties": {
          "reason": {
            "type": "string"
          }
        }
      },
      "com.blibli.oss.common.response.ResponseCom.gdn.pyeongyang.official.web.model.response.broadcastchat.UnsubscribeBroadcastChatWebResponse": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "status": {
            "type": "string"
          },
          "data": {
            "$ref": "#/components/schemas/com.gdn.pyeongyang.official.web.model.response.broadcastchat.UnsubscribeBroadcastChatWebResponse"
          },
          "paging": {
            "$ref": "#/components/schemas/com.blibli.oss.common.paging.Paging"
          },
          "errors": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "com.gdn.pyeongyang.official.web.model.response.broadcastchat.UnsubscribeBroadcastChatWebResponse": {
        "type": "object",
        "properties": {
          "resubscribeDate": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "com.blibli.oss.common.response.ResponseCom.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetMerchantFavoriteWebResponse": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "status": {
            "type": "string"
          },
          "data": {
            "$ref": "#/components/schemas/com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetMerchantFavoriteWebResponse"
          },
          "paging": {
            "$ref": "#/components/schemas/com.blibli.oss.common.paging.Paging"
          },
          "errors": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetMerchantFavoriteWebResponse": {
        "type": "object",
        "properties": {
          "broadcastChatSubscription": {
            "type": "boolean"
          },
          "followed": {
            "type": "boolean"
          },
          "id": {
            "type": "string"
          },
          "totalFollowers": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "com.blibli.oss.common.response.ResponseJava.util.ListCom.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetMerchantFavoriteWebResponse": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "status": {
            "type": "string"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetMerchantFavoriteWebResponse"
            }
          },
          "paging": {
            "$ref": "#/components/schemas/com.blibli.oss.common.paging.Paging"
          },
          "errors": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "com.gdn.pyeongyang.official.common.model.web.request.ScrollableRequest": {
        "type": "object",
        "properties": {
          "itemPerPage": {
            "maximum": 10,
            "type": "integer",
            "format": "int32"
          },
          "token": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "com.blibli.oss.common.response.ResponseJava.util.ListCom.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetListMerchantFavoritesWebResponse": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "status": {
            "type": "string"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetListMerchantFavoritesWebResponse"
            }
          },
          "paging": {
            "$ref": "#/components/schemas/com.blibli.oss.common.paging.Paging"
          },
          "errors": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetListMerchantFavoritesWebResponse": {
        "type": "object",
        "properties": {
          "badge": {
            "$ref": "#/components/schemas/com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetListMerchantFavoritesWebResponse$Badge"
          },
          "followedDate": {
            "type": "string",
            "format": "date-time"
          },
          "id": {
            "type": "string"
          },
          "logoUrl": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "official": {
            "type": "boolean"
          },
          "pageUrl": {
            "type": "string"
          },
          "rating": {
            "type": "integer",
            "format": "int32"
          },
          "totalFollowers": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "com.gdn.pyeongyang.official.web.model.response.merchantfavorite.GetListMerchantFavoritesWebResponse$Badge": {
        "type": "object",
        "properties": {
          "imageUrl": {
            "type": "string"
          },
          "name": {
            "type": "string"
          }
        }
      }
    }
  }
}
