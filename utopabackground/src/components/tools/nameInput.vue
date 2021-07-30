<template>
    <div>
      <el-input v-model.trim="reversedName" :placeholder="nameHolder" :disabled="nameDisabled" style="width: 220px" maxlength="20"  @input="change('search',reversedName)"></el-input>
    </div>
</template>

<script>
  // <name-input :name-disabled="false" :name-holder="1111111" ref="nameInput" :name-input="name"></name-input>
  // this.$refs.nameInput.reversedName
    export default {
        name: "nameInput",
        data(){
          return{
            reversedName:''
          }
        },
      inject:['replace'],
      computed:{

      },
      methods:{
        change(key,val){
          this.router?(()=>{
            this.replace(key,val);
            this.replace('page',1)
          })():(()=>{
            this.$emit('change')
          })();
        }
      },
      props:['nameInput','nameDisabled','nameHolder','router'],
      created() {
        this.router?(()=>{
          this.reversedName=this.$route.query.search;
        })():(()=>{
          this.reversedName=this.nameInput||'';
        })();
      },
      watch:{
          nameInput(val){
            this.reversedName=this.nameInput
        }
      }
    }
</script>

<style scoped>

</style>
