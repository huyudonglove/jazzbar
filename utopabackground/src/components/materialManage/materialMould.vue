<template>
  <div>
    <div v-if="$route.name=='materialMould'">
      <div>
       <div class="layoutD">
          <div class="leftD">
            asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg asdfg
          </div>
          <div class="rightD">
              <el-tabs type="border-card" v-model="activeName">
              <el-tab-pane label="组件"  name="first">
                 <p class="font20">主节点</p>
                 <el-button type="primary">MP4模型</el-button>
                 <p class="font20">素材节点</p>
                 <el-button type="primary">资源素材</el-button>
              </el-tab-pane>
              <el-tab-pane label="属性" :disabled="true"  name="second">
                 <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="活动名称">
                <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动区域">
                  <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="活动时间">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                  </el-col>
                </el-form-item>
                  </el-form>
              </el-tab-pane>

            </el-tabs>
          </div>
       </div>
       <div style="height:46px;font-size:20px;font-weight:bold;color:#614a4d;line-height:56px">
       载体模型素材
      </div>
        <div style="background:#f0f0f5;margin-top:10px">
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span class="myWords">
            应用名称:
            <el-input
              placeholder="输入应用名称"
              class="input-with-select pl15"
              style="width: 20%"
              v-model="wd"
            ></el-input>
          </span>
          <span class="myWords">
            玩法筛选：
            <el-select v-model="select" placeholder="请选择"  style="width:150px;">
              <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.name"
              :value="item.id">
            </el-option>
            </el-select>
          </span>
          <span class="myWords">
            Unity版本：
            <el-select v-model="unitySelect" placeholder="请选择" style="width:150px;">
              <el-option
              v-for="item in unityOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
            </el-select>
          </span>
          <span class="myWords">
            渲染管线：
            <el-select v-model="lineSelect" placeholder="请选择" style="width:150px;">
              <el-option
              v-for="item in lineOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
            </el-select>
          </span>
          <span>
            <el-button  type="danger"  @click="delAll()">批量删除</el-button>
          </span>
        </el-row>
        </div>
        <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :max-height="tableHeight" border @cell-click="deleteCell">
        <el-table-column
        align="center"
        type="selection"

        width="55">
        </el-table-column>
          <el-table-column prop="id" label="id" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.id}}</template>
          </el-table-column>
          <el-table-column prop="name" :label="'应用名称'" width="200" align="center">
            <template slot-scope="scope">{{ scope.row.name}}</template>
          </el-table-column>
          <el-table-column prop="playName" :label="'玩法'" width="150" align="center"></el-table-column>
          <el-table-column prop="unityVersion" :label="'Unity版本'" width="150" align="center"></el-table-column>
          <el-table-column prop="loadingLine" :label="'渲染管线'" width="150" align="center"></el-table-column>
          <el-table-column prop="state" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width align="center"></el-table-column>
          <el-table-column prop="updateBy" label="最后修改人" width align="center"></el-table-column>
          <el-table-column label="上下架" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-value="1"
                inactive-value="2"
                @change="upState(scope.row.state,scope.row.id)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250" fixed="right">
            <template slot-scope="scope">
                <el-button
                type="success"
                size="mini"
              >通过</el-button>
                <el-button
                type="warning"
                size="mini"
              >查看</el-button>
              <el-button
                type="danger"
                size="mini"
              >拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
		<div style="margin-top:15px"> <pagination v-if="showPagination"></pagination></div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {applicationPlay,applicationConfigList} from "../../http/request";
import { mapState, mapActions } from "vuex";
import pagination from '../../share/pagination'
export default {
  name: "materialMould",
  inject:['replace','reload'],
  data(){
	  return{
    select:"",
    lineSelect:'',
    unitySelect:'',
    options:[],
    lineOptions:[],
    unityOptions:[],
		wd:"",
		showPagination:false,
    dialogVisible:false,
    activeName: 'second',
    tableData:[
      {
        createBy: null,
        createTime: "2020-07-24 15:54:24",
        id: 77,
        loadingLine: "LWRP",
        name: "魔幻演奏应用",
        playId: 8,
        playName: "魔幻表演",
        remark: null,
        state: 1,
        status: null,
        unityVersion: "2019.3.1f1",
        updateBy: "Utopaar后台管理员",
        updateTime: "2020-07-24 15:54:24",
      },
        {
        createBy: null,
        createTime: "2020-07-24 15:54:24",
        id: 77,
        loadingLine: "LWRP",
        name: "魔幻演奏应用",
        playId: 8,
        playName: "魔幻表演",
        remark: null,
        state: 1,
        status: null,
        unityVersion: "2019.3.1f1",
        updateBy: "Utopaar后台管理员",
        updateTime: "2020-07-24 15:54:24",
      },
       {
        createBy: null,
        createTime: "2020-07-24 15:54:24",
        id: 77,
        loadingLine: "LWRP",
        name: "魔幻演奏应用",
        playId: 8,
        playName: "魔幻表演",
        remark: null,
        state: 1,
        status: null,
        unityVersion: "2019.3.1f1",
        updateBy: "Utopaar后台管理员",
        updateTime: "2020-07-24 15:54:24",
      }
    ],
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
    tableHeight:0,
	  }
  },
  created(){
  let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
	this.init(query).then(res=>{
		this.$store.commit('pagination/setTotal',this.total);
  })
	this.$nextTick(()=>{
		this.$store.commit('pagination/setClickPage',pageRecord);
		this.$store.commit('pagination/setLimitPage',limitRecord);
		this.showPagination = true;//加载分页组件
})
  },
  computed:{
	...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('applicationList',{total:'total',currentRow:'currentRow'}),
  ...mapState('currentUserPower',{appPower:'appPower'}),
  },
  methods:{
	  ...mapActions('applicationList',['init','upper','lower','del']),
	  handleSelectionChange(val) {
		this.multipleSelection = val;
		this.multipleSelectionId=this.multipleSelection.map(v=>v.id)
	  },

    delAll(){
       this.multipleSelection.length?this.del({appIds:this.multipleSelectionId}).then(v=>{this.reload()}):this.$message.error('最少选择一项删除项');
    },
    tableRowClassName({row, rowIndex}) {
	    console.log(row,77777777)
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    deleteCell(row){
	    console.log(row)
    }
  },
  watch:{
	page(){
		this.replace("page",this.page);
    },
    limit(){
       this.replace('limit',this.limit);
    },
    wd(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('wd',this.wd);

    },
    select(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('select',this.select);
    },
    unitySelect(){
        this.$store.commit('pagination/setClickPage',1);
        this.unitySelect !=='全部'?this.replace('unitySelect',this.unitySelect):this.replace('unitySelect','');

    },
    lineSelect(){
        this.$store.commit('pagination/setClickPage',1);
        this.lineSelect !=='全部'?this.replace('lineSelect',this.lineSelect):this.replace('lineSelect','');
    },
	$route(){//判断路由query变化执行请求
      if(this.$route.name=='applicationList'){
      this.init(this.$route.query).then(res=>{
      this.$store.commit('pagination/setTotal',this.total);
      this.$store.commit('pagination/setLimitPage',this.$route.query.limit)
      this.$store.commit('pagination/setClickPage',this.$route.query.page)
		})
      }
    }
  },
  updated(){
    if(this.$route.name=='materialMould'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      })
    }
  },
  components: {
    pagination
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

 .el-table .warning-row {
   background: oldlace;
 }

.el-table .success-row {
  background: #f0f9eb;
}

</style>
