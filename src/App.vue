<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>

import PrincipalView from './views/PrincipalView.vue'
export default {
  name: 'App',
  components: {
    PrincipalView
  },
  data: () => ({
    //
  })
};
</script>
