// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const marked = require('marked')

module.exports = {
  siteUrl: 'https://blog.spencerwoo.com',
  siteName: 'Spencer\'s Blog',
  siteDescription: '开发者 / 设计师 / 少数派 / 学生',

  templates: {
    Post: '/:year/:month/:slug',
    Tag: '/tag/:id'
  },

  plugins: [
    {
      // Create posts from markdown files
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Post',
        path: 'content/posts/*.md',
        refs: {
          // Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
          tags: {
            typeName: 'Tag',
            create: true
          }
        }
      }
    },
    {
      use: 'gridsome-plugin-feed',
      options: {
        contentTypes: ['Post'],
        feedOptions: {
          title: 'Spencer\'s Blog',
          description: 'Spencer Woo - 开发者 / 设计师 / 少数派 / 学生'
        },
        rss: {
          enabled: true,
          output: '/posts/index.xml'
        },
        htmlFields: ['description', 'content'],
        enforceTrailingSlashes: false,
        filterNodes: (node) => true,
        nodeToFeedItem: (node) => ({
          title: node.title,
          date: node.date || node.fields.date,
          content: marked(node.content)
        })
      }
    },
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-111664763-2'
      }
    }
  ],

  transformers: {
    //Add markdown support to all file-system sources
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      anchorClassName: 'icon icon-link',
      plugins: [
        'remark-autolink-headings',
        '@gridsome/remark-prismjs'
      ],
      config: {
        footnotes: true
      }
    }
  }
}
