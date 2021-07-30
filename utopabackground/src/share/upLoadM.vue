<template>
  <div style="max-width:300px;">
    <el-upload
      :disabled="disabled"
      ref="upLoad"
      class="upload-demo"
      action="/api/utopa/ar/material/upload/video"
      :headers="header"
      :data="upData"
      :on-change="fileChange"
      :on-progress="progress"
      :on-remove="fileRemove"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
      :on-preview="showName"
      :on-exceed="exceed"
      :limit="1"
      :file-list="fileList">
      <el-button :disabled="disabled" size="small" type="primary">点击上传</el-button>
      <!-- <div v-if="type" slot="tip" class="el-upload__tip">只能上传{{type}}文件</div> -->
    </el-upload>
  </div>
</template>
<script>
  import {jazzbarName} from "../components/token";

  export default {
  name:'upLoad',
  props:{
    type:{
      default:''
    },
    size:{
      default:''
    },
    name:{
      default:''
    },
    disabled:{
      default:false
    }
  },
  data(){
    return{
      header:{
        Authorization:this.$cookies.get(jazzbarName)
      },
      upData:{
        type:'file',
        moduleCode:'jazzBar'
      },
      fileList:[],
      duration:'',
      isPermit:true,
      upLoading:null
    }
  },
  watch:{
    name(name){
      name?this.fileList=[{name}]:this.fileList=[];
    }
  },
  mounted(){
    this.name?this.fileList=[{"name":this.name}]:this.fileList=[];
  },
  methods:{
    fileChange(file, fileList) {
      console.log(file,1515);
      this.isPermit=true;
      if(this.type){
        var typeList = this.type.split('/');
        var typeArr = file.name.split('.');
        var typeUp = typeArr[typeArr.length-1];
        if(!typeList.some(v=>typeUp.toLowerCase() === v.toLowerCase())){
          this.$message.error(`只能上传${this.type}后缀名文件！`);
          this.isPermit=false;
          this.fileList=[];
          return;
        }
      }
      if(this.size){
        var isSize = file.size / 1024 / 1024 < (this.size*1);
        if(!isSize){
          this.$message.error(`大小不能超过${this.size}M！`);
          this.isPermit=false;
          this.fileList=[];
          return;
        }
      }
    },
    exceed(){
      this.$message.error('一次只能上传一个文件')
    },
    fileRemove(file,fileList){
      this.upLoading?this.upLoading.close():null;
      this.fileList=fileList;
      this.$emit('getFileData',{"fileId":'',"name":'',"size":'',"duration":''});
    },
    beforeUpload(file){
      console.log(file,4545)
      var url = URL.createObjectURL(file)
      var audioElement = new Audio(url)
      audioElement.addEventListener('loadedmetadata', () => {
        this.duration = parseInt(audioElement.duration)
      })
      if(this.isPermit){
        this.upLoading = this.$loading({
        lock: true,
        text: `文件上传中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
        return true;
      }else{
        return false;
      }
    },
    progress(event, file, fileList){

    },
    uploadSuccess(res){
      this.upLoading?this.upLoading.close():null;
      if(res.code){
        this.fileList=[];
        this.$message.error(res.msg);
      }else{
        //console.log(res,77777777)
        this.$emit('getFileData',res.data);
      }
    },
    uploadError(err){
      this.upLoading?this.upLoading.close():null;
      this.fileList=[];
    },
    showName(){
      var self=this;
      const h = this.$createElement;
      this.$notify({
        title: '',
        message: h('i', { style: 'color: teal'}, self.name),
        duration:2000
      });
    }
  }
}
</script>
<style scoped>

</style>
