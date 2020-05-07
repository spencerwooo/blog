<template>
  <div>
    <!-- <span id="sitename"></span> -->
    <g-link class="logo" to="/">
      <span class="logo__text">
        &#9650; &nbsp; {{ $static.metadata.siteName }}
      </span>
    </g-link>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style lang="scss">
#sitename {
  margin-right: 1.2em;
}

.logo {
  text-decoration: none;
  color: var(--body-color) !important;
  font-size: 0.9em;

  &__image {
    vertical-align: middle;
    border-radius: 99px;
    height: 40px;
    width: 40px;
    margin-right: 0.5em;
  }
}
</style>
