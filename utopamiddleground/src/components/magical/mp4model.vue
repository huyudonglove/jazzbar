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
                <el-button type="primary" style="width:100px;" @click="addNode(1,'MP4模型','mp4',nodeData1,false,'gif')" :disabled="true">MP4模型</el-button>
                <p class="font20">素材节点</p>
                <el-button type="primary" style="width:100px;" @click="addNode(2,'资源素材','material',nodeData2,true,'video')" :disabled="true">资源素材</el-button>
              </el-tab-pane>
              <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
                <el-form ref="form" :model="nodeData" label-width="80px">
                  <el-form-item label="名称" v-if="nodeData.name!==undefined">
                    <el-input v-model="nodeData.name" @input="change"></el-input>
                  </el-form-item>
                  <el-form-item label="选择分类" v-if="nodeData.materialCategoryId!==undefined">
                    <cascader  @changeVal="typeChange" :moduleId='110' :queryMaterialId="nodeData.materialCategoryId" ref="filter " style="display: inline-block"></cascader>
                  </el-form-item>
                  <el-form-item label="GIF展示" v-if="nodeData.pic!==undefined">
                    <upLoad @getFileData="getImg" :name="nodeData.pic" type="gif/jpg"></upLoad>
                  </el-form-item>
                  <el-form-item label="状态" v-if="nodeData.state!==undefined">
                    <el-radio-group v-model="nodeData.state">
                      <el-radio :label="1">上架</el-radio>
                      <el-radio :label="2">下架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="文件" v-if="nodeData.androidMaterial!==undefined">
                    <upLoad @getFileData="getVideo" :name="nodeData.androidFileName" type="mp4"></upLoad>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
       </div>
       <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
       MP4模型列表
      </div>
        <!-- 数据展示 -->
        <mp4modelList :type="`list`" @editOrLook="edit" ref="mp4modelList" ></mp4modelList>
    </div>
    <div v-if="showPlay">
      <playDialog  :type="playType" :src="playSrc" @closePlay="showPlay=false"></playDialog>
    </div>
  </div>
</template>

<script>
import {getTotal,addMaterial,editMaterial,batchAddMaterial} from "../../http/request";
import upLoad from '../../share/upLoad';
import cascader from '../../share/cascader';
import mp4modelList from './mp4modelList';
import playDialog from '../../share/playDialog'
import xFull from '../../share/xFull'
var xuminder;
export default {
  name: "mp4model",
  inject:['replace','reload'],
  components: {
    upLoad,
    cascader,
    mp4modelList,
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
        pic:'',
        state:'',
      },
      nodeData2:{
        androidMaterial:'',
        androidFileName:'',
        androidResourcePackageSize:'',
        durationTime:''
      },
      showPlay:false
	  }
  },
  computed:{
  }, 
  methods:{
    boxFull(){
      this.$refs.boxFull.full(document.getElementById('myMinder'))
    },
    addNode(step,name,type,data,isLastNode,icon){
      console.log(data,'data111111')
      xuminder.add(step,name,type,data,isLastNode,icon);
      // for(var key in this.nodeData1){this.nodeData1[key]=''}//重置数据
      // for(var key in this.nodeData2){this.nodeData2[key]=''}
    },
    change(val){
      xuminder.update(val,true);
    },
    typeChange(arr,val){
      this.nodeData.materialCategoryId=val;
    },
    getImg(data){
      this.nodeData.pic=data.fileId;
    },
    playCallback(res){
      console.log(res.detail,1515);
      if(res.detail.nodeType=='look'){
        this.isLook=false;
        return;
      }
      if(res.detail.nodeType=='mp4'){
        if(!res.detail.pic){
          this.$message.error('未上传');
          return
        }
        this.playType='gif';
        this.playSrc='/static/'+Base64.decode(res.detail.pic);
        this.showPlay=true;
      }
      if(res.detail.nodeType=='material'){
        if(!res.detail.androidMaterial){
          this.$message.error('未上传');
          return
        }
        this.playType='video';
        this.playSrc='/static/'+Base64.decode(res.detail.androidMaterial);
        this.showPlay=true;
      } 
    },
    getVideo(data){
      xuminder.update(data.fileId?data.fileId:'');
      this.nodeData.androidFileName = data.name;
      this.nodeData.androidMaterial = data.fileId;
      this.nodeData.androidResourcePackageSize = data.size;
      this.nodeData.durationTime = data.duration;
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
    edit(obj,isLook=false){
      this.isLook=isLook;
      console.log(obj);
      let tree={};
      tree.step=1;//1级
      tree.text=obj.name;
      tree.type='mp4';
      tree.icon='gif';
      tree.color=true;
      tree.attrColor=true;
      tree.playColor=!!obj.pic;
      tree.data={
        "id":obj.id,
        "name":obj.name,
        "materialCategoryId":obj.materialCategoryId,
        "pic":obj.pic,
        "state":1
        
      };
      tree.children=obj.androidMaterial?tree.children=[{//2级
        "step":2,
        "text":'资源素材',
        "type":'material',
        "isLastNode":true,
         "icon":'video',
         "color":true,
         "attrColor":true,
        "playColor":true,
         "warning":!!obj.isDel,
        "data":{
          "androidMaterial":obj.androidMaterial,
          "androidFileName":obj.androidFileName,
          "androidResourcePackageSize":obj.androidResourcePackageSize,
          "durationTime":obj.durationTime
        },
        "children":[]
      }]:[]
      xuminder.isLook=isLook;
      xuminder.draw([tree]);
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
        var data2 = v.children[0]?v.children[0].data:{};//2级节点数据
        var msg={};
        data1.id?msg.id=data1.id:null;//判断id
        msg.name=data1.name;
        msg.materialCategory=110;
        msg.materialCategoryId=data1.materialCategoryId?data1.materialCategoryId:'';
        msg.pic=data1.pic?data1.pic:'';
        msg.state=data1.state?data1.state:'1';
        msg.androidMaterial=data2.androidMaterial?data2.androidMaterial:'';
        msg.androidFileName=data2.androidFileName?data2.androidFileName:'';
        msg.androidResourcePackageSize=data2.androidResourcePackageSize?data2.androidResourcePackageSize:'';
        msg.durationTime=data2.durationTime?data2.durationTime:'';
        //增加字段
        msg.iosMaterial=data2.androidMaterial?data2.androidMaterial:'';
        msg.iosFileName=data2.androidFileName?data2.androidFileName:'';
        msg.iosResourcePackageSize=data2.androidResourcePackageSize?data2.androidResourcePackageSize:'';
        msg.windowsMaterial=data2.androidMaterial?data2.androidMaterial:'';
        msg.windowsFileName=data2.androidFileName?data2.androidFileName:'';
        msg.windowsResourcePackageSize=data2.androidResourcePackageSize?data2.androidResourcePackageSize:'';
        list.push(msg);
      })
      console.log(list,'list')
      this.$confirm('确定保存吗').then(y=>{
        if(list[0].id){//是否编辑将第一个编辑后面的新增
        editMaterial(list[0]).then(res=>{
          this.$message.success(res.msg);
          this.$refs.mp4modelList.getTotal();
        })
        var newList = list.slice(1);
        if(!newList.length){return}
        batchAddMaterial({"list":newList}).then(res=>{
          this.$message.success(res.msg);
          this.$refs.mp4modelList.getTotal();
        })
      }else{
        batchAddMaterial({list}).then(res=>{
          this.$message.success(res.msg);
          this.$refs.mp4modelList.getTotal();
        })
      }
      })
    },
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
</style>