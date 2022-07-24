<template>
  <h1>Dati processati </h1>
    <form >
    <p>from
    <input name="from" v-model="from" type="text" > {{ from }}
    

    limit
    <input name="limit" v-model="limit" type="text" >

    <button @click.prevent="search()">Submit</button>
</p>
    </form>

  <table>
    <thead>
      <tr>
        <th>id</th>
        <th>proc_k</th>
        <th>proc_d</th>
        <th>proc_timestamp</th>


      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.proc_k }}</td>
        <td>{{ item.proc_d }}</td>
        <td>{{ item.proc_timestamp }}</td>
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
            from: "",
            limit: "",                  

    };
    },
    mounted() {
        this.search();
    },
  methods: {

        search() {
                var from_addon = this.from.length>0?"&from=" + this.from: "";
                var limit_addon = this.limit.length>0?"&limit=" + this.limit: "";
              
                axios.get(`http://localhost:3000/data?${from_addon}${limit_addon} `)
                    .then(response => {
                        console.log(response);
                        this.data = response.data;
                    
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
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
