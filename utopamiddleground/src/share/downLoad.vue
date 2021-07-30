<template>
  <div style="display:inline-block;">
   <div v-if="!type">
    <a class="ios" :href="iosMaterial" v-if="row.iosMaterial" :title="`${iosMaterialVersion}\n${iosLoadingLine}\n`" :download='iosFileName'></a>
    <a class="android" :href="androidMaterial" v-if="row.androidMaterial" :title="`${androidMaterialVersion}\n${androidLoadingLine}\n`" :download='androidFileName'></a>
    <a class="uwp" :href="uwpMaterial" v-if="row.uwpMaterial" :title="`${uwpMaterialVersion}\n${uwpLoadingLine}\n`" :download='uwpFileName'></a>
    <a class="windows" :href="windowsMaterial" v-if="row.windowsMaterial" :title="`${windowsMaterialVersion}\n${windowsLoadingLine}\n`" :download='windowsFileName'></a>
    <a class="ios-disabled" :href="iosMaterial" v-if="!row.iosMaterial"></a>
    <a class="android-disabled" :href="androidMaterial" v-if="!row.androidMaterial"></a>
    <a class="uwp-disabled" :href="uwpMaterial" v-if="!row.uwpMaterial"></a>
    <a class="windows-disabled" :href="windowsMaterial" v-if="!row.windowsMaterial"></a>
   </div>
   <!-- box -->
   <div v-if="type" class="box">
    <a class="ios"  v-if="row.iosMaterial">
      <span class="materialVersion">
        {{iosMaterialVersion}}
      </span>
      <span class="loadingLine">
        {{iosLoadingLine}}
      </span>
    </a>
    <a class="android"  v-if="row.androidMaterial">
      <span class="materialVersion">
      {{androidMaterialVersion}}
      </span>
      <span class="loadingLine">
        {{androidLoadingLine}}
      </span>
    </a>
    <a class="uwp"  v-if="row.uwpMaterial">
        <span class="materialVersion">
        {{uwpMaterialVersion}}
        </span>
        <span class="loadingLine">
          {{uwpLoadingLine}}
        </span>

    </a>
    <a class="windows"  v-if="row.windowsMaterial">
        <span class="materialVersion">
        {{windowsMaterialVersion}}
        </span>
        <span class="loadingLine">
          {{windowsLoadingLine}}
        </span>

    </a>
    <a class="ios-disabled"  v-if="!row.iosMaterial"></a>
    <a class="android-disabled"  v-if="!row.androidMaterial"></a>
    <a class="uwp-disabled"  v-if="!row.uwpMaterial"></a>
    <a class="windows-disabled"  v-if="!row.windowsMaterial"></a>
   </div>
  </div>
  
</template>
<script>
import { Base64 } from 'js-base64';
export default {
  name:'downLoad',
  inject:['replace','reload'],
  props: ["row",'type'],
  data(){
    return{
    iosMaterial:'',
    androidMaterial:'',
    uwpMaterial:'',
    windowsMaterial:'',
    iosMaterialVersion:'',
    androidMaterialVersion:'',
    uwpMaterialVersion:'',
    windowsMaterialVersion:'',
    iosLoadingLine:'',
    androidLoadingLine:'',
    uwpLoadingLine:'',
    windowsLoadingLine:'',
    androidFileName:'',
    iosFileName:'',
    uwpFileName:'',
    windowsFileName:''
    }
  },
  watch:{
  },
  created(){
     if(!this.type){
    this.iosMaterial=this.row.iosMaterial?`/static/${Base64.decode(this.row.iosMaterial)}`:'javascript:void(0)'
    this.androidMaterial=this.row.androidMaterial?`/static/${Base64.decode(this.row.androidMaterial)}`:'javascript:void(0)'
    this.uwpMaterial=this.row.uwpMaterial?`/static/${Base64.decode(this.row.uwpMaterial)}`:'javascript:void(0)'
    this.windowsMaterial=this.row.windowsMaterial?`/static/${Base64.decode(this.row.windowsMaterial)}`:'javascript:void(0)'

    this.androidFileName=this.row.androidFileName?this.row.androidFileName:''
    this.iosFileName=this.row.iosFileName?this.row.iosFileName:''
    this.uwpFileName=this.row.uwpFileName?this.row.uwpFileName:''
    this.windowsFileName=this.row.windowsFileName?this.row.windowsFileName:''


    this.iosMaterialVersion=this.row.iosUnityVersion?this.row.iosUnityVersion:''
    this.androidMaterialVersion=this.row.androidUnityVersion?this.row.androidUnityVersion:''
    this.uwpMaterialVersion=this.row.uwpUnityVersion?this.row.uwpUnityVersion:''
    this.windowsMaterialVersion=this.row.windowsUnityVersion?this.row.windowsUnityVersion:''
    this.iosLoadingLine=this.row.iosLoadingLine?this.row.iosLoadingLine:''
    this.androidLoadingLine=this.row.androidLoadingLine?this.row.androidLoadingLine:''
    this.uwpLoadingLine=this.row.uwpLoadingLine?this.row.uwpLoadingLine:''
    this.windowsLoadingLine=this.row.windowsLoadingLine?this.row.windowsLoadingLine:''
     }
    if(this.type){
    this.iosMaterialVersion=this.row.iosUnityVersion?this.row.iosUnityVersion:''
    this.androidMaterialVersion=this.row.androidUnityVersion?this.row.androidUnityVersion:''
    this.uwpMaterialVersion=this.row.uwpUnityVersion?this.row.uwpUnityVersion:''
    this.windowsMaterialVersion=this.row.windowsUnityVersion?this.row.windowsUnityVersion:''
    this.iosLoadingLine=this.row.iosLoadingLine?this.row.iosLoadingLine=='Built-In Render'?'BIR':this.row.iosLoadingLine:''
    this.androidLoadingLine=this.row.androidLoadingLine?this.row.androidLoadingLine=='Built-In Render'?'BIR':this.row.androidLoadingLine:''
    this.uwpLoadingLine=this.row.uwpLoadingLine?this.row.uwpLoadingLine=='Built-In Render'?'BIR':this.row.uwpLoadingLine:''
    this.windowsLoadingLine=this.row.windowsLoadingLine?this.row.windowsLoadingLine=='Built-In Render'?'BIR':this.row.windowsLoadingLine:''
    }
  },
  mounted(){
   
  },
  methods:{
   
  }
}
</script>
<style scoped>
a{
  width: 32px;height: 32px;display: inline-block;cursor: pointer;position: relative;
}
.ios{
  background: url("../assets/ios-black.png") no-repeat center  center;
}
.android{
  background: url("../assets/anzhuo.png") no-repeat center  center;
}
.uwp{
  background: url("../assets/ARyanjing.png") no-repeat center  center;
}
.windows{
  background: url("../assets/weiruan.png") no-repeat center  center;
}
.ios-disabled{
  background: url("../assets/ios-black-2.png") no-repeat center  center;
}
.android-disabled{
  background: url("../assets/anzhuo-2.png") no-repeat center  center;
}
.uwp-disabled{
  background: url("../assets/ARyanjing-2.png") no-repeat center  center;
}
.windows-disabled{
  background: url("../assets/weiruan-2.png") no-repeat center  center;
}

.box a{
  width: 65px;height: 38px;display: inline-block;cursor: pointer;position: relative;margin-bottom: 10px;cursor:auto ;
}
.box a span{
  font-size: 1px; position: absolute;z-index: 999;display: block;text-align: center;width: 68px;color: #707070;
}
.materialVersion{
 top: -5px;
  
}
.loadingLine{
  bottom: -10px;
}
</style>