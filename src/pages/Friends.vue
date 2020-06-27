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
  font-family: Lato, sans-serif;

  .vssue {
    color: var(--body-color) !important;
    a {
      color: var(--link-color);
      font-family: Lato, sans-serif;
    }
    .vssue-new-comment-body textarea,
    .vssue-new-comment-footer {
      font-family: Lato, sans-serif !important;
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
    .vssue-notice .vssue-progress {
      background-color: var(--link-color) !important;
    }
    .vssue-comment.vssue-comment-edit-mode .vssue-comment-main {
      border-color: #549cf0;
      box-shadow: 0 0 1px 1px #549cf0;
      textarea {
        color: var(--body-color) !important;
      }
    }
    .vssue-icon {
      fill: var(--link-color) !important;
    }
    .vssue-button {
      color: var(--link-color) !important;
      border: 2px solid var(--link-color) !important;
      border-radius: 5px;
      font-weight: normal;
      font-family: Lato, sans-serif;
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
</style>
