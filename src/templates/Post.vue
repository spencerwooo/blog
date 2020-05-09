<template>
  <Layout>
    <div class="post-title">
      <h1 class="post-title__text">
        {{ $page.post.title }}
      </h1>

      <PostMeta :post="$page.post" />
    </div>

    <div class="post content-box">
      <div class="post__header">
        <g-image
          alt="Cover image"
          v-if="$page.post.cover_image"
          :src="$page.post.cover_image"
        />
      </div>

      <div class="post__content" v-html="$page.post.content" />

      <div class="post__footer">
        <PostTags :post="$page.post" />
      </div>
    </div>

    <div class="post-comments">
      <!-- Add comment widgets here -->
      <Vssue />
    </div>

    <transition name="fade">
      <div
        id="back-to-top"
        v-scroll-to="{ el: '#app' }"
        v-if="scrolledDist > 800"
      >
        <font-awesome id="back-to-top-icon" :icon="['fas', 'arrow-up']" />
      </div>
    </transition>

    <Author class="post-author" />
  </Layout>
</template>

<script>
import PostMeta from '~/components/PostMeta'
import PostTags from '~/components/PostTags'
import Author from '~/components/Author.vue'

export default {
  components: {
    Author,
    PostMeta,
    PostTags,
  },
  metaInfo() {
    return {
      title: this.$page.post.title,
      meta: [
        {
          name: 'description',
          content: this.$page.post.description,
        },
      ],
    }
  },
  data() {
    return {
      scrolledDist: 0,
    }
  },
  methods: {
    handleScroll() {
      if (process.isClient) {
        this.scrolledDist = window.scrollY
      }
    },
  },
  created() {
    if (process.isClient) {
      window.addEventListener('scroll', this.handleScroll)
    }
  },
  destroyed() {
    if (process.isClient) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
}
</script>

<page-query>
query Post ($id: ID!) {
  post: post (id: $id) {
    title
    path
    date (format: "MMMM D. YYYY")
    timeToRead
    tags {
      id
      title
      path
    }
    description
    content
    cover_image (width: 1280, blur: 10)
  }
}
</page-query>

<style lang="scss">
.post-title {
  padding: var(--space) 0 var(--space);
  text-align: center;
}

.post-meta {
  font-family: rubik, sans-serif;
}

.post {
  &__header {
    width: calc(100% + var(--space) * 2);
    margin-left: calc(var(--space) * -1);
    margin-top: calc(var(--space) * -1);
    margin-bottom: calc(var(--space) / 2);
    overflow: hidden;
    border-radius: var(--radius) var(--radius) 0 0;

    img {
      width: 100%;
    }

    &:empty {
      display: none;
    }
  }

  &__content {
    h2:first-child {
      margin-top: 0;
    }

    p:first-of-type {
      // font-size: 1.2em;
      color: var(--title-color);
    }

    p {
      line-height: 1.8;
    }

    img {
      // width: calc(100% + var(--space) * 2);
      // margin-left: calc(var(--space) * -1);
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
  }
}

.footnotes {
  p {
    display: inline;
  }
  .footnote-backref {
    display: inline;
  }
}

.post-comments {
  padding: calc(var(--space) / 2);
  max-width: var(--content-width);
  margin: 0 auto;
  font-family: rubik, sans-serif;

  .vssue {
    color: var(--body-color) !important;
    a {
      color: var(--link-color);
      font-family: rubik, sans-serif;
    }
    .vssue-new-comment-body textarea,
    .vssue-new-comment-footer {
      font-family: rubik, sans-serif !important;
    }
    .vssue-new-comment .vssue-new-comment-input {
      background-color: var(--bg-content-color) !important;

      &:focus {
        border-color: var(--link-color) !important;
        box-shadow: 0 0 1px 1px var(--link-color) !important;
      }
    }
    .markdown-body,
    .vssue-header-powered-by {
      color: var(--body-color) !important;
    }
    .vssue-comments
      .vssue-comment
      .vssue-comment-footer
      .vssue-comment-reactions
      .vssue-comment-reaction,
    .vssue-comments
      .vssue-comment
      .vssue-comment-footer
      .vssue-comment-operations,
    .vssue-status,
    .vssue-notice .vssue-progress {
      color: var(--link-color) !important;
    }
    .vssue-icon {
      fill: var(--link-color) !important;
    }
    .vssue-button {
      color: var(--link-color) !important;
      border: 2px solid var(--link-color) !important;
      border-radius: 5px;
      font-weight: normal;
      font-family: rubik, sans-serif;
    }
    .vssue-pagination .vssue-pagination-select {
      color: var(--body-color) !important;
      border: 1px dashed var(--link-color) !important;

      ::after {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--link-color) !important;
        content: '';
        position: absolute;
        top: 40%;
        right: 5px;
        content: '';
        z-index: 98;
      }
    }
  }

  &:empty {
    display: none;
  }
}

.post-author {
  margin-top: calc(var(--space) / 2);
}

#back-to-top {
  position: fixed;
  bottom: 40px;
  right: 30px;
  z-index: 100;
  cursor: pointer;
}

#back-to-top-icon {
  font-size: 1.1em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
