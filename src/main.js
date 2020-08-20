// Import main css
import '~/assets/style/index.scss'

// × Import default layout so we don't need to import it to every page
// ! Use default App.vue to force reload each component on new blog page, or else $route.path
// ! will not reflect correctly. See: https://github.com/gridsome/gridsome/issues/835
// import DefaultLayout from '~/layouts/Default.vue'

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
  faCommentDots,
  faArchive,
  faSpinner,
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
  faCommentDots,
  faArchive,
  faSpinner
)

// back to top
import VueScrollTo from 'vue-scrollto'

// HTTP API
import axios from 'axios'

// NProgress
import NProgress from 'nprogress'

// katex
import 'katex/dist/katex.min.css'

// The Client API can be used here. Learn more: gridsome.org/docs/client-api
export default function(Vue, { router, head, isClient }) {
  NProgress.configure({
    easing: 'ease',
    speed: 500,
    showSpinner: false,
    parent: '#nprogress-container',
  })

  // Set default layout as a global component
  // Vue.component('Layout', DefaultLayout)
  Vue.component('Pager', Pager)
  Vue.component('font-awesome', FontAwesomeIcon)

  Vue.prototype.$http = axios

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

  router.beforeEach((to, from, next) => {
    if (from.name !== null) {
      NProgress.set(0.1)
    }
    next()
  })
  router.afterEach((to, from) => {
    NProgress.done()
  })
}
