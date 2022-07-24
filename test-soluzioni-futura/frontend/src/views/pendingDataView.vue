<template>
  <h1>Dati da processare</h1>
  <table>
    <thead>
      <tr>
        <th>id</th>
        <th>message</th>
        <th>status</th>
        <th>priority</th>
        <th>timestamp</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.message }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.priority }}</td>
        <td>{{ item.timestamp }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>

import axios from 'axios'

export default {
  name: "App",
  data(){
        return {
            data: [],
    };
    },

 

        mounted() {
                var formData = new FormData(this.$refs.dataform);
                axios.get('http://localhost:3000/pendingData', formData)
                    .then(response => {
                        console.log(response);
                        this.data = response.data;
                    
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
 

};
</script>

<style>
table, td, th {  
  border: 1px solid #ddd;
  text-align: left;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 15px;

}
</style>
