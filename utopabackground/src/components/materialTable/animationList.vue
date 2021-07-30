<template>
    <div>
      <div v-if="type=='list'&&scenePower.length">
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block"></nameInput>
            </span>
            <span class="myWords">
              <cascader  @changeVal="typeChange" :routeParams="true" :moduleId='101' ref="filter " style="display: inline-block"></cascader>
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
            <span>
              <commonDel :id='selectId' :all="true" :disabled="!scenePower[3].isCheck"></commonDel>
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="offLine">
            <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="动画名称" width="180" align="center"></el-table-column>
            <el-table-column prop="picUrl" label="动画展示" width="120" align="center">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="`/static/${scope.row.picUrl}`" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类型" align="center"></el-table-column>
            <el-table-column prop="viewType" label="动画类型" align="center"></el-table-column>
            <el-table-column prop="durationTimeStr" label="动画时长" align="center"></el-table-column>
            <el-table-column prop="isLyric" label="歌词" align="center">
              <template slot-scope="scope">
                {{scope.row.lyricUrl?'是':'否'}}
                <a style="cursor: pointer;" v-if="scope.row.lyricUrl" @click="download(scope.row.lyricUrl,scope.row.name)"><img src="../../assets/download.png"/></a>
              </template>
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="素材包" align="center" width="180">
              <template slot-scope="scope">
              <downLoad :row="scope.row" v-if="showDown"></downLoad>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="100" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="100" align="center"></el-table-column>
            <el-table-column prop="updateUser" label="最后修改人" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="2"
                  inactive-color="#ccc"
                  @change="changState(scope.row.state,scope.row.id)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="address" width="210" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editOrLook(scope.row,false)" :disabled="!scenePower[1].isCheck">编辑</el-button>
                <el-button type="warning" size="mini" @click="editOrLook(scope.row,true)" :disabled="!scenePower[2].isCheck">查看</el-button>
                <commonDel :id='[scope.row.id]' :disabled="!scenePower[3].isCheck" ></commonDel>
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
              <nameInput :name-disabled="false" :name-holder="`请输入名称`" ref="nameInput" :router="true" style="display: inline-block" @change="changePage"></nameInput>
            </span>
             <span class="myWords">
                <huSelect :type="`operation`"  ref="operationBox"  @change="changePage" style="display: inline-block;width: 200px" ></huSelect>
             </span>
              <span class="myWords">
              <huSelect type="unity" :value="unityValue" ref="unity"  @change="selectChange"></huSelect>
            </span>
            <span class="myWords">
            <cascader  @changeVal="typeChange"  :moduleId='101' ref="filter " style="display: inline-block"></cascader>
          </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id" :cell-class-name="delLine">
            <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="(row)=>!row.isDel"></el-table-column>
            <el-table-column prop="id" label="ID" width="55"></el-table-column>
            <el-table-column prop="name" label="动画名称" width="180"></el-table-column>
            <el-table-column prop="address" label="平台/版本/管道" width="160">
              <template slot-scope="scope">
                <downLoad :row="scope.row" type="box"></downLoad>
              </template>
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类型">
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="总时长">
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
import {getTotal,pageModuleMaterial} from "../../http/request";
import nameInput from '../tools/nameInput'
import huSelect from '../tools/huSelect'
import cascader from '../../share/cascader'
import timeNew from '../../share/timeNew'
import pagination from '../../share/page'
import commonDel from '../../share/commonDel'
import { Base64 } from 'js-base64';
import downLoad from '../../share/downLoad'
import { mapState } from "vuex";
export default {
  name: "animationList",
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
      showDown:false,
      setSelectId:[]
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
  methods:{
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
        module:101
      }
       this.showDown=false
      getTotal(msg).then(res=>{
        this.totalNum=res.data.total;
        this.showDown=true
        this.tableData=res.data.items.map(v=>{
          v.pic?v.picUrl=Base64.decode(v.pic):null;
          // v.placeholderPictureUrl?v.placeholderPictureUrl=Base64.decode(v.placeholderPictureUrl):null;
          return v;
        });
      })
    },
    typeChange(val){
      this.moduleTreeVal=val.length?val[0]:''
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
        module:101,
        appId: this.appId||''
      }
      pageModuleMaterial(msg).then(res=>{
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
    editOrLook(row,isLook){
      this.$emit('editOrLook',row,isLook);
    },
    changState(state,id){
      if(state==1){
        this.$confirm('确认上架吗？').then(u=>{
          upState(id).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.tableData.forEach(v=>{if(v.id==id){v.state=2;}});
            }else{
              this.$message.success('上架成功');
            }
          }).catch(err=>{
            this.tableData.forEach(v=>{if(v.id==id){v.state=2;}});
          })
        }).catch(error=>{
          this.tableData.forEach(v=>{if(v.id==id){v.state=2;}});
        })
      }else if(state==2){
        this.$confirm('确认下架吗？').then(u=>{
          offState(id).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.tableData.forEach(v=>{if(v.id==id){v.state=1;}});
            }else{
              this.$message.success('下架成功');
            }
          }).catch(err=>{
            this.tableData.forEach(v=>{if(v.id==id){v.state=1;}});
          })
        }).catch(error=>{
          this.tableData.forEach(v=>{if(v.id==id){v.state=1;}});
        })
      }    
    },
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
  computed:{
    ...mapState('currentUserPower',['scenePower']),
  },
  mounted() {
    this.selectId = this.selectArr?this.selectArr:[]
    this.selectArr?this.getBoxTotal():this.getTotal();
  },
  updated(){
    this.$refs.listTable?this.tableHeight = window.innerHeight - this.$refs.listTable.$el.offsetTop - 110:null;
  },
}
</script>

<style scoped>

</style>
