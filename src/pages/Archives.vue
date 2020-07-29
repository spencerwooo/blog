<template>
  <div :show-logo="false">
    <h1 class="text-center space-bottom">Archives</h1>

    <div class="posts content-box">
      <p style="opacity: 0.6;">
        <strong
          >(｡･∀･)ﾉﾞ I have published a total of {{ totalPosts }} posts,
          {{ totalWords }} words since 2019.</strong
        >
      </p>

      <div v-for="year in backwardsTimeKey" :key="year">
        <h5>{{ year }}</h5>
        <p v-for="p in timeline[year]" :key="p.id">
          <span>{{
            new Date(p.date)
              .toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
              })
              .replace(' ', '.')
          }}</span
          ><g-link :to="p.path">{{ p.title }}</g-link>
        </p>
      </div>
    </div>
  </div>
</template>

<page-query>
query {
  posts: allPost(filter: { published: { eq: true }}) {
    edges {
      node {
        id
        title
        date
        cjkWordCount
        path
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: 'Archives',
  },
  data() {
    return {
      timeline: {},
      backwardsTimeKey: [],
      totalPosts: 0,
      totalWords: 0,
    }
  },
  methods: {
    // Covert actual number to `xx.x k` expression, see: https://url.cn/JobLixKT
    kFormatter: num => {
      return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
        : Math.sign(num) * Math.abs(num)
    },
  },
  mounted() {
    this.totalPosts = this.$page.posts.edges.length

    const timeline = {}
    this.$page.posts.edges.forEach(post => {
      this.totalWords += post.node.cjkWordCount

      // Render timeline views
      const postYear = new Date(post.node.date).getFullYear()
      if (!(postYear in timeline)) {
        timeline[postYear] = []
      }
      timeline[postYear].push(post.node)
    })
    this.timeline = timeline
    this.backwardsTimeKey = Object.keys(timeline)
      .sort()
      .reverse()

    this.totalWords = this.kFormatter(this.totalWords)
  },
}
</script>

<style lang="scss">
.posts {
  p span {
    font-size: 0.85rem;
    font-family: var(--monospace-font-family);

    &::after {
      content: ' ';
    }
  }
}
</style>
