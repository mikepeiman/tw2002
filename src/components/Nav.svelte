<nav>
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>home</a></li>
		<li><a class='{segment === "about" ? "selected" : ""}' href='about'>about</a></li>
    <li><a class='{segment === "tw2002" ? "selected" : ""}' href='tw2002'>tw2002</a></li>
		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<li><a rel=prefetch class='{segment === "blog" ? "selected" : ""}' href='blog'>blog</a></li>
	</ul>
</nav><script>
	export let segment;
</script>

<style>
	nav {
		/* border-bottom: 1px solid rgba(255,62,0,0.1); */
		font-weight: 300;
		padding: 0 1em;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 10vh;
    z-index: 1;
    background: white;
	}

	ul {
		margin: 0;
		padding: 0;
    height: 100%;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		/* position: absolute; */
		content: '';
		/* width: calc(100% - 1em); */
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		/* bottom: -1px; */
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>
