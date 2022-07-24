<template>
  <div class="home">
    <img class="logo" alt="Vue logo" src="../assets/propic.jpg">
    <HelloWorld msg="Esame soluzioni futura"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HomePage.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

<style>
.logo{
  width: 300px;
  height: 300px;
  background-size: contain;
  /* make it round */
  border-radius: 50%;   
  /* make it a circle */    
  border-radius: 50% 50% 50% 50%; 
}
</style>
