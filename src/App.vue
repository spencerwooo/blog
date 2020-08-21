<template>
  <div id="app">
    <div id="nprogress-container">
      <header class="header">
        <div class="header__left">
          <Logo v-if="showLogo" />
        </div>

        <div class="header__right">
          <ToggleTheme />
        </div>
      </header>
    </div>

    <main class="main">
      <!-- <slot /> -->
      <!-- Re-render components on each route to force route path change.
           See: https://github.com/gridsome/gridsome/issues/835 -->
      <router-view :key="$route.path" />
    </main>

    <footer class="footer">
      <div class="footer__copyright">
        Copyright ©2017 - {{ new Date().getFullYear() }}.
      </div>
      <div class="footer__links">
        Runs on <font-awesome :icon="['fas', 'rocket']" />
        <a href="//gridsome.org">Gridsome</a> and
        <font-awesome :icon="['fas', 'heart']" />Love. Deployed on
        <font-awesome :icon="['fas', 'caret-square-up']" /><a
          href="//vercel.com/spencerwoo/blog"
          >Vercel</a
        >.
      </div>
      <div class="footer__links"></div>
      <div class="footer__links">
        Subscriber statistics powered by
        <font-awesome :icon="['fas', 'rss']" /><a
          href="//api.spencerwoo.com/substats"
          >Substats</a
        >. DO SUBSCRIBE!
      </div>
      <div id="rss-stats">
        <a href="https://blog.spencerwoo.com/posts/index.xml"
          ><img
            src="https://img.shields.io/badge/Subscribe-RSS-ffa500?logo=rss"
            alt="rss"
        /></a>
        <a
          href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"
          ><img
            src="https://img.shields.io/badge/dynamic/json?label=Feedly&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml&labelColor=2bb24c&logoColor=white&color=282c34&logo=feedly&longCache=true"
            alt="feedly"
        /></a>
        <a
          href="https://www.inoreader.com/feed/https%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"
          ><img
            src="https://img.shields.io/badge/dynamic/json?label=Inoreader&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dinoreader%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml&color=282c34&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTM2IDBjMTkuODgyIDAgMzYgMTYuMTE4IDM2IDM2UzU1Ljg4MiA3MiAzNiA3MiAwIDU1Ljg4MiAwIDM2IDE2LjExOCAwIDM2IDB6bS03Ljk5IDMwLjk4QzIwLjgyNSAzMC45OCAxNSAzNi44MDQgMTUgNDMuOTkgMTUgNTEuMTc1IDIwLjgyNSA1NyAyOC4wMSA1N2M3LjE4MyAwIDEzLjAwOS01LjgyNSAxMy4wMDktMTMuMDExIDAtNy4xODUtNS44MjYtMTMuMDA5LTEzLjAwOS0xMy4wMDl6bTMuNjcgNS41NjVhMy43MjcgMy43MjcgMCAxMS0uMDA1IDcuNDU0IDMuNzI3IDMuNzI3IDAgMDEuMDA0LTcuNDU0em0tMy42Ny0xNC43NTh2NC42ODdjOS42NTYgMCAxNy41MTYgNy44NTggMTcuNTE2IDE3LjUxNWg0LjY4OWMwLTEyLjI0Mi05Ljk2MS0yMi4yMDItMjIuMjA1LTIyLjIwMnptMC05Ljc4N3Y0LjY4N2M3LjI5MiAwIDE0LjE0OCAyLjg0IDE5LjMwNiA3Ljk5OCA1LjE1OCA1LjE1NyA3Ljk5NSAxMi4wMTQgNy45OTUgMTkuMzA0SDYwYzAtOC41NDQtMy4zMjgtMTYuNTc3LTkuMzctMjIuNjJDNDQuNTg1IDE1LjMyNiAzNi41NTQgMTIgMjguMDEgMTJ6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=&labelColor=007bc7&longCache=true"
            alt="inoreader"
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
#app {
  scroll-behavior: smooth;
}

#nprogress-container {
  display: flex;
  align-items: center;
  min-height: var(--header-height);
  padding: 0 calc(var(--space) / 2);
  top: 0;
  background-color: rgba(255, 255, 255, 0.6);
  background-color: rgba($color: var(--bg-color-rgb), $alpha: 0.6);
  backdrop-filter: blur(32px);
  z-index: 10;

  @media screen and (min-width: 1300px) {
    // Make header sticky for large screens
    position: sticky;
    width: 100%;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  &__left,
  &__right {
    display: flex;
    align-items: center;
    font-family: var(--base-font-family);
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
  padding: var(--space) 15px var(--space);
  text-align: center;
  line-height: 1.8;
  font-size: 0.9em;
  font-family: var(--base-font-family);

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
