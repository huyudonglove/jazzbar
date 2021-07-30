<template>
  <div>
    <div>
      <div class="layoutD">
        <div class="leftD" id="myMinder">
          <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
          <el-button type="primary" v-if="onlineVideoPower.length" style="position:absolute;right:10px;top:10px;" @click="add" :disabled="isLook">确定</el-button>
        </div>
        <div class="rightD">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="组件"  name="first" v-if="onlineVideoPower.length">
              <p class="font20">主节点</p>
              <el-button type="primary" @click="addNode({step:1,text:'在线视频',type:'在线视频',data:nodeData1,isLastNode:true})" :disabled="isLook||!onlineVideoPower[0].isCheck">在线视频</el-button>
            </el-tab-pane>
            <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
              <el-form ref="form" :model="nodeData" label-width="80px">
                <el-form-item label="名称" v-if="nodeData.name!==undefined" required>
                  <el-input v-model="nodeData.name" @input="change"></el-input>
                </el-form-item>
                <el-form-item label="选择分类" v-if="nodeData.materialCategoryId!==undefined" required>
                  <cascader  @changeVal="typeChange" :moduleId='104'  :queryMaterialId="nodeData.materialCategoryId" ref="filter" style="display: inline-block"></cascader>
                </el-form-item>
                <el-form-item label="视频地址" v-if="nodeData.videoUrl!==undefined">
                  <el-input v-model="nodeData.videoUrl"  placeholder="请输入视频地址"></el-input>
                </el-form-item>
                <el-form-item label="状态" v-if="nodeData.state!==undefined" >
                  <el-radio-group v-model="nodeData.state" @change="msgWarn(nodeData.state)">
                    <el-radio label="1">上架</el-radio>
                    <el-radio label="2">下架</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
        在线视频列表
      </div>
      <div style="background:#f0f0f5;margin-top:10px">
      </div>
      <onlineList :type="`list`" @buttonClick="buttonClick" ref="pianoList"></onlineList>
    </div>
  </div>
</template>

<script>
  import {addTotal,editTotal,editMaterial,batchAddMaterial} from "../../http/request";
  import pagination from '../../share/pagination';
  import upLoad from '../../share/upLoad'
  import XUMinder from'../../util/XUMinder.js';
  import onlineList from './onlineList'
  import cascader from '../../share/cascader'
  import huRadio from '../tools/huRadio'
  import { mapState } from "vuex";
  import xFull from '../../share/xFull'
  var xuminder;
  export default {
    name: "online",
    inject:['replace','reload'],
    components: {
      pagination,
      upLoad,
      onlineList,
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
          videoUrl:'',
          state:''
        },
        isPermitClick:false,
      }
    },
    created(){

    },
    computed:{
      ...mapState('currentUserPower',['onlineVideoPower']),
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
        let treeData = xuminder.treeData;
        console.log(treeData,'treeData')
        if(!treeData.length){
          return;
        }
        let list =[];
        treeData.forEach(v=>{
          var data1 = v.data;//1级节点数据
          var msg={};
          data1.id?msg.id=data1.id:null;//判断id
          msg.name=data1.name;
          msg.materialCategory=104;
          msg.materialCategoryId=data1.materialCategoryId||'';
          msg.state=data1.state||'1';
          msg.videoUrl=data1.videoUrl||'';
          list.push(msg);
        })
        console.log(list,'list')
        if(list[0].id){//是否编辑将第一个编辑后面的新增
          editMaterial(list[0]).then(res=>{
            this.$message.success(res.msg);
            this.$refs.pianoList.getTotal();
          })
          var newList = list.slice(1);
          if(!newList.length){return}
          batchAddMaterial({"list":newList}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.pianoList.getTotal();
          })
        }else{
          batchAddMaterial({list}).then(res=>{
            this.$message.success(res.msg);
            this.$refs.pianoList.getTotal();
          })
        }
      },
      buttonClick(key,obj){
        //console.log(key,val)
        this.isLook=key=='watch'?true:false;
        let tree={};
        tree.step=1;//1级
        tree.text=obj.name;
        tree.type='钢琴';
        tree.isLastNode=true;
        tree.color=true;
        tree.attrColor=true,
        tree.data={
          "id":obj.id,
          "name":obj.name,
          "materialCategoryId":obj.materialCategoryId,
          "videoUrl":obj.videoUrl,
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
        var obj ={};
        obj.color=!!this.nodeColor1;
        xuminder.update(obj);
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
