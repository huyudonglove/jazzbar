<template>
  <div style="display: inline-block;">
    <el-date-picker
      v-model="timeValue"
      type="daterange"
      format="yyyy-MM-dd" value-format="yyyy-MM-dd"
      @change="time"
      range-separator="-"
      start-placeholder="创建开始时间"
      end-placeholder="结束时间"
    >
    </el-date-picker>
  </div>
</template>

<script>
  /*<timeSwitch></timeSwitch>*/
  export default {
    name: "timeNew",
    data(){
      return{
        timeValue:[]
      }
    },
    inject:['replace'],
    props:['router','timeVal'],
    methods:{
      time(){
        this.router&&(()=>{
          this.replace('page',1);
          this.replace('time',JSON.stringify(this.timeValue))
        })();
      }
    },
    created() {
      this.router?(()=>{
        this.timeValue=this.$route.query.time?JSON.parse(this.$route.query.time):[];
      })():(()=>{
        this.timeValue=this.timeVal||[];
      })();

    }
  }
</script>

<style scoped>

</style>
