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
                <!-- <div v-if="isLook" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:10;opacity:1;"></div> -->
              <el-tab-pane label="组件" v-if="appPower.length" name="first">
                <p class="font20">主节点</p>
                <el-button style="width:100px;" :disabled="isLook||!appPower[0].isCheck" type="primary" @click="addNode({step:1,text:'合奏曲',type:'合奏曲',data:nodeData1,isLastNode:false,icon:''})">合奏曲</el-button>
                <p class="font20">动画音乐节点</p>
                <el-button style="width:100px;" :disabled="isLook||!appPower[0].isCheck" type="primary" @click="addNode({step:2,text:'动画音乐',type:'动画音乐',data:nodeData2,isLastNode:false,icon:'gif'})">动画音乐</el-button>
                <p class="font20">模型节点</p>
                <el-button style="width:100px;" :disabled="isLook||!appPower[0].isCheck" type="primary" @click="addNode({step:3,text:'icon模型',type:'icon模型',data:nodeData2,isLastNode:true,icon:'img'})">icon模型</el-button>
              </el-tab-pane>
              <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
                <el-form ref="form" :model="nodeData" label-width="80px">
                  <el-form-item label="集合名称" v-if="nodeData.name!==undefined" required>
                    <el-input :disabled="isLook" v-model="nodeData.name" maxlength="15" @input="change"></el-input>
                  </el-form-item>
                  <el-form-item label="状态" v-if="nodeData.state!==undefined">
                    <el-radio-group :disabled="isLook" v-model="nodeData.state" @change="stateChange">
                      <el-radio :label="1">上架</el-radio>
                      <el-radio :label="2">下架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
                <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='动画音乐'">动画音乐</div>
                  <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='icon模型'">icon模型</div>
                  <div v-if="type=='动画音乐'">
                    <cartoonmusicList type="box" :disabled="isLook" :isSelectOne="true" :selectArr="nodeData.selectArr?nodeData.selectArr.map(v=>v.id):[]" @change="selectChange"></cartoonmusicList>
                  </div>
                  <div v-if="type=='icon模型'">
                    <iconModelList type="box" :disabled="isLook" :isSelectOne="true" :selectArr="nodeData.selectArr?nodeData.selectArr.map(v=>v.id):[]" @change="selectChange"></iconModelList>
                  </div>
              </el-tab-pane>
            </el-tabs>
          </div>
       </div>
       <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
       合奏曲管理
      </div>
        <ensembleTable type="list" @editOrLook="edit" ref="ensembleTable"></ensembleTable>
    </div>
    <div v-if="showPlay">
      <playDialog :type="playType" :src="playSrc" @closePlay="showPlay=false"></playDialog>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import ensembleTable from './ensembleTable';
import cartoonmusicList from './cartoonmusicList';
import iconModelList from './iconModelList';
import {batchAddGroup,editGroup,queryMaterialById,getGroupInfo} from '../../http/request'
import playDialog from '../../share/playDialog'
import xFull from '../../share/xFull'
var xuminder;
export default {
  name: "ensemble",
  components: {
    ensembleTable,
    iconModelList,
    cartoonmusicList,
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
        selectArr:[],
      },
      type:'',
      loading:null,
      showPlay:false,
      playType:'',
      playSrc:''
	  }
  },
  computed:{
    ...mapState('currentUserPower',{appPower:'appPower'}),
    nodeColor1(){//节点1必填项判断决定颜色true or false
      return this.nodeData.name
    },
    nodeColor2(){//节点2、3必填项判断决定颜色true or false
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
      this.nodeData.selectArr=row;
      var obj ={};
      obj.text=row.length?row[0].name:'';
      obj.word=true;
      obj.color=!!this.nodeColor2;
      obj.attrColor=!!this.nodeColor2;
      obj.playColor=!!this.nodeColor2;
      obj.delWarn = row.length?!row[0].isDel&&!row[0].isValid&&row[0].state==1:false;
      xuminder.update(obj);
    },
    openCallback(res){
      console.log(res.detail,'res.detail');
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
      if(res.detail.nodeType=='动画音乐'){
        if(!res.detail.selectArr[0]){
          this.$message.error('请选择动画音乐');
          return
        }
        queryMaterialById({id:res.detail.selectArr[0].id}).then(res=>{
          this.playType='gif';
          this.playSrc='/static/'+Base64.decode(res.data.pic);
          this.showPlay=true;
        }) 
      }
      if(res.detail.nodeType=='icon模型'){
        if(!res.detail.selectArr[0]){
          this.$message.error('请选择icon模型');
          return
        }
        getGroupInfo({id:res.detail.selectArr[0].id}).then(res=>{
          this.playType='img';
          this.playSrc='/static/'+Base64.decode(res.data.fileId);
          this.showPlay=true;
        })
      }
    },
    edit(obj,isLook=false){
      this.isLook=isLook;
      console.log(obj);
      let tree={};
      tree.step=1;//1级
      tree.text=obj.name;
      tree.type='合奏曲';
      tree.icon='';
      tree.isLastNode=false;
      tree.color=true;
      tree.attrColor=true;
      tree.data={
        "id":obj.id,
        "name":obj.name,
        "state":obj.state
      };
      tree.children=[];
      if(obj.materialList&&obj.materialList.length){//判断是否有二级节点
        obj.materialList.forEach(v=>{
          v.material.forEach((two)=>{
            var node2 =two.isDel||two.isValid||two.state==2?//存在三种情况没数据
            {
              step:2,//2级
              text:'动画音乐',
              type:'动画音乐',
              icon:'gif',
              isLastNode:false,
              color:false,
              "attrColor":false,
              "playColor":false,
              data:{
                selectArr:[]
              },
              children:[]
            }:{
              step:2,//2级
              text:two.name,
              type:'动画音乐',
              icon:'gif',
              isLastNode:false,
              color:true,
              "attrColor":true,
              "playColor":true,
              // warning:!!(two.isDel||two.isValid||two.state==2),
              data:{
                selectArr:[two]
              },
              children:[]
            }
            var materialId=two.id;
            if(obj.modelList&&obj.modelList.length){//判断是否有三级节点
              obj.modelList.forEach(u=>{
                u.model.forEach((three)=>{
                  var node3 ={
                    step:3,//3级
                    text:three.name,
                    type:'icon模型',
                    icon:'img',
                    isLastNode:true,
                    color:true,
                    "attrColor":true,
                    "playColor":true,
                    // warning:!!three.isDel,
                    data:{
                      selectArr:[three]
                    },
                    children:[]
                  }
                  if(materialId==u.materialId){
                    node2.children.push(node3);
                  }
                })
              })
            }
            tree.children.push(node2)
          })
        })
      }
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
      
      let list =[];
       treeData.forEach(v=>{
        var data1 = v.data;//1级节点数据
        var msg={};
        data1.id?msg.id=data1.id:null;//判断id
        msg.name=data1.name;
        msg.groupCategory=2;
        msg.backgroundAppId=this.$route.params.appId;
        msg.state=data1.state||'1';
        msg.materialList=[];//素材集合
        msg.modelList=[];//icon模型集合
        v.children.forEach(u=>{
          if(u.data.selectArr[0].isDel||u.data.selectArr[0].isValid||u.data.selectArr[0].state==2){}else{//编辑时选择了删除或被取消分配的数据直接删掉
            var materialId = u.data.selectArr[0]?u.data.selectArr[0].id:'';//动画音乐id
            var materialIndex = msg.materialList.map(isHave=>isHave.materialCategory).indexOf(109);//判断是否已有同一素材返回索引
            if(materialIndex!=-1){
              msg.materialList[materialIndex].material.push(JSON.parse(JSON.stringify(u.data.selectArr[0])))
            }else{
              msg.materialList.push({materialCategory:109,material:JSON.parse(JSON.stringify(u.data.selectArr))});//109默认为动画音乐
            }
            u.children.forEach(w=>{
              var modelIndex = msg.modelList.map(isHave=>isHave.materialId).indexOf(materialId);//判断是否已有同一素材返回索引
              if(modelIndex!=-1){
                msg.modelList[modelIndex].model.push(JSON.parse(JSON.stringify(w.data.selectArr[0])));//有则添加，没有push
              }else{
                msg.modelList.push({modelCategory:4,materialId:materialId,model:JSON.parse(JSON.stringify(w.data.selectArr))});//4为默认icon模型
              }
            })
          }
        })
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
          editGroup(list[0]).then(res=>{
            this.$message.success(res.msg);
            this.$refs.ensembleTable.getTotal();
            this.loading.close();
          })
          var newList = list.slice(1);
          if(!newList.length){return}
          batchAddGroup({"list":newList}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.ensembleTable.getTotal();
            this.loading.close();
          })
        }else{
          batchAddGroup({list}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.ensembleTable.getTotal();
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