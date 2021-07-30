<template>
    <div style="display: inline-block">
      <div v-if="type=='classify'">
        <el-select :disabled="disabled" v-model="classifyValue" placeholder="请选择分类" @change="change('classify',classifyValue)" clearable>
          <el-option
            v-for="item in classifyOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div v-if="type=='animation'">
        <el-select :disabled="disabled" v-model="animationValue" placeholder="请选择动画类型" @change="change('animation',animationValue)" clearable>
          <el-option
            v-for="item in animationOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div v-if="type=='unity'">
        <el-select :disabled="disabled" v-model="unityValue" placeholder="请选择unity版本" @change="change('unity',unityValue)" clearable>
          <el-option
            v-for="item in unityOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div v-if="type=='pipeline'">
        <el-select :disabled="disabled" v-model="pipelineValue" placeholder="请选择渲染管道" @change="change('pipeline',pipelineValue)" clearable>
          <el-option
            v-for="item in pipelineOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div v-if="type=='music'">
        <el-select :disabled="disabled" v-model="musicValue" placeholder="请选择音乐分类" @change="change('music',musicValue)" clearable>
          <el-option
            v-for="item in musicOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div v-if="type=='operation'">
        <el-select :disabled="disabled" v-model="operationValue" placeholder="请选择平台分类" @change="change('operation',operationValue)" clearable>
          <el-option
            v-for="item in operationOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
</template>

<script>
  // <huSelect :type="`music`" :value="mValue" ref="music"></huSelect>
  // console.log(this.$refs.music.musicValue,9999)
  import {getU3d} from "../../http/request";

  export default {
        name: "huSelect",
        data() {
          return {
            classifyOptions: [],
            classifyValue: '',
            animationValue:'',
            animationOptions:[],
            unityValue:'',
            unityOptions:[],
            pipelineValue:'',
            pipelineOptions:[],
            musicValue:'',
            musicOptions:[],
            operationValue:null,
            operationOptions:[
              {
                name:'安卓',value:0
              },
              {
                name:'IOS',value:1
              },
              {
                name:'WINDOWS',value:2
              },
              {
                name:'UWP',value:3
              }
            ]
          }
      },
      inject:['replace'],
      props:['type','value','router','disabled'],
      methods:{
        getOptions(id){
          return new Promise(resolve => {
            getU3d(id).then(res=>{
              resolve(res);
            })
          })
        },
        setOptions(id){
          id==2&&(()=>{
            this.getOptions(id).then(v=>{
              //console.log(v,888);
              this.unityOptions=v.data;
            })
          })();
          id==1&&(()=>{
            this.getOptions(id).then(v=>{
              //console.log(v,888);
              this.pipelineOptions=v.data;
            })
          })();
          id==3&&(()=>{
            this.getOptions(id).then(v=>{
              //console.log(v,888);
              this.animationOptions=v.data;
            })
          })();
          id==4&&(()=>{
            this.getOptions(id).then(v=>{
              //console.log(v,888);
              this.musicOptions=v.data;
            })
          })();
        },
        change(key,val){
          console.log(key,val)
          this.$emit('change',key,val)
          this.router&&(()=>{
            this.replace('page',1)
            this.replace(key,val)
          })();

        }
      },
      created() {
          this.router?(()=>{
            this.animationValue=this.$route.query.animation||'';
            this.musicValue=this.$route.query.music||'';
            this.unityValue=this.$route.query.unity||'';
            this.pipelineValue=this.$route.query.pipeline||'';
          })():(()=>{
            this.type=='unity'&&(()=>{
              this.unityValue=this.value;
          })();
            this.type=='pipeline'&&(()=>{
              this.pipelineValue=this.value
            })();
            this.type=='animation'&&(()=>{
              this.animationValue=this.value;
            })();
            this.type=='music'&&(()=>{
             this.musicValue=this.value;
            })();
          })();
          this.type=='unity'&&(()=>{
              this.setOptions(2);
          })();
          this.type=='pipeline'&&(()=>{
            this.setOptions(1);
          })();
          this.type=='animation'&&(()=>{
            this.setOptions(3);
          })();
          this.type=='music'&&(()=>{
            this.setOptions(4);
          })();
      },
      watch:{
          value(val){
            this.type=='unity'&&(()=>{
              this.unityValue=this.value;
            })();
            this.type=='pipeline'&&(()=>{
              this.pipelineValue=this.value
            })();
            this.type=='animation'&&(()=>{
              this.animationValue=this.value;
            })();
            this.type=='music'&&(()=>{
              this.musicValue=this.value;
            })();
          }
      }
    }
</script>

<style scoped>

</style>
