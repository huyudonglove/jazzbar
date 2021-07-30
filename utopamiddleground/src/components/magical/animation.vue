<template>
  <div>
      <div>
       <div class="layoutD">
          <div class="leftD" id="myMinder">
            <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
            <el-button type="primary" style="position:absolute;right:10px;top:10px;" @click="add" :disabled="isLook">确定</el-button>
          </div>
          <div class="rightD">
            <div v-if="isLook" style="width:100%;height:100%;position:absolute;left:0;top:40px;z-index:10;opacity:1;"></div>
              <el-tabs type="border-card" v-model="activeName">
              <el-tab-pane label="组件"  name="first">
                <p class="font20">主节点</p>
                <el-button type="primary"  style="width:100px;"  @click="addNode({step:1,text:'动画',type:'动画',data:nodeData1,isLastNode:false,icon:'gif'})" :disabled="true">动画</el-button>
                <p class="font20">素材节点</p>
                <el-button style="width:100px;"  type="primary" @click="addNode({step:2,text:'Android',type:'android',data:nodeData2,isLastNode:true,icon:''})" :disabled="true">Android</el-button>
                <el-button type="primary" style="width:100px;"   @click="addNode({step:2,text:'IOS',type:'ios',data:nodeData2,isLastNode:true,icon:''})" :disabled="true">IOS</el-button>
                <p>
                  <el-button type="primary" style="width:100px;"  @click="addNode({step:2,text:'UWP',type:'uwp',data:nodeData2,isLastNode:true,icon:''})" :disabled="true">UWP</el-button>
                  <el-button type="primary"  style="width:100px;"  @click="addNode({step:2,text:'Windows',type:'windows',data:nodeData2,isLastNode:true,icon:''})" :disabled="true">Windows</el-button>
                </p>
              </el-tab-pane>
              <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
                <el-form ref="form" :model="nodeData" label-width="90px">
                  <el-form-item label="名称" v-if="nodeData.name!==undefined" required>
                    <el-input v-model="nodeData.name" @input="change"></el-input>
                  </el-form-item>
                  <el-form-item label="选择分类" v-if="nodeData.materialCategoryId!==undefined" required>
                    <cascader  @changeVal="typeChange" :moduleId='101' :queryMaterialId="nodeData.materialCategoryId" ref="filter " style="display: inline-block"></cascader>
                  </el-form-item>
                  <el-form-item label="动画类型" v-if="nodeData.viewType!==undefined" required>
                    <huSelect :type="`animation`" :value="nodeData.viewType" ref="animation" @change="animationChange"></huSelect>
                  </el-form-item>
                  <el-form-item label="GIF展示" v-if="nodeData.pic!==undefined">
                    <upLoad @getFileData="getPic" :name="nodeData.pic" type="gif"></upLoad>
                  </el-form-item>
                  <el-form-item label="状态" v-if="nodeData.state!==undefined">
                    <el-radio-group v-model="nodeData.state" @change="msgWarn(nodeData.state)">
                      <el-radio :label="1">上架</el-radio>
                      <el-radio :label="2">下架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='android'">Android</div>
                  <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='IOS'">IOS</div>
                  <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='UWP'">UWP</div>
                  <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='Windows'">Windows</div>
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
       动画列表
      </div>
        <animationList type="list" @editOrLook="edit" ref="animationList"></animationList>
    </div>
     <div v-if="showPlay">
      <playDialog type="gif" :src="playSrc" @closePlay="showPlay=false"></playDialog>
    </div>
  </div>
</template>

<script>
import {getTotal,addMaterial,editMaterial,batchAddMaterial} from "../../http/request";
import { mapState, mapActions } from "vuex";
import page from '../../share/page';
import upLoad from '../../share/upLoad';
import cascader from '../../share/cascader';
import huSelect from '../tools/huSelect';
import animationList from './animationList';
import playDialog from '../../share/playDialog'
import xFull from '../../share/xFull'
var xuminder;
export default {
  name: "animation",
  inject:['replace','reload'],
  components: {
    page,
    upLoad,
    cascader,
    huSelect,
    animationList,
    playDialog,
    xFull
  },
  data(){
	  return{
      activeName: 'first',
      isLook:false,
      isPermitClick:false,//能否点击属性切换
      nodeData:{},
      nodeData1:{
        name:'',
        materialCategoryId:'',
        viewType:'',
        pic:'',
        state:'',
      },
      nodeData2:{
        Material:'',
        materialName:'',
        materialSize:'',
        unityVersion:'',
        loadingLine:''
      },
      type:'',
      showPlay:false,
      playSrc:'',
      loading:null,
	  }
  },
  computed:{
    ...mapState('currentUserPower',['scenePower']),
     nodeColor1(){//节点1必填项判断决定颜色true or false
      return this.nodeData.name&&this.nodeData.materialCategoryId&&this.nodeData.viewType
    },
    nodeColor2(){//2级节点必填项判断决定颜色true or false
      return this.nodeData.Material&&this.nodeData.unityVersion&&this.nodeData.loadingLine
    },
    attrColor(){//节点属性图标颜色判断
      for(var key in this.nodeData){
        if(this.nodeData[key]!=='') return true;
      }
      return false;
    }
  },
  created(){

  },
  methods:{
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
    addNode(obj){
      if(this.isLook){
        xuminder.clear();
        xuminder.isLook=this.isLook=false;
      }
      xuminder.add(obj);
      // this.type=name.toLowerCase()
    },
    change(val){
      var obj ={};
      obj.text=val;
      obj.word=true;
      obj.color=!!this.nodeColor1;
      obj.attrColor=this.attrColor;
      xuminder.update(obj);
    },
    typeChange(arr,val){
      this.nodeData.materialCategoryId=val;
      var obj ={};
      obj.color=!!this.nodeColor1;
      obj.attrColor=this.attrColor;
      xuminder.update(obj);
    },
    animationChange(key,val){
      this.nodeData.viewType=val?val:'';
      var obj ={};
      obj.color=!!this.nodeColor1;
      obj.attrColor=this.attrColor;
      xuminder.update(obj);
    },
    unityChange(key,val){
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
      var obj ={};
      obj.playColor=!!data.fileId;
      obj.attrColor=this.attrColor;
      xuminder.update(obj);
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
    openCallback(res){
      console.log(res.detail,'res.detail');
      this.activeName = 'second';
      this.nodeData = res.detail;
      this.isPermitClick=true;
      this.type = xuminder.currentNodeType;
      console.log(xuminder)
    },
    closeCallback(res){
      this.activeName = 'first';
      this.nodeData = res.detail;
      this.isPermitClick=false;
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
    edit(obj,isLook=false){
      this.isLook=isLook;
      let tree={};
      tree.step=1;//1级
      tree.text=obj.name;
      tree.type='动画';
      tree.icon='gif';
      tree.color=true;
      tree.attrColor=true;
      tree.playColor=!!obj.pic;
      tree.data={
        "id":obj.id,
        "name":obj.name,
        "materialCategoryId":obj.materialCategoryId,
        "viewType":obj.viewType,
        "pic":obj.pic,
        "state":obj.state
      };
      let androidNode=obj.androidMaterial?{//判断是否有Android素材包生成节点
        "step":2,
        "text":'Android',
        "type":'android',
        "isLastNode":true,
        "color":true,
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
        "isLastNode":true,
        "color":true,
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
        "isLastNode":true,
        "color":true,
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
        "isLastNode":true,
        "color":true,
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
      xuminder.isLook=isLook;
      xuminder.draw([tree]);
    },
    add(){
      this.$refs.boxFull.exitFull();
      let treeData = xuminder.treeData;//节点树
      console.log(treeData,'treeData')
      if(!treeData.length){//没有数据
        return;
      }
      //多个主节点
      let allObject = xuminder.allObject;//所有节点（包含未连接主节点）
      for(var key in allObject){
        if(allObject[key]&&!allObject[key].color){
          this.$message.warning('温馨提示:还有节点未编辑');return;
        }
      }
      // if(treeData.some(v=>!v.data.name)){this.$message.error('请填写主节点名称');return;}
      // if(treeData.some(v=>!v.data.materialCategoryId)){this.$message.error('请选择主节点分类');return;}
      // if(treeData.some(v=>!v.data.viewType)){this.$message.error('请选择主节点动画类型');return;}
      if(treeData.some(v=>{
        var typeArr =v.children.map(two=>two.type);
        return typeArr.length>Array.from(new Set(typeArr)).length
        })){
        this.$message.error('一个主节点只能连接一个同一类型素材节点');return;
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
        msg.materialCategory=101;
        msg.materialCategoryId=data1.materialCategoryId||'';
        msg.viewType=data1.viewType||'';
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
      this.$confirm('确定保存吗').then(y=>{
        this.loading=this.$loading({
          lock: true,
          text: `数据保存中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(list[0].id){//是否编辑将第一个编辑后面的新增
        editMaterial(list[0]).then(res=>{
          this.$message.success(res.msg);
          this.$refs.animationList.getTotal();
          this.loading.close();
        })
        var newList = list.slice(1);
        if(!newList.length){return}
        batchAddMaterial({"list":newList}).then(res=>{
          this.$message.success(res.msg);
          this.$refs.animationList.getTotal();
          this.loading.close();
        })
      }else{
        batchAddMaterial({list}).then(res=>{
          this.$message.success(res.msg);
          this.$refs.animationList.getTotal();
          this.loading.close();
        })
      }
      })
    },
  boxFull(){
    this.$refs.boxFull.full(document.getElementById('myMinder'))
  }
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
