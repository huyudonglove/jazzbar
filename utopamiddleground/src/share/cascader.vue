<template>
  <div>
   <el-cascader
    ref="tree"
    :disabled="disabled"
    v-model="moduleTreeSelect"
    :options="moduleTree"
    :props="props"
    :show-all-levels="false"
    @change="handleChange"
    filterable
    clearable
    placeholder="请选择类别"
    :key="Math.random()"
              >
  </el-cascader>
  </div>
</template>
<script>
import {applicationToTree,queryMaterialById,queryMaterialCategoryById} from "../http/request";
export default {
  name:'cascader',
  inject:['replace','reload'],
  props: ["moduleId","routeParams",'queryMaterialId','disabled'],
  data(){
    return{
    moduleTreeSelect:[],
    moduleTreeVal:'',
    moduleTree:[],
    props: {
        label: "name",
        children: 'children',
        value:'id',
        checkStrictly: true,
        expandTrigger:'click'
    },
    }
  },
  watch:{
     queryMaterialId(val){
      this.getQueryMaterialCategory(val)
    }

  },
  created(){
    this.moduleTreeSelect=this.$route.query.moduleTreeSelect&&this.routeParams?JSON.parse(this.$route.query.moduleTreeSelect):[]
    applicationToTree({moduleId:this.moduleId}).then(res=>{
      this.moduleTree=res.data?res.data:[]
    })
    if(this.queryMaterialId){
      console.log('created')
      this.getQueryMaterialCategory(this.queryMaterialId)
    }
    // if(this.id){
    //   queryMaterialById({id:this.id}).then(res=>{
    //     this.moduleTreeSelect=res.data.materialCategoryIdList
    //     this.handleChange(this.moduleTreeSelect)
    //   })
    // }
    
  },
  mounted(){
    
  },
  methods:{
    handleChange(value){
        this.moduleTreeVal=value[value.length-1]?value[value.length-1]:''
        if(this.routeParams){
          this.replace('moduleTreeVal',this.moduleTreeVal);
          // this.$store.commit('pagination/setClickPage',1);
          this.replace('page',1);
          let apple =JSON.stringify(this.moduleTreeSelect);
          this.replace('moduleTreeSelect',apple);
        }
        this.$emit('changeVal',value,this.moduleTreeVal); //通知父组件改变。
        this.$refs.tree.dropDownVisible = false; //监听值发生变化就关闭它
        this.$nextTick(()=>{
        let arr = document.getElementsByClassName('el-cascader__dropdown');
        for(let i=0;i<arr.length;i++){
          arr[i].parentElement.removeChild(arr[i]);
          arr[i]?arr[i].style.display='none':null;
        }
      })
      },
      getQueryMaterialCategory(id){ //查询指定的素材
        id?queryMaterialCategoryById({id}).then(res=>{
        this.moduleTreeSelect=res.data.parentIdList
      }):this.moduleTreeSelect=[];
      }
  }
}
</script>
<style scoped>

</style>
