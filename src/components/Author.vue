<template>
	<div class="author">

		<g-image alt="Author image" class="author__image" src="~/assets/images/author.jpg" width="180" height="180" blur="5" />

		<h1 v-if="showTitle" class="author__site-title">
			{{ $static.metadata.siteName }}
		</h1>

		<p class="author__intro">
			开发者 / 设计师 / 少数派 / 学生
		</p>

		<p class="author__links">
			<g-link to="/">Home</g-link>
			<a href="//spencerwoo.com">Portfolio</a>
			<a href="//medium.com/spencerweekly">Medium</a>
			<a href="//twitter.com/realSpencerWoo">Twitter</a>
			<a href="//github.com/spencerwooo">GitHub</a>
			<a href="//blog.spencerwoo.com/posts/index.xml">RSS</a>
		</p>

	</div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
export default {
	props: ['showTitle']
}
</script>

<style lang="scss">
.author {
	margin: 0 auto;
	max-width: 500px;
	text-align: center;
	padding: calc(var(--space) / 2) 0;

	&__image {
		border-radius: 100%;
		width: 90px;
		height: 90px;
		margin-bottom: 1em;
	}

	&__intro {
		opacity: .8;
	}

	&__site-title {
		font-size: 1.5em;
	}

	&__links {
		margin-top: -.5em;
		a {
			margin: 0 .5em;
		}
	}
}
</style>
