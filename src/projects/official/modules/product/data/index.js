module.exports = {
  type: 'object',
  properties: {
    ad_list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          img: {
            type: 'string',
            enum: ['/images/service-p2.jpg', '/images/service-p3.jpg']
          },
          url: {
            type: 'string',
            format: 'uri'
          }
        }
      },
      minItems: 2,
      maxItems: 2
    },
    link_target: {
      type: 'string',
      enum: ['_blank']
    }
  }
}