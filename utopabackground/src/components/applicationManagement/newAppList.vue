<template>
  <div>
    <div v-if="type=='list'">
      <div style="background:#f0f0f5;margin-top:10px">
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
                <span class="myWords">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block;"></nameInput>
                </span>
          <span class="myWords">
            </span>
          <span class="myWords">
                <huSelect :type="`unity`" :value="uValue" ref="unity" :router="true" @change="change" style="display: inline-block"></huSelect>
            </span>
          <span class="myWords">
              <huSelect :type="`pipeline`" :value="pValue" ref="pipeline" :router="true" @change="change" style="display: inline-block"></huSelect>
            </span>
          <span>
              <el-select v-model="playId" @change="playChange" placeholder="请选择玩法" clearable>
                <el-option v-for="item in playData" :value="item.id" :label="item.name" :key="item.id"></el-option>
              </el-select>
          </span>
          <span>
            <commonDel :id='ids'  :all="true" http="/api/utopa/ar/background/app/batchDelete" :disabled="!appPower[3].isCheck" v-if="appPower.length" nameKey="appIds"></commonDel>
          </span>
        </el-row>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" :max-height="tableHeight" :cell-class-name="offLine">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="55">
          </el-table-column>
          <el-table-column prop="name" label="应用名称" width="180">
          </el-table-column>
          <el-table-column prop="playName" label="玩法" width="180">
          </el-table-column>
          <el-table-column prop="unityVersion" label="unity版本">
          </el-table-column>
          <el-table-column prop="loadingLine" label="渲染管道">
          </el-table-column>
          <el-table-column prop="address" label="素材列表">
            <template slot-scope="scope">
              <el-button type="text" @click="applicationInfo(scope.row.id)">查看</el-button>
              <img src="../../assets/warn.png" alt="" v-if="scope.row.materialDelState==1">
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="180">
          </el-table-column>
          <el-table-column prop="updateBy" label="最后修改人">
          </el-table-column>
          <el-table-column prop="state" label="状态">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2">下架</span> -->
                <el-switch v-model="scope.row.state" :active-value="1" :inactive-value="2" inactive-color="rgb(220,223,230)"
                  @change="switchState(scope.row)"
                >
                </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="280">
            <template slot-scope="scope" v-if="appPower.length">
              <el-button size="mini" @click="buttonClick('edit',scope.row)" type="primary" :disabled="!appPower[1].isCheck">编辑</el-button>
              <el-button size="mini" @click="buttonClick('watch',scope.row)" type="warning" :disabled="!appPower[2].isCheck">查看</el-button>
              <commonDel :id='[scope.row.id]' :all="false" style="display: inline-block" http="/api/utopa/ar/background/app/batchDelete" :disabled="!appPower[3].isCheck" nameKey="appIds"></commonDel>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <pagination :total-num="totalNum" :router="true"></pagination>
      </div>
    </div>
    <el-dialog :visible.sync="visible" width="30%">
      <el-table :data="materialData">
        <el-table-column property="moduleName" label="素材" width="200"></el-table-column>
        <el-table-column property="materialCount" label="数量" width="300"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {getTotal,applicationList,applicationlistModule,applicationInfo,getPlayList,applicationUpper,applicationLower} from "../../http/request";
  import nameInput from '../tools/nameInput'
  import huSelect from '../tools/huSelect'
  import cascader from '../../share/cascader'
  import timeNew from '../../share/timeNew'
  import pagination from '../../share/page'
  import commonDel from '../../share/commonDel'
  import { mapState } from "vuex";
  export default {
    name: "newAppList",
    components:{
      nameInput,
      huSelect,
      cascader,
      timeNew,
      pagination,
      commonDel
    },
    props:['type'],
    inject:['replace'],
    data(){
      return{
        pianoName:'',
        timeValue:[],
        moduleId:'',
        tableData:[],
        totalNum:0,
        tableHeight:300,
        uValue:'',
        pValue:'',
        mValue:'',
        materialData:[],
        visible:false,
        ids:[],
        playData:[],
        playId:''
      }
    },
    computed:{
      ...mapState('currentUserPower',['appPower']),
    },
    methods:{
      change(){

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
      handleSelectionChange(val){
        this.ids=[];
        val.map(v=>{
          this.ids.push(v.id)
        })
      },
      changePage(key,val){
        //console.log(key,val)
        let msg={
          name:this.$refs.nameInput.reversedName,
          pageNum:this.$refs.page.page,
          pageSize:this.$refs.page.limit,
          module:109
        }
        getTotal(msg).then(res=>{
          this.totalNum=res.data.total;
          this.tableData=res.data.items;
        })
      },
      applicationList(){
        let msg={
          name:this.$route.query.search||'',
          unityVersion:this.$route.query.unity||'',
          loadingLine:this.$route.query.pipeline||'',
          page:this.$route.query.page||1,
          limit:this.$route.query.limit||20,
          playId:this.$route.query.playId||''
        }
        applicationList(msg).then(res=>{
          this.tableData=res.data.items;
          this.totalNum=res.data.total;
        })
      },
      buttonClick(key,val){
          console.log(key,val);
          this.$emit('buttonClick',key,val)
      },
      applicationInfo(id){
        this.visible=true;
        applicationInfo({appId:id}).then(res=>{
          this.materialData=res.data.moduleList;
        })
      },
      getPlayList(){
        getPlayList().then(res=>{
          this.playData=res.data;
          console.log(res,77777)
        })
      },
      playChange(){
        this.replace('playId',this.playId)
      },
      switchState(row){
            let word;
            row.state==1?word='上架':word='下架';
            this.$confirm(`确认${word}吗`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then((res=>{
              if(row.state==1){
                applicationUpper(row.id).then(v=>{
                  this.applicationList();
                })
              }else{
                applicationLower(row.id).then(v=>{
                  this.applicationList();
                })
              }
            })).catch(()=>{
              if(row.state==1){
                row.state=2
              }else{
                row.state=1
              }
            })
          }
    },
    created() {
      this.applicationList();
      this.getPlayList();
    },
    watch:{
      $route(){
        this.applicationList();
      }
    },
    updated() {
      this.$nextTick(()=>{
        this.$refs.listTable?this.tableHeight=window.innerHeight-this.$refs.listTable.$el.offsetTop-110:null;
      })
    }
  }
</script>

<style scoped>

</style>
