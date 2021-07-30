<template>
  <div>
    888888
  </div>
</template>

<script>
  import {jazzbarName} from "../../token";

  export default {
    name: "logout",
    created() {
      this.$cookies.remove(jazzbarName);
      new Promise(resolve => {
        this.$router.push('/login');
        resolve(1);
      }).then(v=>{
        window.location.reload();
      })
    }
  }
</script>

<style scoped>

</style>
