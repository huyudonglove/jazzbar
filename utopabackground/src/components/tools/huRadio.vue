<template>
    <div>
      <el-radio v-model="radio" label="1">上架</el-radio>
      <el-radio v-model="radio" label="2">下架</el-radio>
    </div>
</template>

<script>
  // <huRadio :radio-value="rValue" ref="radio"></huRadio>
  // console.log(this.$refs.radio.radio,11111)
    export default {
        name: "huRadio",
        data(){
          return{
            radio:'1'
          }
        },
        props:['radioValue'],
        created() {
          this.radio=(this.radioValue||'')+'';
        }
    }
</script>

<style scoped>

</style>
