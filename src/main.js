// Import main css
import '~/assets/style/index.scss'

// × Import default layout so we don't need to import it to every page
// ! Use default App.vue to force reload each component on new blog page, or else $route.path
// ! will not reflect correctly. See: https://github.com/gridsome/gridsome/issues/835
// import DefaultLayout from '~/layouts/Default.vue'

// Import vssue
import Vssue from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import 'vssue/dist/vssue.css'

// Pagination
import { Pager } from 'gridsome'

// Icons by font awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faHome,
  faRss,
  faIdBadge,
  faRocket,
  faHeart,
  faCaretSquareUp,
  faArrowUp,
  faCommentDots
} from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faTwitter,
  faMedium,
  faWeibo,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
library.add(
  faGithub,
  faTwitter,
  faHome,
  faRss,
  faIdBadge,
  faMedium,
  faWeibo,
  faTelegram,
  faRocket,
  faHeart,
  faCaretSquareUp,
  faArrowUp,
  faCommentDots
)

// notifications
import Notifications from 'vue-notification/dist/ssr'
import '~/assets/style/notification.scss'

// back to top
import VueScrollTo from 'vue-scrollto'

// NProgress
import NProgress from 'nprogress'
import '~/assets/style/nprogress.scss'

// container
import '~/assets/style/container.scss'

// katex
import 'katex/dist/katex.min.css'

// The Client API can be used here. Learn more: gridsome.org/docs/client-api
export default function (Vue, { router, head, isClient }) {
  NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

  // Set default layout as a global component
  // Vue.component('Layout', DefaultLayout)
  Vue.component('Pager', Pager)
  Vue.component('font-awesome', FontAwesomeIcon)

  // back to top
  Vue.use(VueScrollTo, {
    container: 'body',
    duration: 1000,
    easing: 'ease-in-out',
    offset: 0,
    force: true,
    cancelable: true,
    x: false,
    y: true,
  })

  // notifications
  Vue.use(Notifications)

  Vue.use(Vssue, {
    api: GithubV3,
    owner: 'spencerwooo',
    repo: 'comments',
    clientId: 'fd641fd7507d903acbfc',
    clientSecret: 'da7d0476d848a139a787a286df419e7bf7c334a5',
  })

  router.beforeEach((to, from, next) => {
    if (from.name !== null) {
      NProgress.start()
    }
    next()
  })
  router.afterEach((to, from) => {
    NProgress.done()
  })
}
