<template>
  <div></div>
</template>
<script>
import {getTotal} from '../../http/request'
export default {
  name:'materialData',
  methods:{
    getTableData(params){
      getTotal(params).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.$emit('getData',res.data);
        }
      })
    }
  }
}
</script>
<style scoped>

</style>