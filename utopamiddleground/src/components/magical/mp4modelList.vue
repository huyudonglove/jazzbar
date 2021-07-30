<template>
    <div>
      <div v-if="type=='list'&&appPower.length">
       <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block;"></nameInput>
            </span>
            <span class="myWords">
              <cascader   :routeParams="true" @changeVal="typeChange" :moduleId='110' ref="filter" style="display: inline-block"></cascader>
            </span>
             <span class="myWords">
                  <timeNew :router="true"></timeNew>
            </span>
            <span>
               <!-- <commonDel :id='selectId' :disabled='false' :all="true" style="display: inline-block"></commonDel>  -->
               <!-- 批量删除 -->
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="delLine">
            <!-- <el-table-column  align="center" type="selection" width="55" :reserve-selection="true"></el-table-column> -->
            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="MP4模型名称" width="" align="center"></el-table-column>
            <el-table-column prop="pic" label="gif展示" width="150" align="center">
                <template slot-scope="scope">
                <span style="cursor: pointer;" >
                 <img :src="scope.row.picUrl?`/static/${scope.row.picUrl}`:''" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类型" width="150" align="center"></el-table-column>
            <el-table-column prop="androidResourcePackageSize" label="资源大小(M)" width="120" align="center"></el-table-column>
            <!-- <el-table-column prop="durationTimeStr" label="总时长" width="100" align="center"></el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" width="100" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="100" align="center"></el-table-column>
            <el-table-column prop="updateUser" label="最后修改人" width="120" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" align="center" width="120">
              <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2">下架</span>
             </template>
            </el-table-column>
            <el-table-column prop="address" label="操作(请只操作魔幻演奏)" width="250" fixed="right" align="center">
              <template slot-scope="scope">
                 <!-- <el-button type="primary" size="mini" @click="editOrLook(scope.row,false)">编辑</el-button> -->
                 <el-button type="warning" size="mini" @click="editOrLook(scope.row,true)">查看</el-button>
                 <el-button size="mini" @click="clear(scope.row)" type="danger" v-if="scope.row.isDel||scope.row.isValid">清除</el-button>
                 <!-- <commonDel :id='[scope.row.id]' :disabled='false' style="display: inline-block"></commonDel> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :total-num="totalNum" :router="true"></pagination>
        </div>
      </div>
      <div v-if="type=='box'">
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
                <span class="myWords myWordsIpt">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="false" style="display: inline-block;" @change="changePage" ref="nameInput"></nameInput>
                </span>
                 <span class="myWords">
                <cascader   @changeVal="typeChange" :moduleId='110' ref="filter" style="display: inline-block;width: 200px"></cascader>
              </span>
          </el-row>
        </div>
        <div style="position:relative;">
          <div v-if="disabled" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:10;opacity:1;"></div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" :cell-class-name="delLine" row-key="id">
            <el-table-column type="selection" width="55" :reserve-selection="true"  :selectable="(row)=>row.isDel==0&&row.isValid==0&&row.state==1" >
            </el-table-column>
            <el-table-column prop="id" label="ID" width="55">
            </el-table-column>
            <el-table-column prop="name" label="MP4模型名称" width="">
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类别">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :total-num="totalNum" :router="false" @change="changePage" ref="page"></pagination>
        </div>
      </div>
    </div>
</template>

<script>
  import {getTotal,removeMaterial} from "../../http/request";
  import nameInput from '../tools/nameInput'
  import huSelect from '../tools/huSelect'
  import cascader from '../../share/cascader'
  import timeNew from '../../share/timeNew'
  import pagination from '../../share/page'
  import commonDel from '../../share/commonDel'
  import { Base64 } from 'js-base64';
  import { mapState, mapActions } from "vuex";
    export default {
        name: "cartoonmusicList",
        components:{
          nameInput,
          huSelect,
          cascader,
          timeNew,
          pagination,
          commonDel
        },
        props:['type','selectArr','isSelectOne','materialCategory','listModuleMaterial','disabled'],
        data(){
          return{
            timeValue:[],
            moduleId:'',
            tableData:[],
            totalNum:0,
            tableHeight:300,
            selectId:[],
            moduleTreeVal:'',
            setSelectId:[],//保存强制手动设置的id
          }
        },
      computed:{
        ...mapState('currentUserPower',{appPower:'appPower'}),
      },
      methods:{
        ...mapActions('assetsMoudel',['initListModule']),
        delLine({ row, rowIndex}){
        if(row.isDel===1){
          return 'del_line_xu'
        }else if(row.isValid===1){
          return 'cancel_xu'
        }else if(row.state===2){
          return 'off_line_xu'
        }else{
          return ''
        }
      },
      clear(row){
        removeMaterial({id:this.$route.params.appId,materialId:row.id}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.getTotal();
          }
        })
      },
        handleSelectionChange(val){
        this.setSelectId=val.map(v=>v.id);
        this.selectId=val.map(v=>v.id);
        if(this.type=='box'){
        if(this.isSelectOne&&val.length>1){
          this.$refs.boxTable.toggleRowSelection(val[0],false);
          val.splice(0,1);
        }
        this.$emit('change',val,'box',this.materialCategory);
      }
       },
       typeChange(arr,val){
        console.log(val,'val')
        this.moduleTreeVal=val
        },
        getTotal(){
        this.timeValue=(this.$route.query.time&&JSON.parse(this.$route.query.time));
        let msg={
          // state:1,
          // isDel:0,
          // isValid:0,
          name:this.$route.query.search||'',
          moduleTreeVal:this.$route.query.moduleTreeVal||'',
          page:this.$route.query.page||1,
          limit:this.$route.query.limit||20,
          createTimeStart:this.timeValue?this.timeValue[0]:'',
          createTimeEnd:this.timeValue?this.timeValue[1]:'',
          module:110,
          appId:parseInt(this.$route.params.appId)
        } 
        this.initListModule(msg).then(res=>{
          if(res.data.items !=null){
            let app=res.data.items.map(v => {
            v.pic?v.picUrl=Base64.decode(v.pic):null;
            v.play=false;
            if(v.placeholderPictureUrl){
              v.pictureUrl = Base64.decode(v.placeholderPictureUrl)
            }
            return v;
          })
          this.totalNum=res.data.total;
          this.tableData=JSON.parse(JSON.stringify(app))
          }
          })
          
    },
        changePage(key,val){
          //console.log(key,val)
          this.getBoxTotal();
        },
        getBoxTotal(){
        let msg={
          name:this.$refs.nameInput.reversedName,
          page:this.$refs.page.page,
          limit:this.$refs.page.limit,
          moduleTreeVal:this.moduleTreeVal,
          module:110,
          appId:parseInt(this.$route.params.appId),
          state:1,
          isDel:0,
          isValid:0,
        }
        this.initListModule(msg).then(res=>{
            if(res.data.items !=null){
            this.totalNum=res.data.total;
            this.tableData=res.data.items;
            if(this.selectArr){
            this.tableData.forEach(v=>{
              if(this.selectArr.indexOf(v.id)!=-1&&this.setSelectId.indexOf(v.id)==-1){//已经强制勾选过的过滤掉
                this.$refs.boxTable.toggleRowSelection(v,true);
              }
            })
          }
            } 
            })
    },
      editOrLook(row,isLook){
      this.$emit('editOrLook',row,isLook);
      }
      },
      mounted() {
        this.selectId = this.selectArr?this.selectArr:[]
        this.selectArr?this.getBoxTotal():this.getTotal();
      },
      watch: {
      moduleTreeVal(){
       if(this.type=='box'){
          this.getBoxTotal();
        }
     },
      selectArr(){
      console.log(this.selectArr,'selectArr')
      this.selectId = this.selectArr?this.selectArr:[];     
     },
     
      $route(){
        if(this.type=='list'){
          this.getTotal();
        }
    }
      },
      updated(){
     this.$refs.listTable?this.tableHeight=window.innerHeight-this.$refs.listTable.$el.offsetTop-110:null;
  },
    }
</script>

<style scoped>
</style>
<style>
  .myWordsIpt .el-input{
    width: 200px !important;
  }

</style>