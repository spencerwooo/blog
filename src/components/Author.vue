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
      开发者 / 设计师 / 少数派 / 学生
    </p>

    <p class="author__links">
      <g-link to="/"><font-awesome :icon="['fas', 'home']"/></g-link>
      <a href="//spencerwoo.com"><font-awesome :icon="['fas', 'id-badge']"/></a>
      <a href="//medium.com/spencerweekly"
        ><font-awesome :icon="['fab', 'medium']"
      /></a>
      <a href="//twitter.com/realSpencerWoo"
        ><font-awesome :icon="['fab', 'twitter']"
      /></a>
      <a href="//github.com/spencerwooo"
        ><font-awesome :icon="['fab', 'github']"
      /></a>
      <a href="//blog.spencerwoo.com/posts/index.xml"
        ><font-awesome :icon="['fas', 'rss']"
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
    a {
      margin: 0 0.5em;
    }
  }
}
</style>
