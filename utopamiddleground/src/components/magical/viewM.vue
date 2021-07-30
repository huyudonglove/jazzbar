<template>
 <div>
   <equipPut v-if="equipPutShow"></equipPut>
   <equipPut v-if="equipPutShowCopy"></equipPut>
   <piano v-if="pianoShow"></piano> 
   <mp3Animation v-if="mp3AnimationShow"></mp3Animation> 
   <ensemble v-if="ensembleShow"></ensemble> 
   <pianoConcerto v-if="pianoConcertoShow"></pianoConcerto> 
   <iconModel v-if="iconModelShow"></iconModel>
   <model v-if="modelShow"></model> 
   <cartoonmusic v-if="cartoonmusicShow"></cartoonmusic>
   <mp4model v-if="mp4modelShow"></mp4model>
   <music v-if="musicShow"></music>
   <animation v-if="animationShow"></animation>
   <carrierModel v-if="carrierModelShow"></carrierModel>
   <mp4video v-if="mp4VideoShow"></mp4video>
   <online v-if="videoShow"></online> 
 </div>
</template>

<script>
import equipPut from './equipPut'
import piano from './piano'
import mp3Animation from './mp3Animation'
import ensemble from './ensemble'
import pianoConcerto from './pianoConcerto'
import iconModel from './iconModel'
import model from './model'
import cartoonmusic from './cartoonmusic'
import mp4model from './mp4model'
import music from './music'
import animation from './animation'
import carrierModel from './carrierModel'
import mp4video from './mp4video'
import online from './online'
export default {
  name:'viewM',
  data(){
    return{
      equipPutShow:false,
      pianoShow:false,
      mp3AnimationShow:false,
      ensembleShow:false,
      pianoConcertoShow:false,
      iconModelShow:false,
      modelShow:false,
      cartoonmusicShow:false,
      mp4modelShow:false,
      musicShow:false,
      animationShow:false,
      carrierModelShow:false,
      videoShow:false,
      imageCutShow:false,
      mp4VideoShow:false,
      equipPutShowCopy:false,
    }
  },
  components:{
    equipPut,
    piano,
    mp3Animation,
    ensemble,
    pianoConcerto,
    iconModel,
    model,
    cartoonmusic,
    mp4model,
    music,
    animation,
    carrierModel,
    mp4video,
    online
  },
  watch:{
    $route(to,from){
        if(from.params.appId!==to.params.appId||from.name!==to.name){
          this.equipPutShow=false;
          this.pianoShow=false;
          this.mp3AnimationShow=false;
          this.ensembleShow=false;
          this.pianoConcertoShow=false;
          this.iconModelShow=false;
          this.modelShow=false;
          this.cartoonmusicShow=false;
          this.mp4modelShow=false;
          this.musicShow=false;
          this.animationShow=false;
          this.carrierModelShow=false;
          this.videoShow=false;
          this.imageCutShow=false;
          this.mp4VideoShow=false;
        }
        this.$nextTick(()=>{
          switch(this.$route.name){
            case 'equipPutView':
              this.equipPutShow=true;
              break;
            case 'pianoView':
              this.pianoShow=true;
              break;
            case 'mp3AnimationView':
              this.mp3AnimationShow=true;
              break;
            case 'ensembleView':
              this.ensembleShow=true;
              break;
            case 'pianoConcertoView':
              this.pianoConcertoShow=true;
              break;
            case 'iconModelView':
              this.iconModelShow=true;
              break;
            case 'modelView':
              this.modelShow=true;
              break;
            case 'cartoonmusicView':
              this.cartoonmusicShow=true;
              break;
            case 'mp4modelView':
              this.mp4modelShow=true;
              break;
            case 'musicView':
            this.musicShow=true;
            break;
            case 'animationView':
              this.animationShow=true;
              break;
            case 'carrierModelView':
              this.carrierModelShow=true;
              break;
            case 'videoView':
              this.videoShow=true;
              break;
            case 'imageCutView':
            this.imageCutShow=true;
            break;
            case 'mp4VideoView':
            this.mp4VideoShow=true;
            break;
            default:
              break;
          }
        })
    }
  },
  created(){
    switch(this.$route.name){
      case 'equipPutView':
        this.equipPutShow=true;
        break;
      case 'pianoView':
        this.pianoShow=true;
        break;
      case 'mp3AnimationView':
        this.mp3AnimationShow=true;
        break;
      case 'ensembleView':
        this.ensembleShow=true;
        break;
      case 'pianoConcertoView':
        this.pianoConcertoShow=true;
        break;
      case 'iconModelView':
        this.iconModelShow=true;
        break;
      case 'modelView':
        this.modelShow=true;
        break;
      case 'cartoonmusicView':
        this.cartoonmusicShow=true;
        break;
      case 'mp4modelView':
        this.mp4modelShow=true;
        break;

      case 'musicView':
        this.musicShow=true;
        break;
      case 'animationView':
        this.animationShow=true;
        break;
      case 'carrierModelView':
        this.carrierModelShow=true;
        break;
      case 'videoView':
        this.videoShow=true;
        break;
      case 'imageCutView':
      this.imageCutShow=true;
      break;
      case 'mp4VideoView':
        this.mp4VideoShow=true;
        break;
      
      default:
        break;
    }
  }
}
</script>

<style scoped>

</style>