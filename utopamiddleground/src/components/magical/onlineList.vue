<template>
  <div>
    <div v-if="type=='list'">
      <div style="background:#f0f0f5;margin-top:10px">
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
                <span class="myWords">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block"></nameInput>
                </span>
          <span class="myWords">
                       <cascader  @changeVal="change" :routeParams="true" :moduleId='`104`' ref="filter " style="display: inline-block"></cascader>
                </span>
          <span class="myWords">
                  <timeNew :router="true"></timeNew>
                </span>
          <!-- <span>
                  <commonDel :id='selectId' :disabled="!onlineVideoPower[3].isCheck" :all="true" style="display: inline-block" v-if="onlineVideoPower.length"></commonDel>
                </span> -->
        </el-row>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="offLine">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="55">
          </el-table-column>
          <el-table-column prop="name" label="视频名称" width="">
          </el-table-column>
          <el-table-column prop="videoUrl" label="视频预览地址" width="">
            <template slot-scope="scope">
              <a :href="scope.row.videoUrl" target="_blank">{{scope.row.videoUrl}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别" width="120">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="180">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" width="180">
          </el-table-column>
          <el-table-column prop="state" label="状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2">下架</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="buttonClick('edit',scope.row)" type="primary" :disabled="!onlineVideoPower[1].isCheck">编辑</el-button> -->
              <el-button size="mini" @click="buttonClick('watch',scope.row)" type="warning" >查看</el-button>
              <el-button size="mini" @click="clear(scope.row)" type="danger" v-if="scope.row.isDel||scope.row.isValid">清除</el-button>
              <!-- <commonDel :id='[scope.row.id]'  style="display: inline-block" :disabled="!onlineVideoPower[3].isCheck"></commonDel> -->
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
        </el-row>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id" :cell-class-name="delLine">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="55">
          </el-table-column>
          <el-table-column prop="name" label="钢琴名称" width="180">
          </el-table-column>
          <el-table-column prop="deviceCode" label="钢琴编号" width="180">
          </el-table-column>
          <el-table-column prop="bluetoothName" label="蓝牙名称">
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
  // <pianoList :type="`list`"  :type='`box`'></pianoList>
  import {getTotal,removeMaterial} from "../../http/request";
  import nameInput from '../tools/nameInput'
  import huSelect from '../tools/huSelect'
  import cascader from '../../share/cascader'
  import timeNew from '../../share/timeNew'
  import pagination from '../../share/page'
  import commonDel from '../../share/commonDel'
  import QRCode from 'qrcode'
  import vueQr from 'vue-qr'
  import { mapState, mapActions } from "vuex";
  export default {
    name: "onlineList",
    data(){
      return{
        pianoName:'',
        timeValue:[],
        moduleId:'',
        tableData:[],
        totalNum:0,
        tableHeight:300,
        selectId:[],
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
      vueQr
    },
    props:['type','selectArr'],
    computed:{
      ...mapState('currentUserPower',['onlineVideoPower']),
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
          module:104,
          appId:parseInt(this.$route.params.appId)
        }
        console.log(msg,777777777)
        this.initListModule(msg).then(res=>{
          this.totalNum=res.data.total;
          this.tableData=res.data.items;
        })
      },
      change(){

      },
      handleSelectionChange(val){
        this.setSelectId=val.map(v=>v.id);
        this.selectId=val.map(v=>v.id);
      },
      changePage(key,val){
        console.log(key,val)
        let msg={
          name:this.$refs.nameInput.reversedName,
          pageNum:this.$refs.page.page,
          pageSize:this.$refs.page.limit,
          module:104
        }
        getTotal(msg).then(res=>{
          this.totalNum=res.data.total;
          this.tableData=res.data.items;
        })
      },
      buttonClick(key,val){
        console.log(key,val);
        this.$emit('buttonClick',key,val)
      },

      getBoxTotal(){
        let msg={
          name:this.$refs.nameInput.reversedName,
          pageNum:this.$refs.page.page,
          pageSize:this.$refs.page.limit,
          module:104,
          appId:parseInt(this.$route.params.appId)
        }
        getTotal(msg).then(res=>{
          this.totalNum=res.data.total;
          this.tableData=res.data.items.map(v=>{
            v.pic?v.pic=Base64.decode(v.pic):null;
            return v;
          });
          if(this.selectArr){
            this.tableData.forEach(v=>{
              if(this.selectArr.indexOf(v.id)!=-1&&this.setSelectId.indexOf(v.id)==-1){//已经强制勾选过的过滤掉
                this.$refs.boxTable.toggleRowSelection(v,true);
              }
            })
          }
        })
      },
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
    mounted() {
      this.selectId = this.selectArr?this.selectArr:[]
      this.selectArr?this.getBoxTotal():this.getTotal();
    },
    updated(){
      this.$nextTick(()=>{
        this.$refs.listTable?this.tableHeight=window.innerHeight-this.$refs.listTable.$el.offsetTop-110:null;
      })
    },
  }
</script>

<style scoped>

</style>
