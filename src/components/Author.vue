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
      <!-- eslint-disable-next-line -->
      阿巴阿巴 o((>ω< ))o
    </p>

    <p class="author__links">
      <g-link
        href="//spencerwoo.com"
        target="_blank"
        v-tooltip="{ content: '🚀 Portfolio' }"
        ><font-awesome :icon="['fas', 'id-badge']"
      /></g-link>
      <g-link
        href="/feed.xml"
        target="_blank"
        style="color: #F5A623;"
        v-tooltip="{ content: '📫 RSS' }"
        ><font-awesome :icon="['fas', 'rss']"
      /></g-link>
      <g-link
        to="/archives"
        style="color: var(--title-color);"
        v-tooltip="{ content: '📂 Archives' }"
        ><font-awesome :icon="['fas', 'archive']"/></g-link
      ><g-link
        to="/friends"
        style="color: #06a878;"
        v-tooltip="{ content: '🧑🏿‍🚒 Friends' }"
        ><font-awesome :icon="['fas', 'comment-dots']"/></g-link
      >/
      <a
        href="//twitter.com/realSpencerWoo"
        target="_blank"
        style="color: #1da1f2;"
        v-tooltip="{ content: '🔗 @realSpencerWoo' }"
        ><font-awesome :icon="['fab', 'twitter']"
      /></a>
      <a
        href="//weibo.com/spencerwoo"
        target="_blank"
        style="color: #E00;"
        v-tooltip="{ content: '🔗 @spencerwoo' }"
        ><font-awesome :icon="['fab', 'weibo']"
      /></a>
      <a
        href="//t.me/realSpencerWoo"
        target="_blank"
        style="color: #179cde;"
        v-tooltip="{ content: '🔗 @realSpencerWoo' }"
        ><font-awesome :icon="['fab', 'telegram']"
      /></a>
      <a
        href="//github.com/spencerwooo"
        target="_blank"
        style="color: var(--title-color);"
        v-tooltip="{ content: '🔗 @spencerwooo' }"
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

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: var(--bg-content-color);
    border-radius: var(--radius);
    padding: 0.2em 0.8em 0.2em;
    box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.02),
      1px 1px 15px 0 rgba(0, 0, 0, 0.03);
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 2em;
    border-color: var(--bg-content-color);
    z-index: 1;
  }

  &[x-placement^='top'] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='bottom'] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='right'] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^='left'] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}
</style>
