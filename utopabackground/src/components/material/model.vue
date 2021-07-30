<template>
  <div>
    <div>
      <div class="layoutD">
        <div class="leftD" id="myMinder">
          <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
          <el-button type="primary" style="position:absolute;right:10px;top:10px;" @click="add" v-if="modelPower.length" :disabled="isLook">确定</el-button>
        </div>
        <div class="rightD">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="组件"  name="first" v-if="modelPower.length" >
              <p class="font20">主节点</p>
              <el-button type="primary" @click="addNode({step:1,text:'模型',type:'model',data:nodeData1,icon:'img'})" style="width:100px;" :disabled="isLook||!modelPower[0].isCheck">模型</el-button>
              <p class="font20">素材节点</p>
              <p>
                <el-button type="primary" @click="addNode({step:2,text:'Android',type:'android',data:nodeData2,isLastNode:true})" style="width:100px;" :disabled="isLook||!modelPower[0].isCheck">Android</el-button>
                <el-button type="primary" @click="addNode({step:2,text:'IOS',type:'ios',data:nodeData2,isLastNode:true})" style="width:100px;" :disabled="isLook||!modelPower[0].isCheck">IOS</el-button>
              </p>
              <p>
                <el-button type="primary" @click="addNode({step:2,text:'UWP',type:'uwp',data:nodeData2,isLastNode:true})" style="width:100px;" :disabled="isLook||!modelPower[0].isCheck">UWP</el-button>
                <el-button type="primary" @click="addNode({step:2,text:'Windows',type:'windows',data:nodeData2,isLastNode:true})" style="width:100px;" :disabled="isLook||!modelPower[0].isCheck">Windows</el-button>
              </p>
            </el-tab-pane>
            <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='android'">Android</div>
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='ios'">IOS</div>
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='uwp'">UWP</div>
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='windows'">Windows</div>
              <el-form ref="form" :model="nodeData" label-width="80px">
                <el-form-item label="名称" v-if="nodeData.name!==undefined" required>
                  <el-input v-model="nodeData.name" @change="change" :maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="选择分类" v-if="nodeData.materialCategoryId!==undefined" required>
                  <cascader  @changeVal="typeChange" :moduleId='103'  :queryMaterialId="nodeData.materialCategoryId" ref="filter" style="display: inline-block"></cascader>
                </el-form-item>
                <el-form-item label="预览图展示" v-if="nodeData.pic!==undefined">
                  <upLoad @getFileData="getPic" :name="nodeData.pic" type="jpg/png"></upLoad>
                </el-form-item>
                <el-form-item label="状态" v-if="nodeData.state!==undefined">
                  <el-radio-group v-model="nodeData.state" @change="msgWarn(nodeData.state)">
                    <el-radio :label="1">上架</el-radio>
                    <el-radio :label="2">下架</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="素材" v-if="nodeData.Material!==undefined" required>
                  <upLoad @getFileData="getMaterial" :name="nodeData.materialName" type="utopa"></upLoad>
                </el-form-item>
                <el-form-item label="Unity版本" v-if="nodeData.unityVersion!==undefined" required>
                  <huSelect :type="`unity`" :value="nodeData.unityVersion" ref="unity" @change="unityChange"></huSelect>
                </el-form-item>
                <el-form-item label="渲染管线" v-if="nodeData.loadingLine!==undefined" required>
                  <huSelect :type="`pipeline`" :value="nodeData.loadingLine" ref="pipeline" @change="lineChange"></huSelect>
                </el-form-item>
              </el-form>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>
      <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
        普通模型列表
      </div>
      <div style="background:#f0f0f5;margin-top:10px">
      </div>
      <modelList :type="`list`" @buttonClick="buttonClick" ref="modelList"></modelList>
    </div>
    <div v-if="showPlay">
      <playDialog type="gif" :src="playSrc" @closePlay="showPlay=false"></playDialog>
    </div>
  </div>
</template>

<script>
  import {addTotal,editTotal,editMaterial,batchAddMaterial} from "../../http/request";
  import { mapState, mapActions } from "vuex";
  import pagination from '../../share/pagination';
  import upLoad from '../../share/upLoad'
  import XUMinder from'../../util/XUMinder.js';
  import modelList from './modelList'
  import cascader from '../../share/cascader'
  import huSelect from '../tools/huSelect'
  import playDialog from '../../share/playDialog'
  import xFull from '../../share/xFull'
  var xuminder;
  export default {
    name: "model",
    inject:['replace','reload'],
    components: {
      pagination,
      upLoad,
      modelList,
      cascader,
      huSelect,
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
        },
        nodeData2:{
          Material:'',
          materialName:'',
          materialSize:'',
          unityVersion:'',
          loadingLine:''
        },
        isPermitClick:false,
        isLook:false,
        showPlay:false,
        playSrc:'',
        type:''
      }
    },
    created(){

    },
    computed:{
      nodeColor2(){//2级节点必填项判断决定颜色true or false
        return this.nodeData.Material&&this.nodeData.unityVersion&&this.nodeData.loadingLine
      },
      ...mapState('currentUserPower',['modelPower']),
      nodeColor1(){
        return this.nodeData.name&&this.nodeData.materialCategoryId
      },
      attrColor(){//节点属性图标颜色判断
        for(var key in this.nodeData){
          if(this.nodeData[key]!=='') return true;
        }
        return false;
      }
    },
    methods:{
      addNode(obj){
        if(this.isLook){
          xuminder.clear();
          xuminder.isLook=this.isLook=false;
        }
        xuminder.add(obj);
      },
      change(val){
        var obj={};
        obj.text=val;
        obj.word=true;
        obj.color=this.nodeColor1;
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      add(){
        this.$refs.boxFull.exitFull();
        let treeData = xuminder.treeData;//节点树
        console.log(treeData,'treeData')
        if(!treeData.length){//没有数据
          return;
        }
        //多个主节点
        if(treeData.some(v=>!v.data.name)){this.$message.warning('温馨提示:还有节点未编辑');return;}
        if(treeData.some(v=>!v.data.materialCategoryId)){this.$message.warning('温馨提示:还有节点未编辑');return;}
        let repeat=false;
        treeData.forEach(v=>{
          let apple=[];
          v.children.map(s=>{
            apple.push(s.type)
          })
          var nary = apple.sort();
          for(var i = 0; i < nary.length - 1; i++) {
            if(nary[i] == nary[i + 1]) {
              repeat =true
            }
          }
        })
        if(repeat){
          this.$message.error('不能同时连接多个相同节点')
          return;;
        }
        let allObject = xuminder.allObject;//所有节点（包含未连接主节点）
        for(var key in allObject){
          if(allObject[key]&&!allObject[key].color){
            this.$message.warning('温馨提示:还有节点未编辑');return;
          }
        }
        // if(treeData.some(v=>v.children.some(two=>!two.data.Material))){
        //   this.$message.error('请上传素材包');return;
        // }
        // if(treeData.some(v=>v.children.some(two=>!two.data.unityVersion))){
        //   this.$message.error('请选择Unity版本');return;
        // }
        // if(treeData.some(v=>v.children.some(two=>!two.data.loadingLine))){
        //   this.$message.error('请选择渲染管道');return;
        // }
        let list =[];
        treeData.forEach(v=>{
          var data1 = v.data;//1级节点数据
          var msg={};
          data1.id?msg.id=data1.id:null;//判断id
          msg.name=data1.name;
          msg.materialCategory=103;
          msg.materialCategoryId=data1.materialCategoryId||'';
          msg.pic=data1.pic||'';
          msg.state=data1.state||'1';
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
              this.$refs.modelList.getTotal();
            })
            var newList = list.slice(1);
            if(!newList.length){return}
            batchAddMaterial({"list":newList}).then(res=>{
              this.$message.success(res.msg);
              this.$refs.modelList.getTotal();
            })
          }else{
            batchAddMaterial({list}).then(res=>{
              this.$message.success(res.msg);
              this.$refs.modelList.getTotal();
            })
          }
        })
      },
      openCallback(res){
        console.log(res.detail,'res.detail');
        this.activeName = 'second';
        this.nodeData = res.detail;
        this.isPermitClick=true;
        this.type = xuminder.currentNodeType;
      },
      closeCallback(res){
        this.activeName = 'first';
        this.nodeData = res.detail;
        this.isPermitClick=false;
      },
      typeChange(arr,val){
        this.nodeData.materialCategoryId=val;
        var obj ={};
        obj.color=!!this.nodeColor1;
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      unityChange(key,val){
        console.log(key,val,777777777)
        this.nodeData.unityVersion =val?val:'';
        var obj ={};
        obj.color=!!this.nodeColor2;
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      lineChange(key,val){
        this.nodeData.loadingLine =val?val:'';
        var obj ={};
        obj.color=!!this.nodeColor2;
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
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
        this.nodeData.materialName = data.name;
        this.nodeData.Material = data.fileId;
        this.nodeData.materialSize = data.size;
        var obj ={};
        obj.color=!!this.nodeColor2;
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      buttonClick(key,obj){
        //console.log(key,val)
        this.isLook=key=='watch'?true:false;
        let tree={};
        tree.step=1;//1级
        tree.text=obj.name;
        tree.type='动画音乐';
        tree.icon='img';
        tree.color=true;
        tree.attrColor=true;
        tree.playColor=!!obj.pic;
        tree.data={
          "id":obj.id,
          "name":obj.name,
          "materialCategoryId":obj.materialCategoryId,
          "pic":obj.pic,
          "state":obj.state
        };
        let androidNode=obj.androidMaterial?{//判断是否有安卓素材包生成节点
          "step":2,
          "text":'Android',
          "type":'android',
          "isLastNode":true,
          color:true,
          "attrColor":true,
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
          color:true,
          "isLastNode":true,
          "attrColor":true,
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
          color:true,
          "isLastNode":true,
          "attrColor":true,
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
          color:true,
          "isLastNode":true,
          "attrColor":true,
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
      playCallback(res){
        console.log(res,454)
        if(res.detail.nodeType=='look'){
          this.isLook=false;
          return;
        }
        if(res.detail.pic){
          this.playSrc='/static/'+Base64.decode(res.detail.pic);
          this.showPlay=true;
        }else {
          this.$message.error('未上传')
          return
        }
      },
      msgWarn(state){
        let word;
        state==1?word='上架':word='下架';

        this.$confirm(`确认${word}吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res=>{
         this.stateChange()
        })).catch(()=>{
          this.nodeData.state==1?this.nodeData.state='2':this.nodeData.state='1';
        })
      },
      stateChange(val){
      var obj ={};
      obj.attrColor=this.attrColor;
      xuminder.update(obj);
    },
      boxFull(){
        this.$refs.boxFull.full(document.getElementById('myMinder'))
      }
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
