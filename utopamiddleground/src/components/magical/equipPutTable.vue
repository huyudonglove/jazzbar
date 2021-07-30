<template>
    <div>
      <div v-if="type=='list'&&appPower.length">
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block"></nameInput>
            </span>
            <span class="myWords">
              <timeNew :router="true"></timeNew>
            </span>
            <span>
              <commonDel :id='selectId' :all="true" :disabled="!appPower[3].isCheck" http="/api/utopa/ar/device/putIn/batchDelete"></commonDel>
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" :max-height="tableHeight" row-key="id" :cell-class-name="offLine">
            <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="materialName" label="钢琴名称" width="180" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.materialName}}</span>
                <img src="../../assets/warn.png" alt="" v-if="scope.row.materialDelState==1||scope.row.materialIsValidState==1||scope.row.materialState==2">
              </template>
            </el-table-column>
            <el-table-column prop="pianoCode" label="钢琴编号" width="120" align="center"></el-table-column>
            <el-table-column label="编号二维码" align="center">
              <template slot-scope="scope">
                <vue-qr :logoSrc="null" :text="scope.row.pianoCode" :size="80" v-focus :margin="0" :dotScale="1" :logoScale="20"></vue-qr>
              </template>
            </el-table-column>
            <el-table-column prop="bluetoothName" label="蓝牙名称" align="center"></el-table-column>
            <el-table-column prop="combineGroupName" label="合奏曲合集名称" align="center"></el-table-column>
            <el-table-column prop="pianoGroupName" label="钢琴曲合集名称" align="center"></el-table-column>
            <el-table-column prop="mp3CartoonGroupName" label="MP3动画合集名称" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="180" align="center"></el-table-column>
            <el-table-column prop="updateBy" label="最后修改人" align="center"></el-table-column>
            <el-table-column prop="state" label="上架状态" align="center">
              <template slot-scope="scope">
                <el-switch
                 :disabled="!appPower[1].isCheck"
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="2"
                  inactive-color="#ccc"
                  @change="up(scope.row.state,scope.row.id)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="address" width="210" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" :disabled="!appPower[2].isCheck" @click="editOrLook(scope.row.id,true)">查看</el-button>
                <el-button type="primary" size="mini" :disabled="!appPower[1].isCheck" @click="editOrLook(scope.row.id,false)">编辑</el-button>
                <commonDel :id='[scope.row.id]' :disabled="!appPower[3].isCheck" http="/api/utopa/ar/device/putIn/batchDelete"></commonDel>
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
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`" ref="nameInput" :router="false" style="display: inline-block" @change="changePage"></nameInput>
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id">
            <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
            <el-table-column prop="id" label="ID" width="55"></el-table-column>
            <el-table-column prop="materialName" label="钢琴名称"></el-table-column>
            <el-table-column prop="pianoCode" label="钢琴编号"></el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :total-num="totalNum" :router="false" @change="changePage" ref="page"></pagination>
        </div>
      </div>
    </div>
</template>

<script>
import {getEquipPutList,getEquipPutInfo,setEquipPutStatus} from "../../http/request";
import nameInput from '../tools/nameInput'
import timeNew from '../../share/timeNew'
import pagination from '../../share/page'
import commonDel from '../../share/commonDel'
import { Base64 } from 'js-base64';
import {mapState} from 'vuex';
import QRCode from 'qrcode'
import vueQr from 'vue-qr'
export default {
  name: "equipPutTable",
    props:['type','selectArr','isSelectOne'],
  data(){
    return{
      timeValue:[],
      tableData:[],
      totalNum:0,
      tableHeight:300,
      selectId:[],
      setSelectId:[],//保存强制手动设置的id
    }
  },
  components:{
    nameInput,
    timeNew,
    pagination,
    commonDel,
    vueQr
  },
  computed:{
    ...mapState('currentUserPower',{appPower:'appPower'}),
  },
  methods:{
    offLine({ row, rowIndex}){
       if(row.state===2){
          return 'off_line_xu'
        }else{
          return ''
        }
      },
    up(state,id){
      let notice,resetState;
      if(state==1){
        notice = '确认上架吗？';
        resetState = 2;
      }else{
        notice = '确认下架吗？';
        resetState = 1;
      }
      this.$confirm(notice).then(u=>{
        setEquipPutStatus({id,state}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
            this.tableData.forEach(v=>{if(v.id==id){v.state=resetState;}});
          }else{
            this.$message.success(res.msg);
          }
        }).catch(err=>{
          this.tableData.forEach(v=>{if(v.id==id){v.state=resetState;}});
        })
      }).catch(error=>{
        this.tableData.forEach(v=>{if(v.id==id){v.state=resetState;}});
      })
    },
    getTotal(){
      this.timeValue=(this.$route.query.time&&JSON.parse(this.$route.query.time));
      let msg={
        materialName:this.$route.query.search||'',
        backgroundAppId:this.$route.params.appId,
        pageNum:this.$route.query.page||1,
        pageSize:this.$route.query.limit||20,
        createStartTime:this.timeValue?this.timeValue[0]:'',
        createEndTime:this.timeValue?this.timeValue[1]:'',
      }
      getEquipPutList(msg).then(res=>{
        this.totalNum=res.data.total;
        this.tableData=res.data.items;
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
        pageNum:this.$refs.page.page,
        pageSize:this.$refs.page.limit,
        backgroundAppId:this.$route.params.appId,
      }
      getEquipPutList(msg).then(res=>{
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
    editOrLook(id,isLook){
      getEquipPutInfo({id}).then(res=>{
        this.$emit('editOrLook',res.data,isLook);
      }) 
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
    this.selectId = this.selectArr?this.selectArr:[];
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
