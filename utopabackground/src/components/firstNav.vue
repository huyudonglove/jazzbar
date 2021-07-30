<template>
    <div>
      欢迎登录Utopa AR 后台
<!--      <name-input :name-disabled="false" :name-holder="1111111" ref="nameInput" :name-input="name" :router="true"></name-input>-->
<!--      <button @click="aa">1111</button>-->
<!--      <huSelect :type="`animation`" :value="aValue" ref="animation" :router="true" @change="change"></huSelect>-->
<!--      <huSelect :type="`music`" :value="mValue" ref="music" :router="true" @change="change"></huSelect>-->
<!--      <huSelect :type="`unity`" :value="uValue" ref="unity" :router="true" @change="change"></huSelect>-->
<!--      <huSelect :type="`pipeline`" :value="pValue" ref="pipeline" :router="true" @change="change"></huSelect>-->
<!--      <huRadio :radio-value="rValue" ref="radio"></huRadio>-->
<!--      <cascader  @changeVal="changeVal" :moduleId='moduleId' ref="normal"  ></cascader>  &lt;!&ndash; 普通用法 例如新增 编辑 &ndash;&gt;-->
<!--      <cascader  @changeVal="changeVal" :moduleId='moduleId' ref="normal"   :queryMaterialId="129" :id="481"></cascader>  &lt;!&ndash; 普通用法 例如新增 编辑 &ndash;&gt;-->
<!--      <cascader  @changeVal="changeVal" :routeParams="true" :moduleId='moduleId' ref="filter"></cascader> &lt;!&ndash; 增加路由 例如过滤数据 &ndash;&gt;-->
<!--      <commonDel :id='[id]' :disabled='disabled'></commonDel> &lt;!&ndash; 默认(后台素材) 删除 &ndash;&gt;-->
<!--      <commonDel :id='ids' :disabled='disabled' :all="true"></commonDel> &lt;!&ndash; 默认(后台素材) 批量删除 &ndash;&gt;-->
<!--      <commonDel :id='ids' :disabled='disabled' :all="true" http="/api/utopa/ar/material/group/batchDelete"></commonDel> &lt;!&ndash;传接口的 批量删除 &ndash;&gt;-->
<!--      <upLoad @getFileData="getFileData" name="123.jpg" size="2" type="utopa/html"></upLoad>-->
<!--       &lt;!&ndash; name(必传)，用于区分编辑和新增 size(可选)限制大小,单位M type(可选)限制上传后缀名可用斜杆多选，如"jpg/png"&ndash;&gt;-->
<!--      <downLoad :row="row"></downLoad>-->
<!--    <el-button type="primary" @click="showP">预览</el-button>-->
<!--    <div v-if="showPlay">-->
<!--      <playDialog type="gif" :src="playSrc" @closePlay="showPlay=false"></playDialog>-->
<!--      &lt;!&ndash; type==>img\gif都是展示图片 music为音乐播放 video为视频播放&ndash;&gt;-->
<!--    </div>-->

    </div>
</template>

<script>

  import nameInput from './tools/nameInput'
  import huSelect from './tools/huSelect'
  import huRadio from './tools/huRadio'
  import cascader from '../share/cascader'
  import commonDel from '../share/commonDel'
  import upLoad from '../share/upLoad'
  import playDialog from '../share/playDialog'
  import downLoad from '../share/downLoad'
  export default {
        name: "firstNav",
        data(){
          return{
            name:'',
            aValue:'',
            mValue:'',
            uValue:'',
            pValue:'',
            rValue:'2',
            moduleTree:[],
            moduleTreeNormal:'',//普通
            moduleTreeFilter:'',//过滤
            moduleTreeSelectArray:[],//编辑的数组
            moduleId:101,
            id:322,
            ids:[],
            disabled:false,
            showPlay:false,
            playSrc:'',
            row:{
             windowsMaterial: "Z3JvdXAxL00wMC8wMC82Mi9DZ1Vja0Y5RXl1LUFadXljQUgwbHFCOC1LbmM2LnV0b3Bh",
             uwpMaterial: "Z3JvdXAxL00wMC8wMC82Mi9DZ1Vja0Y5RXl1R0FQUy0zQUJRbXBTU3dyc1k4LnV0b3Bh",
             iosMaterial: "Z3JvdXAxL00wMC8wMC82Mi9DZ1Vja0Y5RXl0S0FKTVR0QUJRbXBTU3dyc1k0LnV0b3Bh",
             androidMaterial: "Z3JvdXAxL00wMC8wMC82Mi9DZ1Vja0Y5RXlzS0FXRkNCQUgwbHFCOC1LbmM4LnV0b3Bh",
            }
          }
        },
        components:{
          nameInput,
          huSelect,
          huRadio,
          cascader,
          commonDel,
          upLoad,
          playDialog,
          downLoad
        },
        methods:{
          aa(){
            console.log(this.$refs.nameInput.reversedName,8888);
            console.log(this.$refs.music.musicValue,9999)
            console.log(this.$refs.radio.radio,11111)
          },

          change(key,val){
            console.log(key,val)
          },

          changeVal(val){
            this.moduleTreeNormal=this.$refs.normal.moduleTreeVal
            this.moduleTreeFilter=this.$refs.filter.moduleTreeVal
            console.log(this.$refs.normal.moduleTreeVal,this.$refs.filter.moduleTreeVal)
          },
          getFileData(data){//获取上传文件信息data包含fileId和name值,size,duration
            console.log(data)
          },
          showP(){
            this.showPlay=true;
            this.playSrc='/static/group1/M00/00/61/CgUckF9DiN-AX8qPAABwgN2vxiE053.jpg';
          }
        },
        watch:{
        },
        created(){
        },

    }
</script>

<style scoped>

</style>
