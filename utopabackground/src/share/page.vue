<template>
  <div >
    <div class="block" style="position:fixed;left:250px;bottom:0px;z-index:8;padding-bottom:10px;background-color:#ffffff;width:100%;" v-if="router">
      <el-pagination
        background
        @size-change="limitChange"
        @current-change="pageChange"
        :current-page="parseInt(page)"
        :page-sizes="[ 20, 40, 60,80]"
        :page-size="parseInt(limit)"
        layout="total,sizes, prev, pager, next,jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    <div class="block" v-if="!router">
      <el-pagination
        @size-change="limitChange"
        @current-change="pageChange"
        :current-page="parseInt(page)"
        :page-sizes="[ 20, 40, 60,80]"
        :page-size="parseInt(limit)"
        :pager-count="5"
        small
        layout="total,sizes, prev, pager, next"
        :total="totalNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  /*<paginnation :totalNum='totalNum' ></pagination>  @change='repalce('',1)'*/
  import {mapActions,mapState,mapMutations} from 'vuex'
  export default {
    name: "page",
    computed:{

    },
    props:['totalNum','router','box'],
    inject:['reload','replace'],
    methods: {
      pageChange(val){
        //console.log(val,this.$route)
        console.log(1111)
        //this.$store.dispatch('pagination/getClickPage',val);
        this.router?(()=>{
          this.replace('page',val)
        })():(()=>{
          this.page=val;
          this.$emit('change','page',val)
        })();

      },
      limitChange(val){
        this.router?(()=>{
          this.replace('limit',val);
          this.replace('page',1)
        })():(()=>{
          this.limit=val;
          this.$emit('change','limit',val)
        })();
        //console.log(val)
        console.log(2222)

      }
    },
    data() {
      return {
        page:1,
        limit:20
      }
    },
    created() {
      this.router?(()=>{
        this.page=this.$route.query.page||1;
        this.limit=this.$route.query.limit||20;
      })():(()=>{
        this.page=1;
        this.limit=20;
      })();
    },
    mounted() {

    },
    watch:{
      $route(){
        this.router&&(()=>{
          this.page=this.$route.query.page||1;
          this.limit=this.$route.query.limit||20;
        })();

      }
    }
  }
</script>

<style scoped>

</style>
