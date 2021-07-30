<template>
  <div>
      <div>
       <div class="layoutD">
          <div class="leftD" id="myMinder">
            <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
            <el-button type="primary" style="position:absolute;right:10px;top:10px;" @click="add" :disabled="isLook">确定</el-button>
          </div>
          <div class="rightD">
            <el-tabs type="border-card" v-model="activeName">
              <div v-if="isLook" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:10;opacity:1;"></div>
              <el-tab-pane label="组件" v-if="videoPower.length"  name="first">
                <p class="font20">主节点</p>
                <el-button style="width:100px;" type="primary" :disabled="!videoPower[0].isCheck" @click="addNode({step:1,text:'MP4视频',type:'mp4',data:nodeData1,isLastNode:false,icon:'gif'})">MP4视频</el-button>
                <p class="font20">素材节点</p>
                <el-button style="width:100px;" type="primary" :disabled="!videoPower[0].isCheck" @click="addNode({step:2,text:'视频',type:'video',data:nodeData2,isLastNode:true,icon:'video'})">视频</el-button>
              </el-tab-pane>
              <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
                <el-form ref="form" :model="nodeData" label-width="80px">
                  <el-form-item label="名称" v-if="nodeData.name!==undefined" required>
                    <el-input v-model="nodeData.name" @input="change" maxlength="15"></el-input>
                  </el-form-item>
                  <el-form-item label="选择分类" v-if="nodeData.materialCategoryId!==undefined" required>
                    <cascader @changeVal="typeChange" :moduleId='107' :queryMaterialId="nodeData.materialCategoryId" ref="filter " style="display: inline-block"></cascader>
                  </el-form-item>
                  <el-form-item label="GIF展示" v-if="nodeData.pic!==undefined">
                    <upLoad @getFileData="getImg" :name="nodeData.pic" type="gif"></upLoad>
                  </el-form-item>
                  <el-form-item label="状态" v-if="nodeData.state!==undefined">
                    <el-radio-group v-model="nodeData.state" @change="stateChange">
                      <el-radio :label="1">上架</el-radio>
                      <el-radio :label="2">下架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="视频文件" v-if="nodeData.androidMaterial!==undefined" required>
                    <upLoad @getFileData="getVideo" :name="nodeData.androidFileName" type="mp4"></upLoad>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
       </div>
       <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
       MP4视频管理
      </div>
      <mp4videoTable type="list" @editOrLook="edit" ref="mp4videoTable"></mp4videoTable>
    </div>
    <div v-if="showPlay">
      <playDialog :type="playType" :src="playSrc" @closePlay="showPlay=false"></playDialog>
    </div>
  </div>
</template>

<script>
import {getTotal,addMaterial,editMaterial,batchAddMaterial} from "../../http/request";
import mp4videoTable from '../materialTable/mp4videoTable';
import upLoad from '../../share/upLoad';
import cascader from '../../share/cascader';
import playDialog from '../../share/playDialog'
import {mapState} from 'vuex';
import { Base64 } from 'js-base64';
import xFull from '../../share/xFull'
var xuminder;
export default {
  name: "mp4video",
  inject:['replace','reload'],
  components: {
    mp4videoTable,
    upLoad,
    cascader,
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
      loading:null,
      showPlay:false,
      playSrc:'',
      playType:''
	  }
  },
  computed:{
    ...mapState('currentUserPower',['videoPower']),
    nodeColor1(){//节点1必填项判断决定颜色true or false
      return this.nodeData.name&&this.nodeData.materialCategoryId
    },
    attrColor1(){//1级节点属性图标颜色判断
      for(var key in this.nodeData){
        if(this.nodeData[key]!=='') return true;
      }
      return false;
    }
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
    boxFull(){
      this.$refs.boxFull.full(document.getElementById('myMinder'))
    },
    listFull(){
      this.$refs.listFull.full(this.$refs.mp4videoTable.$el)
    },
    addNode(obj){
      xuminder.add(obj);
    },
    change(val){
      var obj ={};
      obj.text=val;
      obj.word=true;
      obj.color=!!this.nodeColor1;
      obj.attrColor=this.attrColor1;
      xuminder.update(obj);
    },
    stateChange(val){
      var obj ={};
      obj.attrColor=this.attrColor1;
      xuminder.update(obj);
    },
    typeChange(arr,val){
      this.nodeData.materialCategoryId=val;
      var obj ={};
      obj.color=!!this.nodeColor1;
      obj.attrColor=this.attrColor1;
      xuminder.update(obj);
    },
    getImg(data){
      this.nodeData.pic=data.fileId;
      var obj ={};
      obj.color=!!this.nodeColor1;
      obj.playColor=!!data.fileId;
      obj.attrColor=this.attrColor1;
      xuminder.update(obj);
    },
    getVideo(data){
      var obj ={};
      obj.color=!!data.fileId;
      obj.playColor=!!data.fileId;
      obj.attrColor=!!data.fileId;
      xuminder.update(obj);
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
      if(res.detail.nodeType=='video'){
        if(!res.detail.androidMaterial){
          this.$message.error('未上传');
          return
        }
        this.playType='video';
        this.playSrc='/static/'+Base64.decode(res.detail.androidMaterial);
        this.showPlay=true;
      }
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
        "state":obj.state
      };
      tree.children=obj.androidMaterial?[{//2级
        "step":2,
        "text":'视频',
        "type":'video',
        "isLastNode":true,
        "icon":'video',
        "color":true,
        "attrColor":true,
        "playColor":true,
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
      if(treeData.some(v=>{
        var typeArr =v.children.map(two=>two.type);
        return typeArr.length>Array.from(new Set(typeArr)).length
        })){
        this.$message.error('一个主节点只能连接一个同一类型素材节点');return;
      }

      let list =[];
      treeData.forEach(v=>{
        var data1 = v.data;//1级节点数据
        var data2 = v.children[0]?v.children[0].data:{};//2级节点数据
        var msg={};
        data1.id?msg.id=data1.id:null;//判断id
        msg.name=data1.name;
        msg.materialCategory=107;
        msg.materialCategoryId=data1.materialCategoryId||'';
        msg.pic=data1.pic||'';
        msg.state=data1.state||'1';
        msg.androidMaterial=data2.androidMaterial||'';
        msg.androidFileName=data2.androidFileName||'';
        msg.androidResourcePackageSize=data2.androidResourcePackageSize||'';
        msg.durationTime=data2.durationTime||'';
        //增加字段
        msg.iosMaterial=data2.androidMaterial||'';
        msg.iosFileName=data2.androidFileName||'';
        msg.iosResourcePackageSize=data2.androidResourcePackageSize||'';
        msg.windowsMaterial=data2.androidMaterial||'';
        msg.windowsFileName=data2.androidFileName||'';
        msg.windowsResourcePackageSize=data2.androidResourcePackageSize||'';
        list.push(msg);
      })
      console.log(list,'list')
      this.$confirm(`确认保存吗`).then(y=>{
        this.loading=this.$loading({
          lock: true,
          text: `数据保存中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(list[0].id){//是否编辑将第一个编辑后面的新增
          editMaterial(list[0]).then(res=>{
            this.$message.success(res.msg);
            this.$refs.mp4videoTable.getTotal();
            this.loading.close();
          })
          var newList = list.slice(1);
          if(!newList.length){return}
          batchAddMaterial({"list":newList}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.mp4videoTable.getTotal();
            this.loading.close();
          })
        }else{
          batchAddMaterial({list}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.mp4videoTable.getTotal();
            this.loading.close();
          })
        }
      })
    },
  },
  mounted(){
    xuminder = new XUMinder({renderTo:"#myMinder"});
    xuminder.on('open',this.openCallback);
    xuminder.on('close',this.closeCallback);
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
