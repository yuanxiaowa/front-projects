module.exports = {
  type: 'object',
  properties: {
    instructions_info: {
      type: 'object',
      properties: {
        file_url: {
          type: 'string'
        },
        title: {
          type: 'string'
        }
      }
    },
    bread_crumbs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          url: {
            type: 'string'
          },
          content: {
            type: 'string'
          }
        }
      }
    },
    product_info: {
      type: 'object',
      properties: {
        goods_id: {
          type: 'number',
          minimum: 1
        },
        id: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        product_id: {
          type: 'number',
          minimum: 1
        }
      }
    }
  }
}