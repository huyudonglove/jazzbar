<template>
    <div>
      <div v-if="type=='list'&&pianoListPower.length">
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
                <span class="myWords">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block"></nameInput>
                </span>
                  <span class="myWords">
                       <cascader  @changeVal="change" :routeParams="true" :moduleId='`108`' ref="filter " style="display: inline-block"></cascader>
                </span>
            <span class="myWords">
                  <timeNew :router="true"></timeNew>
                </span>
            <span>
                  <commonDel :id='selectId' :disabled="!pianoListPower[3].isCheck" :all="true" style="display: inline-block"></commonDel>
                </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="offLine">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="55">
            </el-table-column>
            <el-table-column prop="name" label="钢琴名称" width="180">
            </el-table-column>
            <el-table-column prop="deviceCode" label="钢琴编号" width="180">
            </el-table-column>
            <el-table-column prop="address" label="编号二维码">
              <template slot-scope="scope">
                <vue-qr :logoSrc="null" :text="scope.row.deviceCode" :size="80" v-focus :margin="0" :dotScale="1" :logoScale="20"></vue-qr>
              </template>
            </el-table-column>
            <el-table-column prop="bluetoothName" label="蓝牙名称">
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
            <el-table-column prop="address" label="操作" width="280">
              <template slot-scope="scope">
                <el-button size="mini" @click="buttonClick('edit',scope.row)" type="primary" :disabled="!pianoListPower[1].isCheck">编辑</el-button>
                <el-button size="mini" @click="buttonClick('watch',scope.row)" type="warning" :disabled="!pianoListPower[2].isCheck" >查看</el-button>
                <commonDel :id='[scope.row.id]' style="display: inline-block" :disabled="!pianoListPower[3].isCheck"></commonDel>
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
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id" :cell-class-name="delLine">
            <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="selectable">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="55">
            </el-table-column>
            <el-table-column prop="name" label="钢琴名称" width="180">
            </el-table-column>
            <el-table-column prop="state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2">下架</span>
              </template>
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
  import {getTotal,pageModuleMaterial} from "../../http/request";
  import nameInput from '../tools/nameInput'
  import huSelect from '../tools/huSelect'
  import cascader from '../../share/cascader'
  import timeNew from '../../share/timeNew'
  import pagination from '../../share/page'
  import commonDel from '../../share/commonDel'
  import QRCode from 'qrcode'
  import vueQr from 'vue-qr'
  import { mapState } from "vuex";
  export default {
        name: "pianoList",
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
        props:['type','selectArr','isSelectOne','appId'],
        computed:{
        ...mapState('currentUserPower',['pianoListPower']),
        },
  methods:{
            getTotal(){
              this.timeValue=(this.$route.query.time&&JSON.parse(this.$route.query.time));
              let msg={
                name:this.$route.query.search||'',
                materialCategoryId:this.$route.query.moduleTreeVal||'',
                pageNum:this.$route.query.page||1,
                pageSize:this.$route.query.limit||20,
                createTimeStart:this.timeValue?this.timeValue[0]:'',
                createTimeEnd:this.timeValue?this.timeValue[1]:'',
                module:108
              }
              console.log(msg,777777777)
              getTotal(msg).then(res=>{
                this.totalNum=res.data.total;
                this.tableData=res.data.items;
              })
            },
          change(){

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
            let msg={
              name:this.$refs.nameInput.reversedName,
              page:this.$refs.page.page,
              limit:this.$refs.page.limit,
              module:108,
              appId:this.appId||''
            }
            pageModuleMaterial(msg).then(res=>{
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
              page:this.$refs.page.page,
              limit:this.$refs.page.limit,
              module:108,
              appId:this.appId||''
            }
            pageModuleMaterial(msg).then(res=>{
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
          selectable(row, index) {
            return !row.isDel
          },
         delLine({ row, rowIndex}){
          if(row.isDel===1){
            return 'del_line_xu'
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
