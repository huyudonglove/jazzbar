<template>
  <div>
    <div v-if="type=='gif'||type=='img'">
      <img ref="playImg" :src="src" style="width:0px;height:0px" v-focus>
    </div>
    <div v-if="type=='music'">
      <audio :src="src" autoplay="autoplay" ref="audio"></audio>
      <el-dialog title="音乐播放" :visible.sync="dialogMusic" width="30%" @close="musicClose">
      <img v-if="isPlay" src="../assets/musicPlay.gif" width="100%">
      <div v-if="!isPlay" style="height:200px;text-align:center;">音乐无法播放</div>
      </el-dialog> 
    </div>
    <div v-if="type=='video'">
      <el-dialog title="视频播放" :visible.sync="dialogVideo" width="30%" @open="videoOpen" @close="videoClose">
      <video controls :src="src" ref="video" autoplay width="100%"></video>
      </el-dialog> 
    </div>
  </div>
</template>
<script>
export default {
  name:'playDialog',
  props:['type','src'],
  data(){
    return{
      dialogMusic:true,
      dialogVideo:true,
      isPlay:true
    }
  },
  watch:{
    src(){
      if(this.type=='gif'||this.type=='img'){
        this.$refs.playImg.click();
        this.$emit("closePlay");
      }
    }
  },
  mounted(){
    if(this.type=='gif'||this.type=='img'){
      this.$refs.playImg.click();
      this.$emit("closePlay");
    }
    if(this.type=='music'){
      this.$refs.audio.load();
      this.$refs.audio.play();
      this.$refs.audio.onerror=()=>{this.isPlay = false;this.$message.error('音乐无法播放');}
    }
    if(this.type=='video'){
      
    }
  },
  methods:{
    musicClose(){
      this.$refs.audio.pause();
      this.$emit("closePlay");
    },
    videoOpen(){
      this.$refs.video.onerror=()=>{this.$message.error('视频无法播放');}
    },
    videoClose(){
      this.$emit("closePlay");
    }
  }
}
</script>
<style scoped>

</style>