<template>
  <div :show-logo="false">
    <!-- Author intro -->
    <Author :show-title="true" />

    <!-- List posts -->
    <div class="posts">
      <PostCard
        v-for="edge in $page.posts.edges"
        :key="edge.node.id"
        :post="edge.node"
      />
    </div>

    <!-- Pagination -->
    <Pager :info="$page.posts.pageInfo" />
  </div>
</template>

<page-query>
query ($page: Int) {
  posts: allPost(filter: { published: { eq: true }}, perPage: 8, page: $page) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        date (format: "MMMM D. YYYY")
        timeToRead
        cjkWordCount
        cjkReadTime
        description
        cover_image (width: 1280, height: 400, blur: 10)
        path
        tags {
          id
          title
          path
        }
      }
    }
  }
}
</page-query>

<script>
import Author from '~/components/Author.vue'
import PostCard from '~/components/PostCard.vue'

export default {
  components: {
    Author,
    PostCard,
  },
  metaInfo: {
    title: 'Spencer Woo',
  },
}
</script>

<style lang="scss">
nav {
  max-width: var(--content-width);
  margin: 0 auto;
  text-align: center;

  a {
    margin: 0 10px;
    padding: 3px 10px;
    border: 2px var(--link-color);
    border-style: dashed;
  }
}
</style>
