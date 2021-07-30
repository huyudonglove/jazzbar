<template>
    <div>
      <div v-if="type=='list'">
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block"></nameInput>
            </span>
            <span class="myWords">
              <cascader  @changeVal="typeChange" :routeParams="true" :moduleId='102' ref="filter " style="display: inline-block"></cascader>
            </span>
            <span class="myWords">
              <timeNew :router="true"></timeNew>
            </span>
            <span class="myWords">
              <huSelect type="unity" :value="unityValue" ref="unity" :router="true" @change="selectChange"></huSelect>
            </span>
            <span class="myWords">
              <huSelect type="pipeline" :value="pipelineValue" ref="unity" :router="true" @change="selectChange"></huSelect>
            </span>
            <span class="myWords">
              <huSelect type="animation" :value="animationValue" ref="unity" :router="true" @change="selectChange"></huSelect>
            </span>
            <!-- <span>
              <commonDel :id='selectId' :all="true" :disabled="!carrierPower[3].isCheck"></commonDel>
            </span> -->
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" :max-height="tableHeight" row-key="id" :cell-class-name="offLine">
            <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="载体模型名称" width="180" align="center"></el-table-column>
            <el-table-column prop="picUrl" label="预览图展示" width="125" align="center">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.picUrl?`/static/${scope.row.picUrl}`:''" alt=""  style="width:100px;height:100px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="placeholderPictureUrl" label="占位图展示" width="125" align="center">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.placeUrl?`/static/${scope.row.placeUrl}`:''" alt=""  style="width:100px;height:100px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类型" align="center"></el-table-column>
            <el-table-column prop="viewType" label="动画类型" align="center"></el-table-column>
            <el-table-column prop="durationTimeStr" label="素材包" align="center">
              <template slot-scope="scope">
                <downLoad :row="scope.row"></downLoad>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="180" align="center"></el-table-column>
            <el-table-column prop="updateUser" label="最后修改人" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2">下架</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" width="210" label="操作(请只操作魔幻演奏)" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="warning" size="mini"  @click="editOrLook(scope.row,true)">查看</el-button>
                <!-- <el-button type="primary" size="mini" :disabled="!carrierPower[1].isCheck" @click="editOrLook(scope.row,false)">编辑</el-button> -->
                 <el-button size="mini" @click="clear(scope.row)" type="danger" v-if="scope.row.isDel||scope.row.isValid">清除</el-button>
                <!-- <commonDel :id='[scope.row.id]' :disabled="!carrierPower[3].isCheck"></commonDel> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :total-num="totalNum" :router="true"></pagination>
        </div>
      </div>
      <div v-if="type=='box'">
        <div style="margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`" ref="nameInput" :router="false" style="display: inline-block" @change="changePage"></nameInput>
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id" :cell-class-name="delLine">
            <el-table-column type="selection" width="40" :reserve-selection="true" :selectable="(row)=>!row.isDel"></el-table-column>
            <el-table-column prop="id" label="ID" width="55"></el-table-column>
            <el-table-column prop="name" label="载体模型名称"></el-table-column>
            <el-table-column prop="address" label="平台/版本/管道" width="160">
              <template slot-scope="scope">
                <downLoad :row="scope.row" type="box"></downLoad>
              </template>
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类型">
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
import {getTotal,pageModuleMaterial,removeMaterial} from "../../http/request";
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
  name: "carrierModelTable",
    props:['type','selectArr','isSelectOne','appId'],
  data(){
    return{
      timeValue:[],
      tableData:[],
      totalNum:0,
      tableHeight:300,
      selectId:[],
      moduleTreeVal:'',
      unityValue:'',
      pipelineValue:'',
      animationValue:'',
    }
  },
  components:{
    nameInput,
    huSelect,
    cascader,
    timeNew,
    pagination,
    commonDel,
    downLoad
  },
  computed:{
  },
  methods:{
    ...mapActions('assetsMoudel',['initListModule']),
    clear(row){
        removeMaterial({id:this.$route.params.appId,materialId:row.id}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.getTotal();
          }
        })
      },
    delLine({ row, rowIndex}){
        if(row.isDel===1){
          return 'del_line_xu'
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
    getTotal(){
      this.timeValue=(this.$route.query.time&&JSON.parse(this.$route.query.time));
      let msg={
        name:this.$route.query.search||'',
        materialCategoryId:this.moduleTreeVal||'',
        pageNum:this.$route.query.page||1,
        pageSize:this.$route.query.limit||20,
        createTimeStart:this.timeValue?this.timeValue[0]:'',
        createTimeEnd:this.timeValue?this.timeValue[1]:'',
        unityVersion:this.unityValue||'',
        loadingLine:this.pipelineValue||'',
        viewType:this.animationValue||'',
        module:102,
        appId:parseInt(this.$route.params.appId)
      }
      this.initListModule(msg).then(res=>{
        this.totalNum=res.data.total;
        this.tableData=res.data.items.map(v=>{
          v.pic?v.picUrl=Base64.decode(v.pic):null;
          v.placeholderPictureUrl?v.placeUrl=Base64.decode(v.placeholderPictureUrl):null;
          return v;
        });
      })
    },
    typeChange(arr,val){
      this.moduleTreeVal=val
    },
    selectChange(key,val){
      this[key+'Value']=val?val:'';
    },
    handleSelectionChange(val){
      this.setSelectId=val.map(v=>v.id);
      this.selectId=val.map(v=>v.id);
      if(this.type=='box'){
        if(this.isSelectOne&&val.length>1){
          this.$refs.boxTable.toggleRowSelection(val[0],false);
          val.splice(0,1);
        }
        this.$emit('change',val);
      }
    },
    changePage(key,val){
      console.log(key,val)
      this.getBoxTotal();
    },
    getBoxTotal(){
      let msg={
        name:this.$refs.nameInput.reversedName,
        page:this.$refs.page.page,
        limit:this.$refs.page.limit,
        module:102,
        appId:parseInt(this.$route.params.appId),
        // unitySelect:this.$refs.unityBox.unityValue,
        // lineSelect:this.$refs.pipelineBox.pipelineValue,
        // materialSource:this.$refs.operationBox.operationValue,
        state:1,
        isDel:0,
        isValid:0,
      }
      this.initListModule(msg).then(res=>{
        this.totalNum=res.data.total;
        this.tableData=res.data.items;
        if(this.selectArr){
          this.tableData.forEach(v=>{
            if(this.selectArr.indexOf(v.id)!=-1&&this.setSelectId.indexOf(v.id)==-1){//已经强制勾选过的过滤掉
              this.$refs.boxTable.toggleRowSelection(v,true);
            }
          })
        }
      })
    },
    editOrLook(row,isLook){
      this.$emit('editOrLook',row,isLook);
    }
  },
  watch:{
    selectArr(){
      this.selectId = this.selectArr?this.selectArr:[];
    },
    $route(){
      if(this.type=='list'){
        this.getTotal();
      }
    }
  },
  mounted() {
    this.selectId = this.selectArr?this.selectArr:[]
    this.selectArr?this.getBoxTotal():this.getTotal();
  },
  updated(){
    this.$nextTick(()=>{
      this.$refs.listTable?this.tableHeight = window.innerHeight - this.$refs.listTable.$el.offsetTop - 110:null;
    })
  },
}
</script>

<style scoped>

</style>
