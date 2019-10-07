<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
		/* max-width: 56em; */
		background-color: white;
		/* padding: 2em; */
		/* margin: 3rem auto; */
    top: 10vh;
    height: calc(90vh - 2rem - 10px);
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>