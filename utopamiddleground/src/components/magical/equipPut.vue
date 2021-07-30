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
                <el-button style="width:100px;" type="primary" :disabled="isLook||!appPower[0].isCheck" @click="addNode({step:1,text:'钢琴',type:'钢琴',data:nodeData1,isLastNode:false,icon:''})">钢琴</el-button>
                <p class="font20">素材节点</p>
                <div style="margin-bottom:20px;">
                  <el-button style="width:100px;" type="primary" :disabled="isLook||!appPower[0].isCheck" @click="addNode({step:2,text:'合奏曲',type:2,data:nodeData1,isLastNode:true,icon:''})">合奏曲</el-button>
                  <el-button style="width:100px;" type="primary" :disabled="isLook||!appPower[0].isCheck" @click="addNode({step:2,text:'钢琴曲',type:3,data:nodeData1,isLastNode:true,icon:''})">钢琴曲</el-button>
                </div>
                <div>
                  <el-button style="width:100px;" type="primary" :disabled="isLook||!appPower[0].isCheck" @click="addNode({step:2,text:'MP3动画',type:1,data:nodeData1,isLastNode:true,icon:''})">MP3动画</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
                <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='钢琴'">钢琴</div>
                <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type==2">合奏曲</div>
                <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type==3">钢琴曲</div>
                <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type==1">MP3动画</div>
                <div v-if="type=='钢琴'">
                  <pianoList type="box" :disabled="isLook" :isSelectOne="true" :selectArr="nodeData.selectArr?nodeData.selectArr.map(v=>v.id):[]" @change="selectChange"></pianoList>
                </div>
                <div v-if="type==2">
                  <ensembleTable type="box" :disabled="isLook" :isSelectOne="true" :selectArr="nodeData.selectArr?nodeData.selectArr.map(v=>v.id):[]" @change="selectChange"></ensembleTable>
                </div>
                <div v-if="type==3">
                  <pianoConcertoList type="box" :disabled="isLook" :isSelectOne="true" :selectArr="nodeData.selectArr?nodeData.selectArr.map(v=>v.id):[]" @change="selectChange"></pianoConcertoList>
                </div>
                <div v-if="type==1">
                  <mp3AnimationTable type="box" :disabled="isLook" :isSelectOne="true" :selectArr="nodeData.selectArr?nodeData.selectArr.map(v=>v.id):[]" @change="selectChange"></mp3AnimationTable>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
       </div>
       <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
       设备投放列表
      </div>
        <equipPutTable type="list" @editOrLook="edit" ref="equipPutTable"></equipPutTable>
    </div>
  </div>
</template>

<script>
import {editEquipPut,batchAddEquipPut} from "../../http/request";
import {mapState} from 'vuex';
import equipPutTable from './equipPutTable';
import mp3AnimationTable from './mp3AnimationTable'
import ensembleTable from './ensembleTable'
import pianoList from './pianoList'
import pianoConcertoList from './pianoConcertoList'
import xFull from '../../share/xFull'
var xuminder;
export default {
  name: "equipPut",
  inject:['replace','reload'],
  components: {
    equipPutTable,
    mp3AnimationTable,
    ensembleTable,
    pianoList,
    pianoConcertoList,
    xFull
  },
  data(){
	  return{
      activeName: 'first',
      isLook:false,
      isPermitClick:false,//能否点击属性切换
      nodeData:{},
      nodeData1:{
        selectArr:[]
      },
      type:'',
      loading:null
	  }
  },
  computed:{
    ...mapState('currentUserPower',{appPower:'appPower'}),
    nodeColor(){//节点1、2必填项判断决定颜色true or false
      return this.nodeData.selectArr.length
    },
  },
  methods:{
    boxFull(){
      this.$refs.boxFull.full(document.getElementById('myMinder'))
    },
    addNode(obj){
      xuminder.add(obj);
    },
    selectChange(row){
      this.nodeData.selectArr=row;
      var obj ={};
      obj.text=row.length?row[0].name:'';
      obj.word=true;
      obj.color=!!this.nodeColor;
      obj.attrColor=!!this.nodeColor;
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
    },
    edit(obj,isLook=false){
      this.isLook=isLook;
      console.log(obj);
      let tree={};
      tree.step=1;//1级
      tree.text=obj.materialDelState||obj.materialIsValidState||obj.materialState==2?'钢琴':obj.materialName;//存在三种情况没数据
      tree.type='钢琴';
      tree.isLastNode=false;
      tree.icon='';
      tree.color=obj.materialDelState||obj.materialIsValidState||obj.materialState==2?false:true;
      tree.attrColor=obj.materialDelState||obj.materialIsValidState||obj.materialState==2?false:true;
      // tree.warning=!!(obj.materialDelState||obj.materialIsValidState||obj.materialState==2);
      tree.data={
        "id":obj.id,
        "selectArr":obj.materialDelState||obj.materialIsValidState||obj.materialState==2?[]:[{id:obj.materialId,name:obj.materialName}]  
      };
      tree.children=[];
      obj.groupList?obj.groupList.forEach(v=>{
        if(v.groupCategory==1){
          tree.children.push({//判断是否有MP3动画生成节点
            step:2,
            text:obj.mp3CartoonGroupName,
            type:1,
            icon:'',
            isLastNode:true,
            color:true,
            "attrColor":true,
            data:{
              selectArr:[{id:v.groupId,name:obj.mp3CartoonGroupName}]
            },
            children:[]
          })
        }
        if(v.groupCategory==2){
          tree.children.push({//判断是否有合奏曲生成节点
            step:2,
            text:obj.combineGroupName,
            type:2,
            icon:'',
            isLastNode:true,
            color:true,
            "attrColor":true,
            data:{
              selectArr:[{id:v.groupId,name:obj.combineGroupName}]
            },
            children:[]
          })
        }
        if(v.groupCategory==3){
          tree.children.push({//判断是否有钢琴曲生成节点
            step:2,
            text:obj.pianoGroupName,
            type:3,
            icon:'',
            isLastNode:true,
            color:true,
            "attrColor":true,
            data:{
              selectArr:[{id:v.groupId,name:obj.pianoGroupName}]
            },
            children:[]
          })
        }
      }):null;
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
        var msg={};
        data1.id?msg.id=data1.id:null;//判断id
        msg.materialId=data1.selectArr[0]?data1.selectArr[0].id:'';
        msg.materialName=data1.selectArr[0]?data1.selectArr[0].name:'';
        msg.backgroundAppId=this.$route.params.appId;
        msg.groupList=[];
        v.children.forEach(u=>{
          var node = {
            groupCategory:u.type,
            groupId:u.data.selectArr[0]?u.data.selectArr[0].id:''
          }
          u.data.selectArr[0]?msg.groupList.push(node):null;
        })
        list.push(msg);
      })
      console.log(list,'list')
      // return
      this.$confirm(`确认保存吗`).then(y=>{
        this.loading=this.$loading({
          lock: true,
          text: `数据保存中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(list[0].id){//是否编辑将第一个编辑后面的新增       
          editEquipPut(list[0]).then(res=>{
            this.loading.close();
            if(res.code){
              this.$message.error(res.msg);
            }else{           
              this.$message.success(res.msg);
              this.$refs.equipPutTable.getTotal();
            }
          }).catch(err=>{
            this.loading.close();
          })
          var newList = list.slice(1);
          if(!newList.length){return}
          batchAddEquipPut({"list":newList}).then(res=>{
            this.loading.close();
            if(res.code){
              this.$message.error(res.msg);
            }else{           
              this.$message.success(res.msg);
              this.$refs.equipPutTable.getTotal();
            }
          }).catch(err=>{
            this.loading.close();
          })
        }else{
          batchAddEquipPut({list}).then(res=>{
            this.loading.close();
            if(res.code){
              this.$message.error(res.msg);
            }else{           
              this.$message.success(res.msg);
              this.$refs.equipPutTable.getTotal();
            }
          }).catch(err=>{
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