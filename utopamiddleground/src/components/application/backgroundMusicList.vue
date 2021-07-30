<template>
    <div>
      <div v-if="type=='list'&&appPower.length">
       <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block;"></nameInput>
            </span>
             <span class="myWords">
                  <timeNew :router="true"></timeNew>
            </span>
            <span>
               <commonDel :id='selectId' :all="true" :disabled="!appPower[3].isCheck" http="/api/utopa/ar/material/group/batchDelete"></commonDel> <!-- 批量删除 -->
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="offLine">
            <el-table-column  align="center" type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="背景音乐单名称" width="" align="center"></el-table-column>
            
            <el-table-column prop="commonModelName" label="歌曲数量" width="150" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.materialCount}}</span>
                <img src="../../assets/warn.png" alt="" v-if="scope.row.materialCount&&(scope.row.materialDelState==1||scope.row.materialIsValidState==1||scope.row.materialState==2)">
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="" align="center"></el-table-column>
            <el-table-column prop="updateBy" label="最后修改人" width="120" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" align="center" width="120">
              <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2">下架</span>
             </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="250" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" :disabled="!appPower[2].isCheck" @click="editOrLook(scope.row.id,true)">查看</el-button>
                <!-- <el-button type="primary" size="mini" :disabled="!appPower[1].isCheck" @click="editOrLook(scope.row.id,false)">编辑</el-button> -->
                <!-- <commonDel :id='[scope.row.id]' :disabled="!appPower[3].isCheck" http="/api/utopa/ar/material/group/batchDelete"></commonDel> -->
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
          <div>
              <span class="myWords myWordsIpt">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="false" style="display: inline-block;" @change="changePage" ref="nameInput" ></nameInput>
                </span>
            <span class="myWords">
               <el-select v-model="materialCategory" placeholder="请选择类型" @change="changePage" clearable  style="display: inline-block;width: 200px">
                  <el-option
                    label="普通模型"
                    value=103
                    >
                  </el-option>
                  <el-option
                    label="MP4模型管理"
                    value=110
                    >
                  </el-option>
              </el-select>
              </span>
          </div>
          <div>
              <span>
                <huSelect :type="`unity`" ref="unityBox"  @change="changePage"  style="display: inline-block;width: 200px;margin-top:10px"></huSelect>
              </span>
            <span>
                <huSelect :type="`pipeline`"  ref="pipelineBox"  @change="changePage"  style="display: inline-block;width: 200px"></huSelect>
              </span>
          </div>
        </el-row>
      </div>
        <div style="position:relative;">
          <div v-if="disabled" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:10;opacity:1;"></div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id" :cell-class-name="offLine">
            <el-table-column type="selection" width="40" :reserve-selection="true" :selectable="(row)=>row.isDel==0">
            </el-table-column >
            <el-table-column prop="id" label="ID" width="55">
            </el-table-column>
            <el-table-column prop="name" label="模型名称">
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="类型">
               <template slot-scope="scope">
                {{scope.row.commonModelName?'普通模型':'MP4模型'}}
               </template>
            </el-table-column>
             <el-table-column prop="materialFormat" label="平台/版本/管道" width="160">
               <template slot-scope="scope">
                <downLoad :row="scope.row" type='box'></downLoad>
               </template>
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
  import {getTotal,getGroupList,getGroupInfo} from "../../http/request";
  import nameInput from '../tools/nameInput'
  import huSelect from '../tools/huSelect'
  import cascader from '../../share/cascader'
  import timeNew from '../../share/timeNew'
  import pagination from '../../share/page'
  import commonDel from '../../share/commonDel'
   import downLoad from '../../share/downLoad'
  import { Base64 } from 'js-base64';
  import { mapState, mapActions } from "vuex";
    export default {
        name: "iconModelList",
        components:{
          nameInput,
          huSelect,
          cascader,
          timeNew,
          pagination,
          commonDel,
          downLoad
        },
        props:['type','selectArr','isSelectOne','disabled'],
        data(){
          return{
            timeValue:[],
            moduleId:'',
            tableData:[],
            totalNum:0,
            tableHeight:300,
            materialCategory:null,
            selectId:[],
            setSelectId:[],//保存强制手动设置的id
          }
        },
      computed:{
      ...mapState('currentUserPower',{appPower:'appPower'}),
      }, 
      methods:{
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
      offLine({ row, rowIndex}){
        if(row.state===2){
          return 'off_line_xu'
        }else{
          return ''
        }
      },
        handleSelectionChange(val){
        
        this.setSelectId=val.map(v=>v.id);
        this.selectId=val.map(v=>v.id);
        if(this.type=='box'){
         
        if(this.isSelectOne&&val.length>1){
          console.log(111,222)
          this.$refs.boxTable.toggleRowSelection(val[0],false);
          val.splice(0,1);
        }
        this.$emit('change',val);
      }
       },
        getTotal(){
        this.timeValue=(this.$route.query.time&&JSON.parse(this.$route.query.time));
        let msg={
          name:this.$route.query.search||'',
          backgroundAppId:this.$route.params.appId,
          groupCategory:5,
          pageNum:this.$route.query.page||1,
          pageSize:this.$route.query.limit||20,
          createStartTime:this.timeValue?this.timeValue[0]:'',
          createEndTime:this.timeValue?this.timeValue[1]:'',
        }
          getGroupList(msg).then(res=>{
            this.totalNum=res.data.total;
            this.tableData=res.data.items.map(v=>{
              v.fileId?v.pic=Base64.decode(v.fileId):null;
              return v;
            });
          })
    },
        changePage(key,val){
        console.log(key,val)
        this.getBoxTotal();
      },
        getBoxTotal(){
        let msg={
          name:this.$refs.nameInput.reversedName,
          pageNum:this.$refs.page.page,
          pageSize:this.$refs.page.limit,
          backgroundAppId:parseInt(this.$route.params.appId),
          groupCategory:5,
          unityVersion:this.$refs.unityBox.unityValue,
          loadingLine:this.$refs.pipelineBox.pipelineValue,
          materialCategory:this.materialCategory,
          isDel:'0'
        }
        getGroupList(msg).then(res=>{
          this.totalNum=res.data.total;
          this.tableData=res.data.items
          if(this.selectArr){
            this.tableData.forEach(v=>{
              if(this.selectArr.indexOf(v.id)!=-1&&this.setSelectId.indexOf(v.id)==-1){//已经强制勾选过的过滤掉
                this.$refs.boxTable.toggleRowSelection(v,true); 
              }
            })
          }
        })
    },
      editOrLook(id,isLook){
        getGroupInfo({id}).then(res=>{
          this.$emit('editOrLook',res.data,isLook);
        })
      }
      },
      mounted() {
        this.selectId = this.selectArr?this.selectArr:[]
        this.selectArr?this.getBoxTotal():this.getTotal();
      },
      watch: {
        selectArr(){
       this.selectId = this.selectArr?this.selectArr:[];
       },
      $route(){
        if(this.type=='list'){
          this.getTotal();
        }
    }
      },
      updated(){
    this.$refs.listTable?this.tableHeight = window.innerHeight - this.$refs.listTable.$el.offsetTop - 110:null;
  },
    }
</script>
<style>
  .myWordsIpt .el-input{
    width: 200px !important;
  }
</style>
