<template>
  <div>
    <div class="post-title">
      <h1 class="post-title__text">
        {{ $page.post.title }}
        <span class="post-title__publish-icon" v-if="!$page.post.published"
          >DRAFT</span
        >
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

      <div class="admonition admonition-warning" v-if="publishedDays >= 180">
        <p style="margin-bottom: 0;">
          🌶 <strong>过期警告：</strong> 本页面距今已有
          {{ publishedDays }}
          天未更新，年久失修，内容可能有所偏颇，还请仔细甄别！
        </p>
      </div>

      <div class="post__content" v-html="$page.post.content" />

      <div class="post__footer">
        <PostTags :post="$page.post" />
      </div>

      <div class="post__navigation">
        <a
          class="navlink"
          v-if="$page.previous"
          :href="$page.previous.path"
          style="float: left;"
          >&#9664; {{ $page.previous.title }}</a
        >
        <a
          class="navlink"
          v-if="$page.next"
          :href="$page.next.path"
          style="float: right;"
          >{{ $page.next.title }} &#9654;</a
        >
      </div>
    </div>

    <div class="post-comments">
      <div id="disqus_thread" />
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
  </div>
</template>

<script>
import PostMeta from '~/components/PostMeta'
import PostTags from '~/components/PostTags'
import Author from '~/components/Author.vue'
import DisqusJS from 'disqusjs'

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
      publishedDays: 0,
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
  mounted() {
    // Add post outdated notification banner
    const today = new Date()
    const publishTime = new Date(this.$page.post.date)
    const publishedDays = Math.ceil(
      (today - publishTime) / (1000 * 60 * 60 * 24)
    )
    this.publishedDays = publishedDays

    // Initialize post comment by DisqusJS
    if (process.env.NODE_ENV === 'production') {
      const disqusjs = new DisqusJS({
        shortname: 'spencerwoo',
        siteName: "Spencer's Blog",
        identifier: this.$page.post.path,
        apikey:
          'F6hHeFWtfmWW5n4RVf4hjgazRj8y0ERfQdeQPIGKr79yajw6glnmTqrgYHTC8XaS',
        admin: 'spencerwoo',
        adminLabel: 'Admin',
      })
    }
  },
}
</script>

<page-query>
query Post ($id: ID!, $previousElement: ID!, $nextElement: ID!) {
  post: post (id: $id) {
    title
    path
    date (format: "MMMM D. YYYY")
    timeToRead
    cjkWordCount
    cjkReadTime
    tags {
      id
      title
      path
    }
    description
    published
    content
    cover_image (width: 1280, blur: 10)
  }

  previous: post (id: $previousElement) {
    title
    path
  }

  next: post(id: $nextElement) {
    title
    path
  }
}
</page-query>

<style lang="scss">
.post-title {
  padding: var(--space) 0 var(--space);
  text-align: center;

  &__publish-icon {
    vertical-align: top;
    background-color: #f7b955;
    display: inline-block;
    font-size: 14px;
    height: 18px;
    line-height: 18px;
    border-radius: 3px;
    padding: 0 6px;
    color: #fff;
  }
}

.post-meta {
  font-family: var(--base-font-family);
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

    // p:first-of-type {
    //   // font-size: 1.2em;
    //   color: var(--title-color);
    // }

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

  &__navigation {
    border-top: 1px solid var(--border-color);
    margin-top: calc(var(--space) / 2);
    padding: calc(var(--space) / 2) 0 0 0;
    overflow: auto;

    .navlink {
      border: none;
      text-decoration: none;

      &:first-of-type {
        margin-bottom: calc(var(--space) / 4);
      }
    }
  }
}

.footnotes {
  p {
    display: inline;
  }
  hr {
    padding: calc(var(--space) / 2) 0 0 0;
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 0 0;
  }
  .footnote-backref {
    display: inline;
  }
}

.post-comments {
  font-family: var(--base-font-family);
  padding: calc(var(--space) / 2);
  max-width: var(--content-width);
  margin: 0 auto;
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
