<template>
  <div>
    <h1 class="friends-title text-center space-bottom">Friends</h1>

    <div class="friends-container">
      <a href="https://spencerwoo.com">https://spencerwoo.com</a>
    </div>

    <div class="post-comments">
      <!-- Add comment widgets here -->
      <Vssue />
    </div>
  </div>
</template>

<style lang="scss">
.friends-container {
  text-align: center;
  max-width: var(--content-width);
  margin: 0 auto;
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
