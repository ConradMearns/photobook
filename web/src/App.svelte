<script>

import { onMount } from 'svelte';

let ListAPI = "https://waruz9j9ha.execute-api.us-west-2.amazonaws.com/prod/"
let GetAPI = " https://d78nixxzsc.execute-api.us-west-2.amazonaws.com/prod/"

let data = []

let imagee = []

onMount(async function() {
	const response = await fetch(ListAPI);
	const json = await response.json();
	data = json["Contents"];

	const api_info_response = await fetch('api.json');
	const api_info = await api_info_response.json();
	console.log(api_info);
});

async function getImage(key) {
	const response = await fetch(GetAPI+"100x100/"+key);
	const i = await response.text();

	if (response.ok) {
		return i;
	} else {
		throw new Error(i);
	}
}

</script>

<main>
	<h1>Photobook</h1>
	<div>
		<!-- {#each data as p_obj}
			{#await getImage(p_obj["Key"]) then i}
				<img src="{i}" alt="" />
			{/await}
		{/each} -->
	</div>

</main>