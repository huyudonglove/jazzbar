<template>
  <div style="display:inline-block;">
    <el-button @click="deletAll()" size="mini" type="danger" :disabled="disabled" v-if="!all">删除</el-button>
    <el-button @click="deletAll()"  type="danger" :disabled="disabled" v-if="all">批量删除</el-button>
  </div>
</template>
<script>
 import {deletAll} from "@/http/request";
 import http from '../http'
import {loadRequest} from '../util' //loading遮罩层
export default {
  name:'cascader',
  inject:['replace','reload'],
  props: ["id","disabled","all","http",'nameKey'],
  data(){
    return{
      nameKeyCopy:''
    }
  },
  watch:{
  },
  created(){

  },
  mounted(){
      this.nameKeyCopy=this.nameKey||'list';
  },
  methods:{
    deletAll(){
       if(this.all&&!this.id.length){
        this.$message.error('最少选择一项删除项')
        return;
       }
       else if(this.http){
         let obj={};
         obj[this.nameKeyCopy]=this.id;
         loadRequest(this.http,obj,'删除',http,'post').then(res=>{
           if (res.code) {
            this.$message.error(res.msg)
          } else {
            this.reload()
          }
         })
       }else{
        deletAll(this.id.join(",")).then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.reload()
        }
      })
       }

    }
  }
}
</script>
<style scoped>

</style>
