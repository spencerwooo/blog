<template>
  <div class="author">
    <g-image
      alt="Author image"
      class="author__image"
      src="~/assets/images/author.jpg"
      width="180"
      height="180"
      blur="5"
    />

    <h1 v-if="showTitle" class="author__site-title">
      {{ $static.metadata.siteName }}
    </h1>

    <p class="author__intro">
      阿巴阿巴 o((>ω< ))o
    </p>

    <p class="author__links">
      <!-- <g-link to="/"><font-awesome :icon="['fas', 'home']"/></g-link> -->
      <a href="//spencerwoo.com" target="_blank"
        ><font-awesome :icon="['fas', 'id-badge']"
      /></a>
      <a
        href="//blog.spencerwoo.com/posts/index.xml"
        target="_blank"
        style="color: #F5A623;"
        ><font-awesome :icon="['fas', 'rss']"/></a
      ><g-link to="/friends" style="color: #06a878;"
        ><font-awesome :icon="['fas', 'comment-dots']"/></g-link
      >/
      <a
        href="//medium.com/spencerweekly"
        target="_blank"
        style="color: var(--title-color);"
        ><font-awesome :icon="['fab', 'medium']"
      /></a>
      <a
        href="//twitter.com/realSpencerWoo"
        target="_blank"
        style="color: #1da1f2;"
        ><font-awesome :icon="['fab', 'twitter']"
      /></a>
      <a href="//weibo.com/spencerwoo" target="_blank" style="color: #E00;"
        ><font-awesome :icon="['fab', 'weibo']"
      /></a>
      <a href="//t.me/realSpencerWoo" target="_blank" style="color: #179cde;"
        ><font-awesome :icon="['fab', 'telegram']"
      /></a>
      <a
        href="//github.com/spencerwooo"
        target="_blank"
        style="color: var(--title-color);"
        ><font-awesome :icon="['fab', 'github']"
      /></a>
    </p>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
export default {
  props: ['showTitle'],
}
</script>

<style lang="scss">
.author {
  margin: 0 auto;
  max-width: 500px;
  text-align: center;
  padding: calc(var(--space) / 2) 0;

  &__image {
    border-radius: 100%;
    width: 90px;
    height: 90px;
    margin-bottom: 1em;
  }

  &__intro {
    opacity: 0.8;
  }

  &__site-title {
    font-size: 1.5em;
  }

  &__links {
    margin-top: -0.5em;
    font-size: 1em;
    a {
      color: var(--link-color);
      margin: 0 0.5em;
    }
  }
}
</style>
