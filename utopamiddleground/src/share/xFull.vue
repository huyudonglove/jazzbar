<template>
  <div style="display:inline-block;">
    <div class="full_xu" v-if="!isFull" @click="myClick"></div>
    <div class="nofull_xu" v-if="isFull" @click="exitFull"></div>
  </div>
</template>
<script>
export default {
  name:'xFull',
  data(){
    return{
      isFull:false,
    }
  },
  methods:{
    myClick(){
      this.$emit('full');
    },
    full(element){
      this.isFull=true;
      var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    exitFull(el) { 
      this.isFull=false;
      var el= document, 
      cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen, 
      wscript; 
      if (typeof cfs != "undefined" && cfs) { 
        cfs.call(el); 
        return; 
      } 
      if (typeof window.ActiveXObject != "undefined") { 
          wscript = new ActiveXObject("WScript.Shell"); 
          if (wscript != null) { 
              wscript.SendKeys("{F11}"); 
          } 
    } 
  }
  }
}
</script>
<style scoped>
.full_xu{
  width:28px;
  height:28px;
  background: url(../assets/full_grey.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.full_xu:hover{
  background: url(../assets/full.png) no-repeat;
  background-size: 100% 100%;
}
.nofull_xu{
  width:28px;
  height:28px;
  background: url(../assets/nofull_grey.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.nofull_xu:hover{
  background: url(../assets/nofull.png) no-repeat;
  background-size: 100% 100%;
}
</style>