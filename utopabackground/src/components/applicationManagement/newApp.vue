<template>
  <div>
    <div>
      <div class="layoutD">
        <div class="leftD" id="myMinder">
          <xFull ref="boxFull" style="position:absolute;left:10px;top:10px;" @full="boxFull"></xFull>
          <el-button type="primary"  v-if="appPower.length" style="position:absolute;right:10px;top:10px;" @click="add" :disabled="isLook">确定</el-button>
        </div>
        <div class="rightD">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="组件"  name="first" v-if="appPower.length">
              <p class="font20">主节点</p>
              <!-- <el-button type="primary" @click="addNode({step:1,text:'魔幻表演',type:'魔幻表演',data:nodeData1,icon:''},1)" style="width:100px"
              :disabled="isLook||!appPower[0].isCheck">魔幻表演</el-button>
              <el-button type="primary" @click="addNode({step:1,text:'AR云秀',type:'AR云秀',data:nodeData1,icon:''},2)" style="width:100px"
              :disabled="isLook||!appPower[0].isCheck">AR云秀</el-button> -->
              <el-button v-for="item in playButton" :key="item.name" style='margin-top:10px' type='primary'
                @click="addNode({step:1,text:item.name,type:item.name,data:nodeData1,icon:''},item.id)"
                :disabled="isLook||!appPower[0].isCheck">
                  {{item.name}}
                </el-button>
              <div v-if='appType!=1'>
                <p class="font20">素材节点</p>
                <p>
                  <el-button type="primary" @click="addNode({step:2,text:'动画音乐',type:'cartoon',data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck">动画音乐</el-button>
                  <el-button type="primary" @click="addNode({step:2,text:'MP4模型',type:'mp4',data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck">MP4模型</el-button>
                </p>
                <p>
                  <el-button type="primary" @click="addNode({step:2,text:'普通模型',type:'model',data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck">普通模型</el-button>
                </p>
                  <p class="font20">设备节点</p>
                  <p>
                    <el-button type="primary" @click="addNode({step:2,text:'钢琴',type:'piano',data:nodeData2,icon:'',isLastNode:true})" style="width:100px;" :disabled="isLook||!appPower[0].isCheck">钢琴</el-button>
                  </p>
              </div>
              <div> 
                <p class="font20">素材节点</p>
                <p>
                  <el-button type="primary" @click="addNode({step:2,text:'动画',type:101,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(101)'>动画</el-button>  
                  <el-button type="primary" @click="addNode({step:2,text:'音乐',type:100,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(100)'>音乐</el-button> 
                  <el-button type="primary" @click="addNode({step:2,text:'载体模型',type:102,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(102)'>载体模型</el-button>
                  <el-button type="primary" @click="addNode({step:2,text:'MP4模型',type:110,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(110)'>MP4模型</el-button>
                  <el-button type="primary" @click="addNode({step:2,text:'普通模型',type:103,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(103)'>普通模型</el-button>
                  <el-button type="primary" @click="addNode({step:2,text:'MP4视频',type:107,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(107)'>MP4视频</el-button>
                  <el-button type="primary" @click="addNode({step:2,text:'在线视频',type:104,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(104)'>在线视频</el-button>
                  <el-button type="primary" @click="addNode({step:2,text:'动画音乐',type:109,data:nodeData2,icon:'',isLastNode:true})" 
                  :disabled="isLook||!appPower[0].isCheck" v-if='modules.includes(109)'>动画音乐</el-button>
                </p>
              </div>
              <div v-if='modules.includes(108)'>
                  <p class="font20">设备节点</p>
                  <p>
                    <el-button type="primary" @click="addNode({step:2,text:'钢琴',type:108,data:nodeData2,icon:'',isLastNode:true})" style="width:100px;" :disabled="isLook||!appPower[0].isCheck">钢琴</el-button>
                  </p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性" :disabled="!isPermitClick"  name="second">
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='cartoon'">动画音乐109</div>
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='mp4'">MP4模型</div>
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='model'">普通模型</div>
              <div style="font-size:20px;font-weight:bold;color:#614a4d;" v-if="type=='piano'" >钢琴108</div>
              <el-form ref="form" :model="nodeData" label-width="80px">
                <el-form-item label="名称" v-if="nodeData.name!==undefined" required>
                  <el-input v-model="nodeData.name" @change="change"></el-input>
                </el-form-item>
                <el-form-item label="所属玩法" v-if="nodeData.name!==undefined" required>
                  <span class="myWords">{{type}}</span>
                  <!-- <span>AR拍照</span>
                  <span>AR宠物</span> -->
                </el-form-item>
                <el-form-item label="Unity版本" v-if="nodeData.unityVersion!==undefined">
                  <huSelect :type="`unity`" :value="nodeData.unityVersion" ref="unity" @change="unityChange"></huSelect>
                </el-form-item>
                <el-form-item label="渲染管线" v-if="nodeData.loadingLine!==undefined" required="">
                  <huSelect :type="`pipeline`" :value="nodeData.loadingLine" ref="pipeline" @change="lineChange"></huSelect>
                </el-form-item>
                <el-form-item label="状态" v-if="nodeData.state!==undefined">
                  <el-radio-group v-model="nodeData.state" @change="msgWarn(nodeData.state)">
                    <el-radio label="1">上架</el-radio>
                    <el-radio label="2">下架</el-radio>
                  </el-radio-group>
                </el-form-item>
                <cartoonList :type="`box`" ref="cartoonmusicList"  v-if="type==109" @change="cartoonChange" :select-arr="selectArr" :app-id="appId"></cartoonList>
                <mp4modelList :type="`box`"  ref="mp4modelList" v-if="type==110" @change="mp4modelChange" :select-arr="selectArr" :app-id="appId"></mp4modelList>
                <modelList :type="`box`"  ref="modelList" v-if="type==103" @change="modelChange" :select-arr="selectArr" :app-id="appId"></modelList>
                <pianoList :type="`box`"  ref="pianoList" v-if="type==108" @change="pianoChange" :select-arr="selectArr" :app-id="appId"></pianoList>
                <animationList :type="`box`"  ref="animationList" v-if="type==101" @change="animationChange" :select-arr="selectArr" :app-id="appId"></animationList>
                <musicList :type="`box`"  ref="musicList" v-if="type==100" @change="musicChange" :select-arr="selectArr" :app-id="appId"></musicList>
                <carrierModelList :type="`box`"  ref="carrierModelList" v-if="type==102" @change="carrierModelChange" :select-arr="selectArr" :app-id="appId"></carrierModelList>
                <!-- 104 107 zaixianshipin mp4shipin -->
                <onlineList :type="`box`"  ref="onlineList" v-if="type==104" @change="onlineChange" :select-arr="selectArr" :app-id="appId"></onlineList>
                <mp4videoList :type="`box`"  ref="mp4videoList" v-if="type==107" @change="mp4videoChange" :select-arr="selectArr" :app-id="appId"></mp4videoList>
              </el-form>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>
      <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
        应用列表
      </div>
      <div style="background:#f0f0f5;margin-top:10px">
      </div>
      <div>
        <newAppList :type="`list`" @buttonClick="buttonClick" ref="newAppList"></newAppList>
      </div>
    </div>
  </div>
</template>

<script>
  import {addTotal,editTotal,editMaterial,batchAddMaterial,batchAddApp,applicationInfo,applicationUpdate,applicationPlay,applicationM} from "../../http/request";
  import { mapState, mapActions } from "vuex";
  import pagination from '../../share/pagination';
  import upLoad from '../../share/upLoad'
  import XUMinder from'../../util/XUMinder.js';
  import newAppList from './newAppList'
  import huSelect from '../tools/huSelect'
  import pianoList from '../device/pianoList'
  import cartoonList from  '../material/cartoonmusicList'
  import mp4modelList from '../materialTable/mp4modelList'
  import modelList from  '../material/modelList'
  import xFull from '../../share/xFull'
  import animationList from '../materialTable/animationList'
  import musicList from '../materialTable/musicList'
  import carrierModelList from '../materialTable/carrierModelTable'
  import onlineList from '../material/onlineList'
  import mp4videoList from '../materialTable/mp4videoTable'
  var xuminder;
  export default {
    name: "newApp",
    inject:['replace','reload'],
    components: {
      pagination,
      upLoad,
      newAppList,
      huSelect,
      pianoList,
      cartoonList,
      mp4modelList,
      modelList,
      xFull,
      animationList,
      musicList,
      carrierModelList,
      onlineList,
      mp4videoList
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
        nodeData:{},
        nodeData1:{
          name:'',
          state:'',
          unityVersion:'',
          loadingLine:''
        },
        nodeData2:{
          materialIds:[],
          material:[],
          module:''
        },
        isPermitClick:false,
        type:'',
        selectArr:[],
        playId:8,
        appId:'',
        deleteMaterialIds:[],
        appType:1,
        playButton:[], //主节点
        modules:[],//二级节点
      }
    },
    created(){

    },
    computed:{
      nodeColor2(){//2级节点必填项判断决定颜色true or false
        return this.nodeData.Material&&this.nodeData.unityVersion&&this.nodeData.loadingLine
      },
      ...mapState('currentUserPower',['appPower']),
      nodeColor1(){
        return this.nodeData.name&&this.nodeData.loadingLine
      },
      attrColor(){//节点属性图标颜色判断
        for(var key in this.nodeData){
          if(this.nodeData[key]!=='') return true;
        }
        return false;
      }
    },
    methods:{
      applicationM(id){
        this.modules=[];
        applicationM({playId:id}).then(v=>{
          //console.log(v);
          try{
              v.data.map(r=>{
              //console.log(r,77777)
              this.modules.push(r.module);
            })
          }catch(err){
            console.log('接口数据有问题')
            this.modules=[];
          }
          
          //console.log(this.modules,'modules')
        })
      },
      applicationPlay(){
        //获取玩法
        applicationPlay().then(v=>{
           //console.log(v);
           this.playButton=v.data;
           this.applicationM(v.data[0].id);
        })
      },
      addNode(obj,id){
        if(this.isLook){
          xuminder.clear();
          xuminder.isLook=this.isLook=false;
        }
        if(id) this.playId=id;
        if(obj.step==1){
          xuminder.clear();
          this.applicationM(id);
        }
        xuminder.add(obj);
      },
      change(val){
        var obj={};
        obj.text=val;
        obj.word=true;
        obj.color=!!this.nodeColor1;
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
        if(treeData.some(v=>!v.data.name)){this.$message.error('请填写主节点名称');return;}
        let list =[];
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
        treeData.forEach(v=>{
          var data1 = v.data;//1级节点数据
          var msg={};
          data1.id?msg.id=data1.id:null;//判断id
          msg.name=data1.name;
          msg.state=data1.state||'1';
          var data1 = v.data;//1级节点数据
          msg.unityVersion=data1.unityVersion||'';
          msg.loadingLine=data1.loadingLine||'';
          msg.playId=this.playId;
          msg.moduleList=[];
          v.children.map(r=>{
            let t={
              module:'',
              materialIds:[]
            };
            t.module=r.data.module;
            t.materialIds=this.deleteMaterial(this.deleteMaterialIds,r.data.materialIds);
            msg.moduleList.push(t)
          })
          list.push(msg);
        })
        console.log(list,'list')
        //return;
        if(list[0].id){//是否编辑将第一个编辑后面的新增
          applicationUpdate(list[0]).then(res=>{
            this.$refs.newAppList.applicationList();
            xuminder.update({delAllWarn:true})
          })
          var newList = list.slice(1);
          if(!newList.length){return}
          batchAddApp({"list":newList}).then(res=>{
            this.$refs.newAppList.applicationList();
          })
        }else{
          batchAddApp({list}).then(res=>{
            this.$refs.newAppList.applicationList();
          })
        }
      },
      buttonClick(key,obj){
        //console.log(key,val)
        this.isLook=(key=='watch'?true:false);
        console.log(this.isLook,77777777)
        this.appId=obj.id;
        let tree={};
        applicationInfo({appId:obj.id}).then(res=>{
          console.log(res,7777777777);
          let data=res.data;
          this.playId=data.playId;
          this.deleteMaterialIds=data.deleteMaterialIds;
          tree.step=1;//1级
          tree.text=data.name;
          tree.type=data.playName;
          tree.isLastNode=false;
          tree.color=true;
          tree.attrColor=true;
          tree.data={
            "id":data.id,
            "name":data.name,
            "state":obj.state+'',
            'unityVersion':data.unityVersion,
            'loadingLine':data.loadingLine,
          };
          tree.children=[];
          data.moduleList&&data.moduleList.map(v=>{
            let node={
              "step":2,
              "text":'',
              "type":'',
              "isLastNode":true,
              color:true,
              attrColor:true,
              data:{
                materialIds:[],
                module:''
              },
              children:[],
              warning:false
            };
            node.text=v.moduleName;
            node.data.module=v.module;
            node.data.materialIds=v.materialIds;
            node.warning=(v.materialDelState==1);
            node.type=v.module;
            // v.module==109&&(()=>{
            //   node.type='cartoon'
            // })();
            // v.module==110&&(()=>{
            //   node.type='mp4'
            // })();
            // v.module==103&&(()=>{
            //   node.type='model'
            // })();
            // v.module==108&&(()=>{
            //   node.type='piano'
            // })();
            // v.module==100&&(()=>{
            //   node.type='music'
            // })();
            // v.module==101&&(()=>{
            //   node.type=animation
            // })();
            // v.module==102&&(()=>{
            //   node.type='music'
            // })();
            tree.children.push(node)
          })
          xuminder.isLook=this.isLook;
          xuminder.draw([tree]);
        })
      },
      openCallback(res){
        console.log(xuminder,7777777777)
        console.log(res,'res.detail');
        this.activeName = 'second';
        console.log(res.detail.materialIds,666666666)
        this.nodeData = res.detail;
        this.isPermitClick=true;
        this.type='';
        this.$nextTick(()=>{
          this.type=xuminder.currentNodeType;
        })

        this.selectArr=this.nodeData.materialIds;
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
        var obj ={};
        obj.color=!!this.nodeColor1;
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      cartoonChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=109;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      mp4modelChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=110;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      modelChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=103;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      pianoChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=108;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      animationChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=101;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      musicChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=100;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      carrierModelChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=102;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      onlineChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=104;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      mp4videoChange(val){
        xuminder.update({color:true});
        console.log(val)
        this.nodeData.material=val;
        this.nodeData.materialIds=val.map(v=>{return v.id})
        this.nodeData.module=107;
        console.log(this.nodeData)
        var obj ={};
        obj.attrColor=this.attrColor;
        xuminder.update(obj);
      },
      deleteMaterial(v1,v2){
        //v1 shanchu
        var apple=[];
        v2.map(r=>{
          !v1.includes(r)&&(()=>{
            apple.push(r)
          })();
        })
        return apple;
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
      obj.attrColor=this.attrColor1;
      xuminder.update(obj);
    },
      boxFull(){
        this.$refs.boxFull.full(document.getElementById('myMinder'))
      },
      playCallback(res){
        console.log(res.detail,1515);
        if(res.detail.nodeType=='look'){
          this.isLook=false;
          this.appId='';
          return;
        }
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
      this.applicationPlay();
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
