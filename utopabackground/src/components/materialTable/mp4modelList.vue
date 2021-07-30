<template>
    <div>
      <div v-if="type=='list'&&mp4ModelPower.length">
       <div style="background:#f0f0f5;margin-top:10px;">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span class="myWords">
              <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block;"></nameInput>
            </span>
            <span class="myWords">
              <cascader   :routeParams="true" @changeVal="typeChange" :moduleId='110' ref="filter" style="display: inline-block"></cascader>
            </span>
             <span class="myWords">
                  <timeNew :router="true"></timeNew>
            </span>
            <span>
               <commonDel :id='selectId' :disabled="!mp4ModelPower[3].isCheck" :all="true" style="display: inline-block"></commonDel> <!-- 批量删除 -->
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="offLine">
            <el-table-column  align="center" type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="MP4模型名称" width="" align="center"></el-table-column>
            <el-table-column prop="picUrl" label="gif展示" width="150" align="center">
                <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.picUrl?`/static/${scope.row.picUrl}`:''" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类型" width="150" align="center"></el-table-column>
            <el-table-column prop="androidResourcePackageSize" label="资源大小(M)" width="120" align="center">
                <template slot-scope="scope">
                <span>{{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4):0}}</span>
                <a style="cursor: pointer;" v-if="scope.row.androidMaterial" @click="download(scope.row.androidMaterial,scope.row.lyricFileName)"><img src="../../assets/download.png"/></a>
              </template>
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="动画时长" align="center"></el-table-column>
            <el-table-column prop="isLyric" label="歌词" align="center">
              <template slot-scope="scope">
                {{scope.row.lyricUrl?'是':'否'}}
                <a style="cursor: pointer;" v-if="scope.row.lyricUrl" @click="download(scope.row.lyricUrl,scope.row.name)"><img src="../../assets/download.png"/></a>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="durationTimeStr" label="总时长" width="100" align="center"></el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" width="100" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="100" align="center"></el-table-column>
            <el-table-column prop="updateUser" label="最后修改人" width="120" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="2"
                  inactive-color="#ccc"
                  @change="changState(scope.row.state,scope.row.id)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="250" fixed="right" align="center">
              <template slot-scope="scope">
                 <el-button type="primary" size="mini" @click="editOrLook(scope.row,false)" :disabled="!mp4ModelPower[1].isCheck">编辑</el-button>
                 <el-button type="warning" size="mini" @click="editOrLook(scope.row,true)" :disabled="!mp4ModelPower[2].isCheck" >查看</el-button>
                 <commonDel :id='[scope.row.id]' :disabled="!mp4ModelPower[3].isCheck" style="display: inline-block"></commonDel>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :total-num="totalNum" :router="true"></pagination>
        </div>
      </div>
      <div v-if="type=='box'">
        <div style="background:#f0f0f5;margin-top:10px;">
           <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
                <span class="myWords myWordsIpt">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="false" style="display: inline-block;" @change="changePage" ref="nameInput"></nameInput>
                </span>
                 <span class="myWords">
                <cascader   @changeVal="typeChange" :moduleId='110' ref="filter" style="display: inline-block;width: 200px"></cascader>
              </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id"  :cell-class-name="delLine">
            <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="selectable">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="55">
            </el-table-column>
            <el-table-column prop="name" label="MP4模型名称" width="">
            </el-table-column>
            <!-- <el-table-column prop="state" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2">下架</span>
            </template>
          </el-table-column> -->
            <el-table-column prop="materialCategoryName" label="所属类别">
            </el-table-column>
             <el-table-column prop="durationTimeStr" label="总时长">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :total-num="totalNum" :router="false" @change="changePage" ref="page"></pagination>
        </div>
      </div>
    </div>
</template>

<script>
  import {getTotal,pageModuleMaterial} from "../../http/request";
  import nameInput from '../tools/nameInput'
  import huSelect from '../tools/huSelect'
  import cascader from '../../share/cascader'
  import timeNew from '../../share/timeNew'
  import pagination from '../../share/page'
  import commonDel from '../../share/commonDel'
  import { Base64 } from 'js-base64';
  import {mapState} from 'vuex';
    export default {
        name: "cartoonmusicList",
        components:{
          nameInput,
          huSelect,
          cascader,
          timeNew,
          pagination,
          commonDel
        },
        props:['type','selectArr','isSelectOne','appId'],
        data(){
          return{
            timeValue:[],
            moduleId:'',
            tableData:[],
            totalNum:0,
            tableHeight:300,
            selectId:[],
            setSelectId:[],
            moduleTreeVal:'',
          }
        },
      computed:{
        ...mapState('currentUserPower',['mp4ModelPower']),
      },
      methods:{
        download(id,name){
        let url=`/static/${Base64.decode(id)}`;
        let aTag = document.createElement('a');
        let pathArr = url.split('/');
        let nameArr = pathArr[pathArr.length-1].split('.');
        aTag.style.display = "none";
        aTag.download = name+'.'+nameArr[nameArr.length-1];
        aTag.href = url;
        document.body.appendChild(aTag);
        aTag.click();
        URL.revokeObjectURL(aTag.href);    // 释放URL 对象
        document.body.removeChild(aTag);
        },
        handleSelectionChange(val){
        this.setSelectId=val.map(v=>v.id);
        this.selectId=val.map(v=>v.id);
        if(this.type=='box'){
        if(this.isSelectOne&&val.length>1){
          this.$refs.boxTable.toggleRowSelection(val[0],false);
          val.splice(0,1);
        }
        this.$emit('change',val);
      }
       },
       typeChange(arr,val){
        this.moduleTreeVal=val
        },
        getTotal(){
        this.timeValue=(this.$route.query.time&&JSON.parse(this.$route.query.time));
        let msg={
          name:this.$route.query.search||'',
          materialCategoryId:this.moduleTreeVal||'',
          pageNum:this.$route.query.page||1,
          pageSize:this.$route.query.limit||20,
          createTimeStart:this.timeValue?this.timeValue[0]:'',
          createTimeEnd:this.timeValue?this.timeValue[1]:'',
          module:110
        }
          getTotal(msg).then(res=>{
            this.totalNum=res.data.total;
            this.tableData=res.data.items.map(v=>{
              v.pic?v.picUrl=Base64.decode(v.pic):null;
              return v;
            });
          })
    },
        changePage(key,val){
        console.log(key,val)
        this.getBoxTotal();
      },
        getBoxTotal(){
        let msg={
          name:this.$refs.nameInput.reversedName,
          page:this.$refs.page.page,
          limit:this.$refs.page.limit,
          module:110,
          appId: this.appId||'',
          materialCategoryId:this.moduleTreeVal,
        }
        pageModuleMaterial(msg).then(res=>{
          this.totalNum=res.data.total;
          this.tableData=res.data.items
          if(this.selectArr){
            this.tableData.forEach(v=>{
              if(this.selectArr.indexOf(v.id)!=-1&&this.setSelectId.indexOf(v.id)==-1){//已经强制勾选过的过滤掉
                this.$refs.boxTable.toggleRowSelection(v,true);
              }
            })
          }
        })
    },
      delLine({ row, rowIndex}){
        if(row.isDel===1){
          return 'del_line_xu'
        }else if(row.state===2){
          return 'off_line_xu'
        }else{
          return ''
        }
      },
      offLine({ row, rowIndex}){
        if(row.state===2){
          return 'off_line_xu'
        }else{
          return ''
        }
      },
      selectable(row, index) {
            return !row.isDel
          },
      editOrLook(row,isLook){
      this.$emit('editOrLook',row,isLook);
      },
      changState(state,id){
      if(state==1){
        this.$confirm('确认上架吗？').then(u=>{
          upState(id).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.tableData.forEach(v=>{if(v.id==id){v.state=2;}});
            }else{
              this.$message.success('上架成功');
            }
          }).catch(err=>{
            this.tableData.forEach(v=>{if(v.id==id){v.state=2;}});
          })
        }).catch(error=>{
          this.tableData.forEach(v=>{if(v.id==id){v.state=2;}});
        })
      }else if(state==2){
        this.$confirm('确认下架吗？').then(u=>{
          offState(id).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.tableData.forEach(v=>{if(v.id==id){v.state=1;}});
            }else{
              this.$message.success('下架成功');
            }
          }).catch(err=>{
            this.tableData.forEach(v=>{if(v.id==id){v.state=1;}});
          })
        }).catch(error=>{
          this.tableData.forEach(v=>{if(v.id==id){v.state=1;}});
        })
      }    
    },
      },
      mounted() {
        console.log(this.selectArr,88888888888)
        this.selectId = this.selectArr?this.selectArr:[]
        this.selectArr?this.getBoxTotal():this.getTotal();
      },
      watch: {
        selectArr(){
       this.selectId = this.selectArr?this.selectArr:[];
       },
        moduleTreeVal(){
       if(this.type=='box'){
          this.getBoxTotal();
        }
     },
      $route(){
        if(this.type=='list'){
          this.getTotal();
        }
    }
      },
      updated(){
        this.$nextTick(()=>{
          this.$refs.listTable?this.tableHeight=window.innerHeight-this.$refs.listTable.$el.offsetTop-110:null;
        })
      },
    }
</script>

<style scoped>
</style>
<style>
  .myWordsIpt .el-input{
    width: 200px !important;
  }

</style>
