<template>
  <div>
    <div>
      <div class="layoutD">
        <div class="leftD" id="myMinder">
          <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
          <el-button type="primary" style="position:absolute;right:10px;top:10px;" @click="add" :disabled="true">确定</el-button>
        </div>
        <div class="rightD">
          <div v-if="isLook" style="width:100%;height:100%;position:absolute;left:0;top:40px;z-index:10;opacity:1;"></div>
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="组件"  name="first">
              <p class="font20">主节点</p>
              <el-button type="primary" @click="addNode(1,'动画音乐','动画音乐',nodeData1,false,'','')" :disabled="true">动画音乐</el-button>
              <p class="font20">素材节点</p>
                <p>
                  <el-button type="primary" @click="addNode(2,'Android','android',nodeData2,true,'')" :disabled="true">Android</el-button>
                  <el-button type="primary" @click="addNode(2,'IOS','ios',nodeData2,true,'')" :disabled="true">IOS</el-button>
                </p>
                <p>
                  <el-button type="primary" @click="addNode(2,'UWP','uwp',nodeData2,true,'')" :disabled="true">UWP</el-button>
                  <el-button type="primary" @click="addNode(2,'Windows','windows',nodeData2,true,'')" :disabled="true">WINDOWS</el-button>
                </p>
            </el-tab-pane>
            <el-tab-pane label="属性" :disabled="!isPermitClick"   name="second">
              <el-form ref="form" :model="nodeData" label-width="80px">
                <el-form-item label="名称" v-if="nodeData.name!==undefined">
                  <el-input v-model="nodeData.name" @change="change"></el-input>
                </el-form-item>
                <el-form-item label="选择分类" v-if="nodeData.materialCategoryId!==undefined">
                  <cascader  @changeVal="typeChange" :moduleId='109'  :queryMaterialId="nodeData.materialCategoryId" ref="filter" style="display: inline-block"></cascader>
                </el-form-item>
                <el-form-item label="GIF展示" v-if="nodeData.pic!==undefined">
                  <upLoad @getFileData="getPic" :name="nodeData.pic" type="gif"></upLoad>
                </el-form-item>
                <el-form-item label="音乐文件" v-if="nodeData.fileId!==undefined">
                  <upLoadM @getFileData="getVideo" :name="nodeData.fileName" type="mp3/mid"></upLoadM>
                </el-form-item>
                <el-form-item label="状态" v-if="nodeData.state!==undefined">
                  <el-radio-group v-model="nodeData.state">
                    <el-radio label="1">上架</el-radio>
                    <el-radio label="2">下架</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="素材" v-if="nodeData.Material!==undefined">
                  <upLoad @getFileData="getMaterial" :name="nodeData.materialName" type="utopa"></upLoad>
                </el-form-item>
                <el-form-item label="Unity版本" v-if="nodeData.unityVersion!==undefined">
                  <huSelect :type="`unity`" :value="nodeData.unityVersion" ref="unity" @change="unityChange"></huSelect>
                </el-form-item>
                <el-form-item label="渲染管线" v-if="nodeData.loadingLine!==undefined">
                  <huSelect :type="`pipeline`" :value="nodeData.loadingLine" ref="pipeline" @change="lineChange"></huSelect>
                </el-form-item>
              </el-form>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>
      <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
        动画音乐列表
      </div>
      <div style="background:#f0f0f5;margin-top:10px">
      </div>
      <cartoonmusicList :type="`list`" ref="cartoonmusicList" @buttonClick="buttonClick"></cartoonmusicList>
    </div>
     <div v-if="showPlay">
      <playDialog  type="gif" :src="playSrc" @closePlay="showPlay=false"></playDialog>
    </div>
  </div>
</template>

<script>
  import {addTotal,editTotal,editMaterial,batchAddMaterial} from "../../http/request";
  import { mapState, mapActions } from "vuex";
  import pagination from '../../share/pagination';
  import upLoadM from '../../share/upLoadM'
  import XUMinder from'../../util/XUMinder.js';
  import cartoonmusicList from './cartoonmusicList'
  import cascader from '../../share/cascader'
  import huSelect from '../tools/huSelect'
  import upLoad from '../../share/upLoad'
  import playDialog from '../../share/playDialog'
  import xFull from '../../share/xFull'
  var xuminder;
  export default {
    name: "cartoonmusic",
    inject:['replace','reload'],
    components: {
      pagination,
      upLoad,
      cartoonmusicList,
      cascader,
      huSelect,
      upLoadM,
      playDialog,
      xFull
    },
    data(){
      return{
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
          pic:'',
          picName:'',
          state:'',
          fileId:'',
          fileName:'',
          durationTime:'',
          materialFormat:'',

        },
        nodeData2:{
          Material:'',
          materialName:'',
          materialSize:'',
          unityVersion:'',
          loadingLine:''
        },
        isPermitClick:true,
        isLook:false,
        showPlay:false
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
      addNode(step,name,type,data,isLastNode,icon){
        xuminder.add(step,name,type,data,isLastNode,icon);
      },
      change(val){
        xuminder.update(val,true);
      },
      add(){
        let treeData = xuminder.treeData;//节点树
        console.log(treeData,'treeData')
        if(!treeData.length){//没有数据
          return;
        }
        //多个主节点
        if(treeData.some(v=>!v.data.name)){this.$message.error('请填写主节点名称');return;}
        let list =[];
        treeData.forEach(v=>{
          var data1 = v.data;//1级节点数据
          var msg={};
          data1.id?msg.id=data1.id:null;//判断id
          msg.name=data1.name;
          msg.materialCategory=109;
          msg.materialCategoryId=data1.materialCategoryId||'';
          msg.pic=data1.pic||'';
          msg.state=data1.state||'1';
          msg.fileId=data1.fileId||'';
          msg.fileName=data1.fileName;
          msg.durationTime=data1.durationTime;
          msg.materialFormat=data1.materialFormat;
          v.children.forEach(u=>{
            msg[u.type+'Material']=u.data.Material||'';
            msg[u.type+'FileName']=u.data.materialName||'';
            msg[u.type+'ResourcePackageSize']=u.data.materialSize||'';
            msg[u.type+'UnityVersion']=u.data.unityVersion||'';
            msg[u.type+'LoadingLine']=u.data.loadingLine||'';
          })
          list.push(msg);
        })
        console.log(list,'list')
        // return
        this.$confirm(`确认保存吗`).then(y=>{
          if(list[0].id){//是否编辑将第一个编辑后面的新增
            editMaterial(list[0]).then(res=>{
              this.$message.success(res.msg);
              this.$refs.carrierModelTable.getTotal();
            })
            var newList = list.slice(1);
            if(!newList.length){return}
            batchAddMaterial({"list":newList}).then(res=>{
              this.$message.success(res.msg);
              this.$refs.cartoonmusicList.getTotal();
            })
          }else{
            batchAddMaterial({list}).then(res=>{
              this.$message.success(res.msg);
              this.$refs.cartoonmusicList.getTotal();
            })
          }
        })
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
      unityChange(key,val){
        console.log(key,val,777777777)
        this.nodeData.unityVersion =val?val:'';
      },
      lineChange(key,val){
        this.nodeData.loadingLine =val?val:'';
      },
      getPic(data){
        this.nodeData.pic=data.fileId;
      },
      getVideo(data){
        this.nodeData.fileId=data.fileId;
        this.nodeData.fileName=data.originFileName;
        this.nodeData.durationTime=data.durationTime;
        this.nodeData.materialFormat=data.materialFormat;
      },
      getMaterial(data){
        xuminder.update(data.fileId?data.fileId:'');
        this.nodeData.materialName = data.name;
        this.nodeData.Material = data.fileId;
        this.nodeData.materialSize = data.size;
      },
      playCallback(res){
        if(res.detail.nodeType=='look'){
        this.isLook=false;
        return;
      }
        if(!res.detail.pic){
          this.$message.error('未上传');
          return
        }
        this.playSrc='/static/'+Base64.decode(res.detail.pic);
        this.showPlay=true;
    },
      buttonClick(key,obj,isLook=false){
        //console.log(key,val)
        this.isLook=key=='watch'?true:false;
        let tree={};
        tree.step=1;//1级
        tree.text=obj.name;
        tree.type='动画音乐';
        tree.icon='gif';
        tree.attrColor=true;
        tree.playColor=!!obj.pic;
        tree.color=true
        tree.data={
          "id":obj.id,
          "name":obj.name,
          "materialCategoryId":obj.materialCategoryId,
          "pic":obj.pic,
          "state":obj.state+'',
          "fileId":obj.fileId,
          "filedName":obj.filedName,
          "durationTime":obj.durationTime,
          "materialFormat":obj.materialFormat
        };
        let androidNode=obj.androidMaterial?{//判断是否有Android素材包生成节点
          "step":2,
          "text":'Android',
          "type":'android',
          "isLastNode":true,
          "color":true,
          "attrColor":true,
          "warning":!!obj.isDel,
          "data":{
            "Material":obj.androidMaterial,
            "materialName":obj.androidFileName,
            "materialSize":obj.androidResourcePackageSize,
            "unityVersion":obj.androidUnityVersion,
            "loadingLine":obj.androidLoadingLine
          },
          "children":[]
        }:null;
        let iosNode=obj.iosMaterial?{//判断是否有ios素材包生成节点
          "step":2,
          "text":'IOS',
          "type":'ios',
          "isLastNode":true,
          "color":true,
          "attrColor":true,
          "warning":!!obj.isDel,
          "data":{
            "Material":obj.iosMaterial,
            "materialName":obj.iosFileName,
            "materialSize":obj.iosResourcePackageSize,
            "unityVersion":obj.iosUnityVersion,
            "loadingLine":obj.iosLoadingLine
          },
          "children":[]
        }:null;
        let uwpNode=obj.uwpMaterial?{//判断是否有uwp素材包生成节点
          "step":2,
          "text":'UWP',
          "type":'uwp',
          "isLastNode":true,
          "color":true,
          "attrColor":true,
          "warning":!!obj.isDel,
          "data":{
            "Material":obj.uwpMaterial,
            "materialName":obj.uwpFileName,
            "materialSize":obj.uwpResourcePackageSize,
            "unityVersion":obj.uwpUnityVersion,
            "loadingLine":obj.uwpLoadingLine
          },
          "children":[]
        }:null;
        let windowsNode=obj.windowsMaterial?{//判断是否有windows素材包生成节点
          "step":2,
          "text":'Windows',
          "type":'windows',
          "isLastNode":true,
          "color":true,
          "attrColor":true,
          "warning":!!obj.isDel,
          "data":{
            "Material":obj.windowsMaterial,
            "materialName":obj.windowsFileName,
            "materialSize":obj.windowsResourcePackageSize,
            "unityVersion":obj.windowsUnityVersion,
            "loadingLine":obj.windowsLoadingLine
          },
          "children":[]
        }:null;
        tree.children=[];
        androidNode?tree.children.push(androidNode):null;
        iosNode?tree.children.push(iosNode):null;
        uwpNode?tree.children.push(uwpNode):null;
        windowsNode?tree.children.push(windowsNode):null;
        xuminder.isLook=this.isLook;
        xuminder.draw([tree]);
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
      xuminder.on('play',this.playCallback);
    },
    destroyed(){
      xuminder.remove('open',this.openCallback);
      xuminder.remove('close',this.closeCallback);
      xuminder.remove('play',this.playCallback);
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
