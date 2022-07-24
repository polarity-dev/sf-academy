<template>
  <h1>Importazione dati</h1>
  <div class="about">
    <form ref="dataform">
        <p>Scegli un file da importare</p>
        <input name="soluzioni" type="file">
        <p><button @click.prevent="upload()">Submit</button></p>
    </form>
  </div>
</template>
<script>
import axios from 'axios'
  export default{
      methods: {
          upload() {
              var formData = new FormData(this.$refs.dataform);
              axios.post('http://localhost:3000/importDataFromFile', formData)
                  .then(response => {
                      console.log(response);
                  })
                  .catch(error => {
                      console.log(error);
                  });
          }
      }

    }
</script>
