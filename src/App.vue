<script lang="ts">
import { defineComponent } from 'vue';
import Home from './components/Home.vue'
import Finish from './components/Finish.vue';
import Teste from './components/Teste.vue';
import liveCode from './components/liveCode.vue';

export default defineComponent({
  components: {
    Home,
    // Finish,
    Teste,
    // liveCode
  }
})

</script>

<template>
  <Home />
  <!-- <Finish /> -->
  <Teste />
  <!-- <liveCode /> -->
</template>
