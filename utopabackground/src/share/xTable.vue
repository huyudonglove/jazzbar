<template>
  <div>
    <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border>
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column v-for="(item,i) in tableProps" :key="i" :prop="item.prop||''" :label="item.label" :width="item.width||''" align="center">
        <template v-if="item.template" slot-scope="scope">
          <div v-if="item.label.indexOf('gif')!=-1">
            <span style="cursor: pointer">  
              <img :src="`/api/file/get/${scope.row[item.prop]}`" alt=""  style="width:100px;height:100px" v-focus>
            </span>
          </div>
          <div v-if="item.label=='上架状态'">
            <el-switch
              v-model="scope.row[item.prop]"
              active-value="1"
              inactive-value="2"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {getTotal} from '../http/request'
export default {
  name:'xTable',
  data(){
    return{
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
        }
      ],
      tableProps:[
        {
          "prop":'id',
          "label":'ID',
          "width":"50"
        },
        {
          "prop":'name',
          "label":'视频名称',
          "width":""
        },
        {
          "prop":'pic',
          "label":'gif展示',
          "width":"",
          "template":true
        },
        {
          "prop":'materialCategoryName',
          "label":'所属类型',
          "width":""
        },
        {
          "prop":'androidResourcePackageSize',
          "label":'资源大小(M)',
          "width":""
        },
        {
          "prop":'durationTimeStr',
          "label":'总时长',
          "width":""
        },
        {
          "prop":'createTime',
          "label":'创建时间',
          "width":""
        },
        {
          "prop":'updateTime',
          "label":'修改时间',
          "width":""
        },
        {
          "prop":'updateUser',
          "label":'最后修改人',
          "width":""
        },
        {
          "prop":'state',
          "label":'上架状态',
          "width":"",
          "template":true
        }
      ]
    }
  },
  methods:{
    handleSelectionChange(val){

    },
    getTotal(){
      let params={
        name:'',
        materialCategoryId:'',
        pageNum:1,
        pageSize:20,
        createTimeStart:'',
        createTimeEnd:'',
        module:'107',
        unityVersion:'',
        loadingLine:'',
        viewType:'',
        materialFormat:''
      }
      getTotal(params).then(res=>{
        this.tableData = res.data.items;
      })
    }
  },
  created(){
    this.getTotal();
  }
}
</script>
<style scoped>

</style>