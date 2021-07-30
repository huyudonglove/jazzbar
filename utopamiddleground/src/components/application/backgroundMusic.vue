<template>
  <div>
      <div>
       <div class="layoutD">
          <div class="leftD" id="myMinder">
            <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
            <el-button type="primary" style="position:absolute;right:10px;top:10px;" @click="add" :disabled="isLook">确定</el-button>
          </div>
          <div class="rightD">
            <!-- <div v-if="isLook" style="width:100%;height:100%;position:absolute;left:0;top:40px;z-index:10;opacity:1;"></div> -->
              <el-tabs type="border-card" v-model="activeName">
              <el-tab-pane label="组件"  name="first" v-if="appPower.length">
                <p class="font20">主节点</p> 
                <el-button type="primary" @click="addNode({step:1,text:'场次列表',type:'场次列表',data:nodeData1,isLastNode:false,icon:''})" :disabled="!appPower[0].isCheck||isLook">场次列表</el-button>
                <p class="font20">素材节点</p>
                <p>
                  <el-button style="width:100px;" type="primary" @click="addNode({step:2,text:'背景音乐',type:'背景音乐',data:nodeData2,isLastNode:true,icon:''})" :disabled="!appPower[0].isCheck||isLook">背景音乐</el-button>
                </p>
              </el-tab-pane>
              <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
                <el-form ref="form" :model="nodeData" label-width="80px">
                  <el-form-item label="内容名称" v-if="nodeData.name!==undefined" required>
                    <el-input v-model="nodeData.name" @input="change"></el-input>
                  </el-form-item>
                  <el-form-item label="状态" v-if="nodeData.state!==undefined">
                    <el-radio-group v-model="nodeData.state" @change="stateChange">
                      <el-radio :label="1">上架</el-radio>
                      <el-radio :label="2">下架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='背景音乐'">背景音乐</div>
                  <div  v-if="type=='背景音乐'">
                    <musicList type="box" :disabled="isLook" :selectArr="nodeData.selectArr?nodeData.selectArr.map(v=>v.id):[]" @change="selectChange" isSelectOne="isSelectOne" ></musicList>
                  </div> 
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
       </div>
       <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
       背景音乐单列表
      </div>
        <backgroundMusicList type="list" @editOrLook="edit" ref="backgroundMusicList"></backgroundMusicList>
    </div>
     <div v-if="showPlay">
      <playDialog type="gif" :src="playSrc" @closePlay="showPlay=false"></playDialog>
    </div>
  </div>
</template>

<script>
import upLoad from '../../share/upLoad';
import {editGroup,batchAddGroup,getTotal} from "../../http/request";
import { mapState, mapActions } from "vuex";
import musicList from '../magical/musicList';
import playDialog from '../../share/playDialog'
import backgroundMusicList from './backgroundMusicList'
import { Base64 } from 'js-base64';
import xFull from '../../share/xFull'
var xuminder;
export default {
  name: "backgroundMusic",
  inject:['replace','reload'],
  components: {
    musicList,
    backgroundMusicList,
    upLoad,
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
        state:'',
      },
      nodeData2:{
        selectArr:[]
      },
      type:'',
      showPlay:false,
      playSrc:'',
      loading:null,
	  }
  },
  computed:{
    ...mapState('currentUserPower',{appPower:'appPower'}),
    nodeColor1(){//节点1必填项判断决定颜色true or false
      return this.nodeData.name
    },
    nodeColor2(){//节点2必填项判断决定颜色true or false
      return this.nodeData.selectArr.length
    },
    attrColor1(){//1级节点属性图标颜色判断
      for(var key in this.nodeData){
        if(this.nodeData[key]!=='') return true;
      }
      return false;
    }
  },
  created(){
    
  }, 
  methods:{
    boxFull(){
      this.$refs.boxFull.full(document.getElementById('myMinder'))
    },
    addNode(obj){
      if(this.isLook){
        xuminder.clear();
        xuminder.isLook=this.isLook=false;
      }
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
      console.log(12)
      var obj ={};
      obj.attrColor=this.attrColor1;
      xuminder.update(obj);
    },
    selectChange(row){
      console.log(row,'row')
        this.nodeData.selectArr=row
        var obj ={};
        obj.text=row.length?row[0].name:'';
        obj.word=true;
        obj.color=!!this.nodeColor2;
        obj.attrColor=!!this.nodeColor2;
        obj.delWarn = row.length?!row[0].isDel&&!row[0].isValid&&row[0].state==1:false;
        xuminder.update(obj);
    },
    openCallback(res){
      console.log(res.detail,'res.detail',5555);
      this.activeName = 'second';
      this.nodeData = res.detail;
      this.isPermitClick=true;
      this.type='';
      this.$nextTick(()=>{
        this.type = xuminder.currentNodeType;
      })
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
      if(!res.detail.fileId){
          this.$message.error('未上传');
          return
        }
       this.playSrc='/static/'+Base64.decode(res.detail.fileId);
       this.showPlay=true;
    },
    getMaterial(data){
      console.log(data,'data')
      this.nodeData.fileName = data.name;
      this.nodeData.fileId = data.fileId;
      var obj ={};
      obj.color=!!this.nodeColor1;
      obj.playColor=!!data.fileId;
      obj.attrColor=this.attrColor;
      xuminder.update(obj);
    },
    edit(obj,isLook=false){
      this.isLook=isLook;
      console.log(obj,88);
      let tree={};
      tree.step=1;//1级
      tree.text=obj.name;
      tree.type='场次列表';
      tree.icon='';
      tree.color=true;
      tree.attrColor=true;
      tree.playColor=!!obj.fileId;
      tree.data={
        "id":obj.id,
        "name":obj.name,
        "groupCategory":obj.groupCategory,
        "backgroundAppId":obj.backgroundAppId,
        "state":obj.state
      };
      tree.children=[];
      if(obj.materialList&&obj.materialList.length){//判断是否有二级节点
          obj.materialList.forEach((two,index)=>{
            console.log(two,'two')
            var node2=null;
            if(two.material[0].isDel||two.material[0].isValid||two.material[0].state==2){//存在三种情况没数据
             node2= {
              step:2,//1级
              text:two.material[0].name,
              type:'背景音乐',
              icon:'',
              isLastNode:true,
              color:false,
              attrColor:false,
              data:{
                selectArr:[]
              },
              children:[]
            }
            }else{
              two.material.forEach((three,index)=>{
                tree.children.push({
                  step:2,//1级
                  text:two.material[index].name,
                  type:'背景音乐',
                  icon:'',
                  isLastNode:true,
                  color:true,
                  attrColor:true,
                  playColor:true,
                  data:{
                    selectArr:[three]
                  },
                  children:[]
                })
              
              })
            }
          })
        
      }
      console.log(tree,'tree')
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
      // if(treeData.some(v=>{
      //   var typeArr =v.children.map(two=>two.type);
      //   return typeArr.length>Array.from(new Set(typeArr)).length
      //   })){
      //   this.$message.error('一个主节点只能连接一个同一类型素材节点');return;
      // }
      let allObject = xuminder.allObject;//所有节点（包含未连接主节点）
      for(var key in allObject){
        if(allObject[key]&&!allObject[key].color){
          this.$message.warning('温馨提示:还有节点未编辑');return;
        }
      }
      // if(treeData.some(v=>!v.data.name)){this.$message.error('请填写主节点名称');return;}
      // if(treeData.some(v=>!v.data.fileId)){this.$message.error('请上传主节点封面图');return;}
      
      let list =[];
      treeData.forEach(v=>{
        var data1 = v.data;//1级节点数据
        var data2 = v.children[0]?v.children[0].data:{};//2级节点数据
        var msg={};
        data1.id?msg.id=data1.id:null;//判断id
        msg.name=data1.name;
        msg.groupCategory=5;
        msg.backgroundAppId=this.$route.params.appId;
        msg.state=data1.state||'1';
        msg.fileId=data1.fileId
        msg.fileName=data1.fileName
        msg.materialList=[];//素材集合
        v.children.forEach(u=>{
        if(u.data.selectArr[0].isDel||u.data.selectArr[0].isValid||u.data.selectArr[0].state==2){}else{//编辑时选择了删除或被取消分配的数据直接删掉
        console
        var materialIndex = msg.materialList.map(isHave=>isHave.materialCategory).indexOf(100);//判断是否已有同一素材返回索引
        console.log(materialIndex,'materialIndex')
        if(materialIndex!=-1){
          msg.materialList[materialIndex].material.push(JSON.parse(JSON.stringify(u.data.selectArr[0])))
        }else{
         
          msg.materialList.push({materialCategory:100,material:JSON.parse(JSON.stringify(u.data.selectArr))});//100默认为音乐
           console.log(msg.materialList,'msg.materialList')
        }
          }
          })
        list.push(msg);
      })
      console.log(list,'list');
      // return;
      this.$confirm(`确认保存吗`).then(y=>{
         this.loading=this.$loading({
          lock: true,
          text: `数据保存中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(list[0].id){//是否编辑将第一个编辑后面的新增
          editGroup(list[0]).then(res=>{
            this.$message.success(res.msg);
            this.$refs.backgroundMusicList.getTotal();
            this.loading.close();
          })
          var newList = list.slice(1);
          if(!newList.length){return}
          batchAddGroup({"list":newList}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.backgroundMusicList.getTotal();
            this.loading.close();
          })
        }else{
          batchAddGroup({list}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.backgroundMusicList.getTotal();
            this.loading.close();
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

.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>