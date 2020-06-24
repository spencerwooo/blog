<template>
  <div class="post-meta">
    Posted {{ post.date }}.
    <template v-if="post.cjkWordCount">
      {{ post.cjkWordCount }} words.
      <strong
        >{{ post.cjkReadTime }} min read.
        <font-awesome :icon="['fa', 'spinner']" pulse v-if="loading" />
        <span v-else>{{ hitCount }}</span> views.</strong
      >
    </template>
  </div>
</template>

<script>
export default {
  props: ['post'],
  data() {
    return {
      loading: true,
      hitCount: '0',
    }
  },
  mounted() {
    // Fetch page hit count via API: https://spencer-hit-count.vercel.app/api/ga
    const baseUrl = 'https://spencer-hit-count.vercel.app/api/ga'
    this.$http.get(`${baseUrl}?page=${this.post.path}`).then(res => {
      if (res.data.length === 1) {
        this.hitCount = res.data[0].hit
        this.loading = false
      }
    })
  },
}
</script>

<style lang="scss">
.post-meta {
  font-size: 0.8em;
  opacity: 0.8;
}
</style>
