<template>
    <div>
      <div v-if="type=='list'">
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
                <span class="myWords">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="true" style="display: inline-block;" ref="nameInput"></nameInput>
                </span>
            <span class="myWords">
                <cascader  :routeParams="true" :moduleId='`109`' ref="filter" style="display: inline-block"></cascader>
            </span>
            <span class="myWords">
                  <timeNew :router="true"></timeNew>
            </span>
            <span class="myWords">
                <huSelect :type="`unity`" :value="uValue" ref="unity" :router="true" @change="change" style="display: inline-block"></huSelect>
            </span>
            <span class="myWords">
              <huSelect :type="`pipeline`" :value="pValue" ref="pipeline" :router="true" @change="change" style="display: inline-block"></huSelect>
            </span>
            <span>
              <huSelect :type="`music`" :value="mValue" ref="music" :router="true" @change="change"></huSelect>
            </span>
            <span>
              <commonDel :id='selectId' :disabled="!animationMusicPower[3].isCheck" v-if="animationMusicPower.length" :all="true" style="display: inline-block"></commonDel>
            </span>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="listTable" row-key="id" :max-height="tableHeight" :cell-class-name="offLine">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="55">
            </el-table-column>
            <el-table-column prop="name" label="曲目名称" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
                <a style="cursor: pointer;" v-if="scope.row.fileId" @click="download(scope.row.fileId,scope.row.fileName)"><img src="../../assets/download.png"/></a>
              </template>
            </el-table-column>
            <el-table-column prop="materialFormat" label="音乐格式" width="80">
            </el-table-column>
            <el-table-column prop="pic" label="动画展示">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.picUrl?`/static/${scope.row.picUrl}`:''" alt=""  style="width:100px;height:100px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="总时长">
            </el-table-column>
            <el-table-column prop="address" label="素材包">
              <template slot-scope="scope" v-if="showDown">
                <downLoad :row="scope.row"></downLoad>
              </template>
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类别">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
            </el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="180">
            </el-table-column>
            <el-table-column prop="updateUser" label="最后修改人">
            </el-table-column>
            <el-table-column prop="state" label="状态">
              <template slot-scope="scope">
                <!-- <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2">下架</span> -->
                <el-switch v-model="scope.row.state" :active-value="1" :inactive-value="2" inactive-color="rgb(220,223,230)"
                  @change="switchState(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="250">
              <template slot-scope="scope" v-if="animationMusicPower.length">
                <el-button size="mini" @click="buttonClick('edit',scope.row)" type="primary" :disabled="!animationMusicPower[1].isCheck">编辑</el-button>
                <el-button size="mini" @click="buttonClick('watch',scope.row)" type="warning" :disabled="!animationMusicPower[2].isCheck">查看</el-button>
                <commonDel :id='[scope.row.id]' :disabled="!animationMusicPower[3].isCheck"></commonDel>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :total-num="totalNum" :router="true"></pagination>
        </div>
      </div>
      <div v-if="type=='box'">
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <div>
              <span class="myWords myWordsIpt">
                  <nameInput :name-disabled="false" :name-holder="`请输入名称`"  :router="false" style="display: inline-block;" @change="changePage" ref="nameInput" ></nameInput>
                </span>
              <span class="myWords">
                <huSelect :type="`operation`"  ref="operationBox"  @change="changePage" style="display: inline-block;width: 180px" ></huSelect>
              </span>
            </div>
            <div>
              <span>
                <huSelect :type="`unity`" ref="unityBox"  @change="changePage"  style="display: inline-block;width: 180px;margin-top:10px"></huSelect>
              </span>
              <!-- <span>
                <huSelect :type="`pipeline`"  ref="pipelineBox"  @change="changePage"  style="display: inline-block;width: 200px"></huSelect>
              </span> -->
              <span>
                  <cascader  @changeVal="change" :routeParams="true" :moduleId='`109`' ref="filter" style="display: inline-block"></cascader>
              </span>
            </div>
          </el-row>
        </div>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange" border  ref="boxTable" row-key="id" :cell-class-name="delLine">
            <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="selectable">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="55">
            </el-table-column>
            <el-table-column prop="name" label="曲目名称" width="180">
            </el-table-column>
            <el-table-column prop="address" label="平台/版本/管道" width="160">
              <template slot-scope="scope">
                <downLoad :row="scope.row" type="box"></downLoad>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2">下架</span>
              </template>
            </el-table-column>
            <el-table-column prop="materialFormat" label="音乐格式" width="80">
            </el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类别">
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
  import {getTotal,pageModuleMaterial,upState,offState} from "../../http/request";
  import nameInput from '../tools/nameInput'
  import huSelect from '../tools/huSelect'
  import cascader from '../../share/cascader'
  import timeNew from '../../share/timeNew'
  import pagination from '../../share/page'
  import commonDel from '../../share/commonDel'
  import { Base64 } from 'js-base64';
  import downLoad from '../../share/downLoad'
  import { mapState } from "vuex";
    export default {
        name: "cartoonmusicList",
        components:{
          nameInput,
          huSelect,
          cascader,
          timeNew,
          pagination,
          commonDel,
          downLoad
        },
        props:['type','selectArr','isSelectOne','appId'],
        data(){
          return{
            pianoName:'',
            timeValue:[],
            moduleId:'',
            tableData:[],
            totalNum:0,
            tableHeight:300,
            uValue:'',
            pValue:'',
            mValue:'',
            selectId:[],
            setSelectId:[],
            showDown:false
          }
        },
      computed:{
        ...mapState('currentUserPower',['animationMusicPower']),
      },
      methods:{
        change(){
          this.getBoxTotal();
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
        getTotal(){
          this.timeValue=(this.$route.query.time&&JSON.parse(this.$route.query.time));
          let msg={
            name:this.$route.query.search||'',
            materialCategoryId:this.$route.query.moduleTreeVal||'',
            pageNum:this.$route.query.page||1,
            pageSize:this.$route.query.limit||20,
            createTimeStart:this.timeValue?this.timeValue[0]:'',
            createTimeEnd:this.timeValue?this.timeValue[1]:'',
            module:109,
            unityVersion:this.$route.query.unity||'',
            loadingLine:this.$route.query.pipeline||'',
            materialFormat:this.$route.query.music||''
          }
           this.showDown=false
          getTotal(msg).then(res=>{
            this.totalNum=res.data.total;
            this.showDown=true
            this.tableData=res.data.items.map(v=>{
              v.pic?v.picUrl=Base64.decode(v.pic):null;
              v.placeholderPictureUrl?v.placeUrl=Base64.decode(v.placeholderPictureUrl):null;
              return v;
            });
          })
        },
        changePage(key,val){
          //console.log(key,val)
          this.getBoxTotal();
        },
        buttonClick(key,val){
          console.log(key,val);
          this.$emit('buttonClick',key,val)
        },
        getBoxTotal(){
          let msg={
            name:this.$refs.nameInput.reversedName,
            page:this.$refs.page.page,
            limit:this.$refs.page.limit,
            module:109,
            appId: this.appId||'',
            materialCategoryId:this.$refs.filter.moduleTreeVal
          }
          pageModuleMaterial(msg).then(res=>{
            this.totalNum=res.data.total;
            this.tableData=res.data.items.map(v=>{
              v.pic?v.pic=Base64.decode(v.pic):null;
              return v;
            });
            if(this.selectArr){
              this.tableData.forEach(v=>{
                if(this.selectArr.indexOf(v.id)!=-1&&this.setSelectId.indexOf(v.id)==-1){//已经强制勾选过的过滤掉
                  this.$refs.boxTable.toggleRowSelection(v,true);
                }
              })
            }
          })
        },
        selectable(row, index) {
          return !row.isDel
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
      download(id,name){
        let url=`/static/${Base64.decode(id)}`;
        let aTag = document.createElement('a');
        let pathArr = url.split('/');
        let nameArr = pathArr[pathArr.length-1].split('.');
        aTag.style.display = "none";
        aTag.download = name;
        aTag.href = url;
        document.body.appendChild(aTag);
        aTag.click();
        URL.revokeObjectURL(aTag.href);    // 释放URL 对象
        document.body.removeChild(aTag);
      },
      switchState(row){
        let word;
        row.state==1?word='上架':word='下架';
        this.$confirm(`确认${word}吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res=>{
          if(row.state==1){
            upState(row.id).then(v=>{
              this.getTotal();
            })
          }else{
            offState(row.id).then(v=>{
              this.getTotal();
            })
          }
        })).catch(()=>{
          if(row.state==1){
            row.state=2
          }else{
            row.state=1
          }
        })
      }
    },
      mounted() {
        this.selectId = this.selectArr?this.selectArr:[]
        this.selectArr?this.getBoxTotal():this.getTotal();
      },
      watch:{
        selectArr(){
          this.selectId = this.selectArr?this.selectArr:[];
        },
        $route(){
          this.type=='list'&&(()=>{
            this.getTotal();
          })();
        }
      },
      updated() {
          this.$nextTick(()=>{
            this.$refs.listTable?this.tableHeight=window.innerHeight-this.$refs.listTable.$el.offsetTop-110:null;
          })
      }
    }
</script>

<style>
  .myWordsIpt .el-input{
    width: 200px !important;
  }

</style>
<style scoped>

</style>
