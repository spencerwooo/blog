<template>
  <div id="app">
    <header class="header">
      <div class="header__left">
        <Logo v-if="showLogo" />
      </div>

      <div class="header__right">
        <ToggleTheme />
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer__copyright">
        Copyright ©2019 - {{ new Date().getFullYear() }}.
      </div>
      <div class="footer__links">
        Runs on <font-awesome :icon="['fas', 'rocket']" />
        <a href="//gridsome.org">Gridsome</a> and
        <font-awesome :icon="['fas', 'heart']" />Love.
      </div>
      <div class="footer__links">
        Proudly deployed on <font-awesome :icon="['fas', 'gem']" /><a
          href="//www.netlify.com"
          >Netlify</a
        >. Subscribe!
      </div>
      <div id="rss-stats">
        <a href="https://blog.spencerwoo.com/posts/index.xml"
          ><img
            src="https://img.shields.io/badge/subscribe%20via-RSS-ffa500?logo=rss"
            alt=""
        /></a>
        <a
          href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"
          ><img
            src="https://img.shields.io/badge/dynamic/json?color=2bb24c&amp;label=subscribers&amp;query=%24.source.subscribers&amp;url=https%3A%2F%2Ffeedly.com%2Fv3%2Frecommendations%2Ffeeds%2Ffeed%252Fhttps%253A%252F%252Fblog.spencerwoo.com%252Fposts%252Findex.xml&amp;logo=feedly"
            alt=""
        /></a>
      </div>
    </footer>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import ToggleTheme from '~/components/ToggleTheme.vue'

export default {
  props: {
    showLogo: { default: true },
  },
  components: {
    Logo,
    ToggleTheme,
  },
}
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--header-height);
  padding: 0 calc(var(--space) / 2);
  top: 0;
  z-index: 10;

  &__left,
  &__right {
    display: flex;
    align-items: center;
    font-family: rubik, sans-serif;
  }

  @media screen and (min-width: 1300px) {
    //Make header sticky for large screens
    position: sticky;
    width: 100%;
  }
}

.main {
  margin: 0 auto;
  padding: 1.5vw 15px 0;
}

.footer {
  // max-width: var(--content-width);
  // margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--space)) 0;
  text-align: center;
  line-height: 2;
  font-size: 0.9em;
  font-family: rubik, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
    Arial, pingfang sc, noto sans cjk sc, sarasa gothic sc, microsoft yahei,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;

  > span {
    margin: 0 0.35em;
  }

  a {
    color: currentColor;
  }

  svg {
    margin-right: 0.2rem;
  }

  #rss-stats {
    padding-top: 0.35rem;

    a {
      margin-right: 0.35rem;
    }
  }
}
</style>
