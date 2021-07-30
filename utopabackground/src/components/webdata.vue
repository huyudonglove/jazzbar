<template>
    <div @mouseup="up()">
      <button @click="createLine">新增</button><button @click="aa">+++++</button><button @click="arrange">整理</button>
      <svg  version="1.1" xmlns="http://www.w3.org/2000/svg" style="background: #2c3e50;width: 800px;height: 500px;position: static" @mousemove="move()"  >
        <g transform="matrix(1, 0, 0, 1, 0, 0)" width="100%" height="100%">
          <line class="h-p" @click="deleteLine(index)" v-for="(item,index) in line"  :x1="item.parent.rightX" :y1="item.parent.rightY" :x2="item.child.leftX" :y2="item.child.leftY" style="stroke:rgb(255,0,0);stroke-width:2" :key="index"/>
          <g v-for="(item,index) in first"  fill="white" stroke-width="5" :style="`transform:translate(${item.selfX}px,${item.selfY}px)` "  class="h-p"
             @mousedown="down(item,index,'first')"   @mouseenter="enter(item)" @mouseleave="leave(item)" :key="index+10"
            >
            <rect width="80" height="50"   :fill="item.filledColor" @contextmenu.prevent="right(item)"/>
            <text x="25" y="20"  style="fill:red">{{item.name}}{{item.id}}</text>
            <circle cx="80" cy="20" r="5" v-if="item.rightCircle" stroke-width="2" :fill="item.rightColor" data-position="r"/>
            <image xlink:href="../assets/de.png" x="70" y="-5" height="15" width="15" data-image="1" v-if="item.delete" />
            <image xlink:href="../assets/more.png" x="50" y="40" height="20" width="20" data-image="2" v-if="item.detail"/>
            <image xlink:href="../assets/music.png" x="10" y="40" height="20" width="20" data-image="3" v-if="item.music"/>
          </g>
          <g v-for="(item,index) in second" fill="white" stroke-width="5" :style="`transform:translate(${item.selfX}px,${item.selfY}px)` "  class="h-p"
             @mousedown="down(item,index,'second')"  :key="index+50">
            <rect width="80" height="50"   :fill="item.filledColor" @contextmenu.prevent="right(item)"/>
            <text x="25" y="20"  style="fill:red">{{item.name}}{{item.id}}</text>
            <circle cx="4" cy="25" r="5" v-if="item.leftCircle" stroke-width="l" :fill="item.leftColor" data-position="l" />
            <image xlink:href="../assets/de.png" x="70" y="-5" height="15" width="15" data-image="1" v-if="item.delete" />
            <image xlink:href="../assets/more.png" x="50" y="40" height="20" width="20" data-image="2" v-if="item.detail"/>
            <image xlink:href="../assets/music.png" x="10" y="40" height="20" width="20" data-image="3" v-if="item.music"/>
            <circle cx="80" cy="25" r="5" data-position="r" v-if="item.rightCircle" :fill="item.rightColor"/>
          </g>
          <g v-for="(item,index) in third" fill="white" stroke-width="5" :style="`transform:translate(${item.selfX}px,${item.selfY}px)` "  class="h-p"
             @mousedown="down(item,index,'third')" :key="index+100" >
            <rect width="80" height="50"   :fill="item.filledColor" @contextmenu.prevent="right(item)"/>
            <text x="25" y="20"  style="fill:red">{{item.name}}{{item.id}}</text>
            <circle cx="4" cy="25" r="5" v-if="item.leftCircle" stroke-width="l" :fill="item.leftColor" data-position="l" />
            <image xlink:href="../assets/de.png" x="70" y="-5" height="15" width="15" data-image="1" v-if="item.delete" />
            <image xlink:href="../assets/more.png" x="50" y="40" height="20" width="20" data-image="2" v-if="item.detail"/>
            <image xlink:href="../assets/music.png" x="10" y="40" height="20" width="20" data-image="3" v-if="item.music"/>
            <circle cx="80" cy="25" r="5" data-position="r" v-if="item.rightCircle" :fill="item.rightColor"/>
          </g>

        </g>
      </svg>
    </div>
</template>

<script>
  import http from 'axios'
  import webdata from '../../static/webdata'
  export default {
    name: 'webdata',
    data(){
      return{
        newData:{},
        first:[
          {
            id:1,
            type:1,
            selfX:20,
            selfY:20,
            selfColor:'red',
            filledColor:'rgb(146,146,146)',
            name:'ceshi',
            leftColor:'green',
            rightColor:'green',
            leftCircle:false,
            rightCircle:true,
            music:false,
            img:false,
            video:false,
            delete:true,
            detail:false,
            main:true,
            musicUrl:'',
            imgUrl:'',
            videoUrl:'',
            lineIdTotal:[],
            rightX:0,
            rightY:0,
            leftX:0,
            leftY:0
          }
        ],
        second:[
          {
            id:2,
            type:2,
            selfX:80,
            selfY:80,
            selfColor:'red',
            filledColor:'rgb(146,146,146)',
            name:'ceshi',
            leftColor:'green',
            rightColor:'green',
            leftCircle:true,
            rightCircle:true,
            music:false,
            img:false,
            video:false,
            delete:true,
            detail:false,
            main:true,
            musicUrl:'',
            imgUrl:'',
            videoUrl:'',
            lineIdTotal:[],
            rightX:0,
            rightY:0,
            leftX:0,
            leftY:0
          },

        ],
        third:[
          {
            id:3,
            type:3,
            selfX:160,
            selfY:160,
            selfColor:'red',
            filledColor:'rgb(146,146,146)',
            name:'ceshi',
            leftColor:'green',
            rightColor:'green',
            leftCircle:true,
            rightCircle:false,
            music:false,
            img:false,
            video:false,
            delete:true,
            detail:false,
            main:true,
            musicUrl:'',
            imgUrl:'',
            videoUrl:'',
            lineIdTotal:[],
            rightX:0,
            rightY:0,
            leftX:0,
            leftY:0
          },
        ],
        line:[],
        drag:false,
        item:null,
      }
    },
    methods:{
      addA(){
        this.first.map(v=>{
          this.newData.addPC(v)
        })
        this.second.map(v=>{
          this.newData.addPC(v)
        })
        this.third.map(v=>{
          this.newData.addPC(v)
        })
      },
      createLine(){
        console.log(this.first,777)
      },
      getRect(item,p){
        console.log(111111)
        item.x=window.event.offsetX;
        item.y=window.event.offsetY;
        p=='l'&&(()=>{
          item.leftX=window.event.offsetX;
          item.leftY=window.event.offsetY;
        })();
        p=='r'&&(()=>{
          item.rightX=window.event.offsetX;
          item.rightY=window.event.offsetY;
        })();
        var line=this.newData.drawLine(item);
        console.log(item);
        line&&(()=>{
          this.newData.lineData(this.line);
          //console.log(this.line,7777777);

        })();
      },
      deleteLine(index){
        this.newData.deleteLine(index);
        console.log(this.first,888)
      },
      down(item,index,num){
        var e=window.event;
        let key=window.event.target.nodeName;
        if(key=='circle'){
            let position=e.target.dataset.position;
            this.getRect(item,position);
        }else if(key=='image'){
          e.target.dataset.image=='1'&&(()=>{
            let id=this[num][index].id
            item.type==1&&(()=>{
              this.second.map(v=>{
                v.parent.forEach(function(item, index, arr) {
                  if(item==id) {
                    arr.splice(index, 1);
                  }
                })
                v.parent.length==0&&(()=>{
                  v.leftColor='green'
                })();
              })
            })();
            item.type==2&&(()=>{
              this.third.map(v=>{
                v.parent.forEach(function(item, index, arr) {
                  if(item==id) {
                    arr.splice(index, 1);
                  }
                })
                v.parent.length==0&&(()=>{
                  v.leftColor='green'
                })();
              })
              this.first.map(v=>{
                delete v.children[id];
                Object.keys(v.children).length==0&&(()=>{
                  v.rightColor='green'
                })();
              })
            })();
            item.type==3&&(()=>{
              this.second.map(v=>{
                delete v.children[id];
                Object.keys(v.children).length==0&&(()=>{
                  v.rightColor='green'
                })();
              })
            })();
            this[num].splice(index,1);
            this.newData.batchDelete(item.lineIdTotal);
          })();
          e.target.dataset.image=='2'&&(()=>{
            console.log(77777)
          })();
        } else {
          this.drag=true;
          this.item=item;
        }
      },
      up(){
        this.drag=false;
      },
      move(){
        if(!this.drag) {
          return ;
        }else {
          this.item.selfX=window.event.offsetX;
          this.item.selfY=window.event.offsetY;
          this.item.rightX=window.event.offsetX+82;
          this.item.rightY=window.event.offsetY+22;
          this.item.leftX=window.event.offsetX;
          this.item.leftY=window.event.offsetY+20;
        }
      },
      enter(item){
        item.music=true;
        item.detail=true;
      },
      leave(item){
        item.music=false;
        item.detail=false;
      },
      right(item){
        console.log(window.event);
        item.type==3&&(()=>{
          var a=JSON.parse(JSON.stringify(item))
          this.third.push(this.newData.copyData(a))
        })();
        item.type==2&&(()=>{
          var a=JSON.parse(JSON.stringify(item));
          a.parent=[];
          a.children={};
          this.second.push(this.newData.copyData(a));
          let miniChildren=JSON.parse(JSON.stringify(item.children));
          let keys=Object.keys(miniChildren);
          keys.map(v=>{
            this.third.push(this.newData.copyData(miniChildren[v]));
            this.newData.copyLine(a,miniChildren[v],this.line)
          })
        })();
        item.type==1&&(()=>{
          var a=JSON.parse(JSON.stringify(item));
          this.first.push(this.newData.copyData(a));
        })();
      },
      aa(){
        this.first=[];
        this.second=[];
        this.third=[];
        this.line=[];
        http.get('/api/test').then(res=>{
          console.log(res.data);
          var data=res.data;
          data.map(v=>{
            var f=JSON.parse(JSON.stringify(v));
            f.children={};
            this.first.push(f);
            var key2=Object.keys(v.children);
            key2.map(k2=>{
              var K2=JSON.parse(JSON.stringify(v.children[k2]));
              K2.parent=[];
              K2.children={};
              this.second.push(K2);
              this.newData.copyLine(f,K2,this.line)
              var key3=Object.keys(v.children[k2].children);
              key3.map(k3=>{
                var K3=JSON.parse(JSON.stringify(v.children[k2].children[k3]));
                K3.parent=[];
                K3.children={};
                //this.third.push(K3);
                var ids=[];
                this.third.map(t3=>{
                  ids.push(t3.id)
                });
                console.log(ids,7777777);
                console.log(K3.id)
                ids.includes(K3.id)?(()=>{
                  var num;
                  this.third.map((item,index)=>{
                    if(item.id==K3.id){
                      num=index;
                      return;
                    }
                  })
                  this.newData.copyLine(K2,this.third[num],this.line)
                })():(()=>{
                  this.newData.copyLine(K2,K3,this.line)
                  this.third.push(K3)
                })()
                console.log(ids.includes(K3.id))

              })
            })
          })
        })
      },
      arrange(){
        this.first.map((v,index)=>{
          v.selfX=40;
          v.selfY=50*index;
        })
        this.second.map((v,index)=>{
          v.selfX=200;
          v.selfY=50*index;
        })
        this.third.map((v,index)=>{
          v.selfX=400;
          v.selfY=50*index;
        })
      }
    },
    created () {
      this.newData=new webdata()
      //console.log(this.newData)
      this.addA();
    }
  }
</script>

<style scoped>
.h-p{
  cursor: pointer;
}
</style>
