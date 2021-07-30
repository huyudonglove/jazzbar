<template>
  <div>
    <div v-if="type=='list'&&appPower.length">
      <div style="background:#f0f0f5;margin-top:10px">
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
                <span class="myWords">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block;"></nameInput>
                </span>
          <span class="myWords">
                       <cascader  @changeVal="change" :routeParams="true" :moduleId='103' ref="filter " style="display: inline-block"></cascader>
            </span>
          <span class="myWords">
                  <timeNew :router="true"></timeNew>
            </span>
          <span class="myWords">
                <huSelect :type="`unity`" :value="uValue" ref="unity" :router="true" @change="change" style="display: inline-block"></huSelect>
            </span>
          <span class="myWords">
              <huSelect :type="`pipeline`" :value="pValue" ref="pipeline" :router="true" @change="change" style="display: inline-block"></huSelect>
            </span>
          <span>
                  <!-- <el-button  type="danger"  @click="delAll()">批量删除</el-button> -->
                </span>
        </el-row>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="delLine">
          <!-- <el-table-column type="selection" width="55" :reserve-selection="true" >
          </el-table-column> -->
          <el-table-column prop="id" label="ID" width="55">
          </el-table-column>
          <el-table-column prop="name" label="模型名称" width="180">
          </el-table-column>
          <el-table-column prop="pic" label="预览图展示" width="180">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                 <img :src="scope.row.picUrl?`/static/${scope.row.picUrl}`:''" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
          </el-table-column>
          <el-table-column prop="address" label="素材包">
            <template slot-scope="scope">
              <downLoad :row="scope.row"></downLoad>
            </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="180">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人">
          </el-table-column>
          <el-table-column prop="state" label="状态">
             <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2">下架</span>
             </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="250" align="center">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="buttonClick('edit',scope.row)" type="primary">编辑</el-button> -->
              <el-button size="mini" @click="buttonClick('watch',scope.row)" type="warning">查看</el-button>
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
          <div>
              <span class="myWords myWordsIpt">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="false" style="display: inline-block;" @change="changePage" ref="nameInput" ></nameInput>
                </span>
            <span class="myWords">
                <huSelect :type="`operation`"  ref="operationBox"  @change="changePage" style="display: inline-block;width: 200px" ></huSelect>
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
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable"  row-key="id" :cell-class-name="delLine">
          <el-table-column type="selection" width="55" align="center" :reserve-selection="true" :selectable="(row)=>row.isDel==0&&row.isValid==0&&row.state==1">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="55" align="center">
          </el-table-column>
          <el-table-column prop="name" label="模型名称" width="">
          </el-table-column>
           <el-table-column prop="materialFormat" label="平台/版本/管道" width="160">
               <template slot-scope="scope">
                <downLoad :row="scope.row" type='box'></downLoad>
               </template>
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
  import { mapState, mapActions } from "vuex";
  import downLoad from '../../share/downLoad'
  export default {
    name: "modelList",
    components:{
      nameInput,
      huSelect,
      cascader,
      timeNew,
      pagination,
      commonDel,
      downLoad,
    },
    props:['type','selectArr','isSelectOne','materialCategory','disabled'],
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
        selectId:[],
        setSelectId:[]
      }
    },
    computed:{
      ...mapState('currentUserPower',{appPower:'appPower'}),
    },
    methods:{
      ...mapActions('assetsMoudel',['initListModule']),
      change(){}
      ,
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
        }else if(row.isValid===1){
          return 'cancel_xu'
        }else if(row.state===2){
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
          this.$refs.boxTable.toggleRowSelection(val[0],false);
          val.splice(0,1);
        }
        this.$emit('change',val,'box',this.materialCategory);
      }
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
          module:103,
          unitySelect:this.$route.query.unity||'',
          lineSelect:this.$route.query.pipeline||'',
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
        this.getBoxTotal();
      },
      buttonClick(key,val){
        console.log(key,val);
        this.$emit('buttonClick',key,val)
      },
      getBoxTotal(){
        let msg={
          name:this.$refs.nameInput.reversedName,
          page:this.$refs.page.page,
          limit:this.$refs.page.limit,
          module:103,
          appId:parseInt(this.$route.params.appId),
          unitySelect:this.$refs.unityBox.unityValue,
          lineSelect:this.$refs.pipelineBox.pipelineValue,
          materialSource:this.$refs.operationBox.operationValue,
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
    },
    mounted() {
      this.selectId = this.selectArr?this.selectArr:[]
      this.selectArr?this.getBoxTotal():this.getTotal();
    },
    watch:{
      selectArr(){
        this.selectId = this.selectArr?this.selectArr:[];
      },
      $route(){
        this.type=='list'&&(()=>{
          this.getTotal();
        })();

      }
    },
    updated() {
      this.$nextTick(()=>{
        this.$refs.listTable?this.tableHeight=window.innerHeight-this.$refs.listTable.$el.offsetTop-110:null;
      })
    }
  }
</script>

<style>
  .myWordsIpt .el-input{
    width: 200px !important;
  }
</style>
