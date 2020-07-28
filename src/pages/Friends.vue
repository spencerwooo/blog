<template>
  <div>
    <h1 class="friends-title text-center space-bottom">Friends & Guestbook</h1>

    <div class="friends-container text-center space-bottom">
      <a
        class="btn"
        v-for="friend in friends"
        :key="friend.id"
        :href="friend.link"
        target="_blank"
        :style="friend.style"
        ><g-image class="avatar" alt="avatar" :src="friend.avatar" blur="5" />
        <span>{{ friend.id }}</span></a
      >
      <p class="note">
        * I don't accept friend link requests from someone I don't know.
      </p>
    </div>

    <div class="post-comments">
      <div id="disqus_thread" />
    </div>
  </div>
</template>

<script>
import DisqusJS from 'disqusjs'

export default {
  metaInfo: {
    title: 'Friends',
  },
  data() {
    return {
      friends: [
        {
          id: '@Felinae',
          link: 'https://code.felinae98.cn/',
          avatar: 'https://avatars3.githubusercontent.com/u/23295345?s=160',
          style: 'color: #fff; background-color: #473922',
        },
        {
          id: '@agnoCJY',
          link: 'https://jychuuu.com/',
          avatar: 'https://avatars1.githubusercontent.com/u/46088026?s=160',
          style: 'color: #fff; background-color: #191919',
        },
        {
          id: '@TenkeySeven',
          link: 'https://blog.tenkeyseven.com/',
          avatar: 'https://avatars2.githubusercontent.com/u/33371927?s=160',
          style: 'color: #fff; background-color: #b59672',
        },
        {
          id: '@Silvester',
          link: 'https://silvester.wang/',
          avatar: 'https://avatars0.githubusercontent.com/u/34436920?s=160',
          style: 'color: #fff; background-color: #595058',
        },
        {
          id: '@ash0ne',
          link: 'https://blog.ash0ne.com/',
          avatar: 'https://avatars3.githubusercontent.com/u/28522665?s=160',
          style: 'color: #fff; background-color: #9f8cd1',
        },
        {
          id: '@FKY',
          link: 'http://blog.fkynjyq.com/',
          avatar: 'https://avatars2.githubusercontent.com/u/16451516?s=160',
          style: 'color: #fff; background-color: #005240',
        },
        {
          id: '@idealclover',
          link: 'https://idealclover.top/',
          avatar: 'https://avatars2.githubusercontent.com/u/24428416?s=160',
          style: 'color: #fff; background-color: #487747',
        },
        {
          id: '@kastnerorz',
          link: 'https://github.com/kastnerorz',
          avatar: 'https://avatars3.githubusercontent.com/u/26199342?s=160',
          style: 'color: #fff; background-color: #26498e',
        },
        {
          id: '@Patrick Wu',
          link: 'https://patrickwu.space/',
          avatar: 'https://avatars0.githubusercontent.com/u/15316889?s=160',
          style: 'color: #fff; background-color: #61a3cf',
        },
      ],
    }
  },
  mounted() {
    // Initialize post comment by DisqusJS
    if (process.env.NODE_ENV === 'production') {
      const disqusjs = new DisqusJS({
        shortname: 'spencerwoo',
        siteName: "Spencer's Blog",
        identifier: 'spencer-blog-guestbook',
        apikey:
          'F6hHeFWtfmWW5n4RVf4hjgazRj8y0ERfQdeQPIGKr79yajw6glnmTqrgYHTC8XaS',
        admin: 'spencerwoo',
        adminLabel: 'Admin',
      })
    }
  },
}
</script>

<style lang="scss">
.friends-container {
  max-width: var(--content-width);
  margin-left: auto;
  margin-right: auto;

  .btn {
    margin: 0.3em 0.6em 0.3em 0;
    text-decoration: none;
    padding: 0.5em;
    border-radius: var(--radius);
    display: inline-block;
    overflow: hidden;
    position: relative;

    .avatar {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 48px;
      height: 48px;
      border-radius: var(--radius);
      background-color: #fff;
      transform: rotate(20deg) translate(-15%, 0%);
    }

    span {
      margin-left: 2.6em;
    }
  }

  .note {
    margin: calc(var(--space) / 2) 0;
    font-size: 0.9em;
    opacity: 0.8;
  }
}

.post-comments {
  padding: calc(var(--space) / 2);
  max-width: var(--content-width);
  margin: 0 auto;
  font-family: var(--base-font-family);
}
</style>
