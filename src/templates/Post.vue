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
        <g-image alt="Cover image" v-if="$page.post.cover_image" :src="$page.post.cover_image" />
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
    PostTags
  },
  metaInfo () {
    return {
      title: this.$page.post.title,
      meta: [
        {
          name: 'description',
          content: this.$page.post.description
        }
      ]
    }
  }
}
</script>

<page-query>
query Post ($id: ID!) {
  post: post (id: $id) {
    title
    path
    date (format: "D. MMMM YYYY")
    timeToRead
    tags {
      id
      title
      path
    }
    description
    content
    cover_image (width: 860, blur: 10)
  }
}
</page-query>

<style lang="scss">
.post-title {
  padding: calc(var(--space) / 2) 0 calc(var(--space) / 2);
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
      line-height: 2;
    }

    img {
      width: calc(100% + var(--space) * 2);
      // margin-left: calc(var(--space) * -1);
      display: block;
      // max-width: none;
    }
  }
}

.post-comments {
  padding: calc(var(--space) / 2);
  max-width: var(--content-width);
  margin: 0 auto;
  font-family: rubik, sans-serif;

  .vssue {
    a {
      color: var(--link-color);
      font-family: rubik, sans-serif;
    }
    .vssue-new-comment-body textarea,
    .vssue-new-comment-footer{
      font-family: rubik, sans-serif !important;
    }
    .vssue-new-comment .vssue-new-comment-input {
      background-color: #f8f8f5 !important;
    }
    .vssue-comments .vssue-comment .vssue-comment-footer .vssue-comment-reactions .vssue-comment-reaction,
    .vssue-comments .vssue-comment .vssue-comment-footer .vssue-comment-operations {
      color: var(--link-color) !important;
    }
    .vssue-button {
      color: var(--link-color) !important;
      border: 2px solid var(--link-color) !important;
      font-weight: normal;
      font-family: rubik, sans-serif;
    }
    .vssue-pagination .vssue-pagination-select {
      border: var(--link-color) !important;
    }
  }

  &:empty {
    display: none;
  }
}

.post-author {
  margin-top: calc(var(--space) / 2);
}
</style>
