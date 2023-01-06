<script>
  // your script goes here
  import { onMount } from "svelte";
  
  import { file } from "../store.js";

  let items = []
  
  
  
  const updateData = async () => {
    fetch("http://localhost:3000/pendingData")
          .then(response => response.json())
          .then(data => {
            items.push(data);    
          })
  
    const res = await fetch("http://localhost:3000/pendingData");
    items = await res.json();
  
  }
  
  const clearData = () => {
    items.splice(0, items.length);
    items = items
  }
  
  const uploadData = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    console.log(data) 
  }  

</script>

<button on:click={updateData}>Click me to update the data</button>
<button on:click={clearData}>Click me to clear the data</button>


<form on:submit|preventDefault={uploadData}>
  <label>File to parse</label>
  <input type="file" name="data" />
  <button type="submit">Submit</button>
</form>

<div>
  <ul>
	{#each items as item}
		<li>
      <div>
        <p>P:{item.P}</p>
        <p>K:{item.K}</p>
        <p>D:{item.D}</p>
      </div>
    </li>
	{/each}
  </ul>
</div>


<style>
  li {
      border-style: solid;
      border-color: red;
    }
</style>
