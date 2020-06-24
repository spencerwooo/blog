// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const count = require('word-count')

module.exports = function(api) {
  api.loadSource(({ addCollection }) => {
    // Use the Data store API here: https://gridsome.org/docs/data-store-api/
  })

  api.onCreateNode(options => {
    if (options.internal.typeName === 'Post') {
      const postContent = options.content.replace(/<\/?[^>]+(>|$)/g, '')
      const wpm = 230

      const cjkWordCount = count(postContent)
      const cjkReadTime = Math.ceil(cjkWordCount / wpm)
      return {
        ...options,
        cjkWordCount,
        cjkReadTime,
      }
    }
  })

  api.createPages(async ({ graphql, createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api
    const { data } = await graphql(`
      {
        allPost {
          edges {
            previous {
              id
            }
            next {
              id
            }
            node {
              id
              path
            }
          }
        }
      }
    `)

    data.allPost.edges.forEach(element => {
      createPage({
        path: element.node.path,
        component: './src/templates/BlogPost.vue',
        context: {
          previousElement: element.previous ? element.previous.id : '##empty##',
          nextElement: element.next ? element.next.id : '##empty##',
          id: element.node.id,
        },
      })
    })
  })
}
