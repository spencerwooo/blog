<template>
  <div>
    <h1 class="not-found-title text-center space-bottom">404</h1>
    <div class="not-found-container">
      <p class="description">
        🍌 Oh, no, not here.
        <g-link to="/">Take me back home. ↩</g-link>
      </p>
      <g-image
        alt="404 Not Found"
        class="not-found-bg"
        src="~/assets/images/404.svg"
        blur="5"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-container {
  text-align: center;
  max-width: var(--content-width);
  margin: 0 auto;

  .description {
    opacity: 0.8;
  }
}
</style>
