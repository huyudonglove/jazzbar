<template>
  <div>
    <div>
      <div class="layoutD">
        <div class="leftD" id="myMinder">
          <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
          <el-button type="primary" style="position:absolute;right:10px;top:10px;" :disabled="true">确定</el-button>
        </div>
        <div class="rightD">
          <div v-if="isLook" style="width:100%;height:100%;position:absolute;left:0;top:40px;z-index:10;opacity:1;"></div>
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="组件"  name="first">
              <p class="font20">主节点</p>
              <el-button :disabled="true" type="primary" @click="addNode(1,'钢琴','钢琴',nodeData1,true,'')">钢琴</el-button>
            </el-tab-pane>
            <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
              <el-form ref="form" :model="nodeData" label-width="80px">
                <el-form-item label="名称" v-if="nodeData.name!==undefined">
                  <el-input v-model="nodeData.name" @input="change"></el-input>
                </el-form-item>
                <el-form-item label="选择分类" v-if="nodeData.materialCategoryId!==undefined">
                  <cascader  @changeVal="typeChange" :moduleId='108'  :queryMaterialId="nodeData.materialCategoryId" ref="filter" style="display: inline-block"></cascader>
                </el-form-item>
                <el-form-item label="钢琴编号" v-if="nodeData.deviceCode!==undefined">
                  <el-input v-model="nodeData.deviceCode" :disabled="true" placeholder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="编号二维码" v-if="nodeData.deviceCode!==undefined">
                  <el-image >
                    <div slot="error" >
                      自动生成
                    </div>
                  </el-image>
                </el-form-item>
                <el-form-item label="蓝牙名称" v-if="nodeData.bluetoothName!==undefined">
                  <el-input v-model="nodeData.bluetoothName"  placeholder="请输入蓝牙名称"></el-input>
                </el-form-item>
                <el-form-item label="状态" v-if="nodeData.state!==undefined">
<!--                  <huRadio :radio-value="nodeData.state"></huRadio>-->
                  <el-radio v-model="nodeData.state" label="1">上架</el-radio>
                  <el-radio v-model="nodeData.state" label="2">下架</el-radio>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
        钢琴列表
      </div>
      <div style="background:#f0f0f5;margin-top:10px">
      </div>
          <pianoList :type="`list`" @buttonClick="buttonClick" ref="pianoList"></pianoList>
    </div>
  </div>
</template>

<script>
  import {addTotal,editTotal,editMaterial,batchAddMaterial} from "../../http/request";
  import pagination from '../../share/pagination';
  import upLoad from '../../share/upLoad'
  import XUMinder from'../../util/XUMinder.js';
  import pianoList from './pianoList'
  import cascader from '../../share/cascader'
  import huRadio from '../tools/huRadio'
  import xFull from '../../share/xFull'
  var xuminder;
  export default {
    name: "piano",
    inject:['replace','reload'],
    components: {
      pagination,
      upLoad,
      pianoList,
      cascader,
      huRadio,
      xFull
    },
    data(){
      return{
        isLook:false,
        select:"",
        lineSelect:'',
        unitySelect:'',
        options:[],
        lineOptions:[],
        unityOptions:[],
        wd:"",
        dialogVisible:false,
        activeName: 'first',
        tableData:[],
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        nodeData:{},
        nodeData1:{
          name:'',
          materialCategoryId:'',
          bluetoothName:'',
          deviceCode:'',
          state:''
        },
        isPermitClick:false,
      }
    },
    created(){

    },
    computed:{

    },
    methods:{
      boxFull(){
      this.$refs.boxFull.full(document.getElementById('myMinder'))
    },
      addNode(step,name,type,data,isLastNode,music){
        xuminder.add(step,name,type,data,isLastNode,music);
      },
      change(val){
        xuminder.update(val,true);
      },
      buttonClick(key,obj){
          //console.log(key,val)
        this.isLook=key=='watch'?true:false;
        let tree={};
        tree.step=1;//1级
        tree.text=obj.name;
        tree.type='钢琴';
        tree.isLastNode=true;
        tree.data={
          "id":obj.id,
          "name":obj.name,
          "materialCategoryId":obj.materialCategoryId,
          "bluetoothName":obj.bluetoothName,
          "deviceCode":obj.deviceCode,
          "state":obj.state+'',
        };
        tree.children=[];
        xuminder.isLook=this.isLook;
        xuminder.draw([tree]);
      },
      openCallback(res){
        console.log(res.detail,'res.detail');
        this.activeName = 'second';
        this.nodeData = res.detail;
        this.isPermitClick=true;
      },
      closeCallback(res){
        this.activeName = 'first';
        this.nodeData = res.detail;
        this.isPermitClick=false;
      },
      typeChange(arr,val){
        this.nodeData.materialCategoryId=val;
      },
    },
    watch:{
    },
    updated(){

    },
    mounted(){
      xuminder = new XUMinder({renderTo:"#myMinder"});
      xuminder.on('open',this.openCallback)
      xuminder.on('close',this.closeCallback)
    },
    destroyed(){
      xuminder.remove('open',this.openCallback);
      xuminder.remove('close',this.closeCallback);
      xuminder=null;
    }
  };
</script>
<style>

</style>
<style scoped>

  .tac span {
    padding-left: 5px;
    padding-right: 10px;
  }
</style>
