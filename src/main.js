// Import main css
import '~/assets/style/index.scss'

// Import default layout so we don't need to import it to every page
import DefaultLayout from '~/layouts/Default.vue'

// Import vssue
import Vssue from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import 'vssue/dist/vssue.css'

import { Pager } from 'gridsome'

// The Client API can be used here. Learn more: gridsome.org/docs/client-api
export default function (Vue, { router, head, isClient }) {

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
  Vue.component('Pager', Pager)
  Vue.use(Vssue, {
    api: GithubV3,
    owner: 'spencerwooo',
    repo: 'comments',
    clientId: 'fd641fd7507d903acbfc',
    clientSecret: 'da7d0476d848a139a787a286df419e7bf7c334a5',
  })
}
