  /*Author:MingGui*/
/*引入图片*/
let detailIconUrl_grey=require("../assets/detail_grey.png");
let imgIconUrl_grey=require("../assets/img_grey.png");
let gifIconUrl_grey=require("../assets/gif_grey.png");
let musicIconUrl_grey=require("../assets/music_grey.png");
let videoIconUrl_grey=require("../assets/video_grey.png");
let detailIconUrl=require("../assets/detail.png");
let imgIconUrl=require("../assets/img.png");
let gifIconUrl=require("../assets/gif.png");
let musicIconUrl=require("../assets/music.png");
let videoIconUrl=require("../assets/video.png");
let warnIconUrl=require("../assets/warn.png");
let delIconUrl=require("../assets/de.png");
const myColor = {
  "1":"#409eff",//线高亮颜色
  "2":"#00BA7D",//rect高亮背景颜色
  "3":"#ccc"//初始灰色
}
function XUMinder(params){
  this.element = document.querySelector(params.renderTo);
  this.data = params.data||[];
  this.isLook;//查看状态
  this.allObject={};//数据
  this.domObject={};//节点
  this.stepObject={};//整理用
  this.treeData=[];//树
  this.treeId = 1;//节点id
  this.currentClick=null;//当前点击节点id
  this.activeNode=null;//高亮节点
  this.currentDetailsNode=null;//当前查看属性节点
  this.rightX1='';//连线右端x坐标
  this.rightY1='';//连线右端y坐标
  this.leftX2='';//连线左端x坐标
  this.leftY2='';//连线左端y坐标
  this.oldLeft=0;//节点拖拽前位移left
  this.oldTop=0;//节点拖拽前位移top
  this.newLeft=0;//节点拖拽后位移left
  this.newTop=0;//节点拖拽后位移left
  this.ex=0;//鼠标拖拽开始x值
  this.ey=0;//鼠标拖拽开始y值
  this.lineStartX='';//连接开始点x
  this.lineStartY='';//连接开始点y
  this.lineEndX='';//连接结束点x
  this.lineEndY='';//连接结束点y
  this.stepStart='';//画线开始节点等级
  this.startRectName='';//画线开始节点id
  this.drawStart=null;//画线开始节点dom数据
  this.sliderValue=35;//缩放数据
  this.topicMenu=null;//右键菜单
  this.currentClickObject=null;//当前点击节点数据
  this._id={};//用来储存同一下级不再重复画
  this.dragmove = this.dragmove.bind(this);
  this.dragend = this.dragend.bind(this);
  this.init();
}
XUMinder.prototype = {
  constructor: XUMinder,
  init:function(){//初始化
    // !this.element.width&&!this.element.height?(()=>{this.element.style.width='500px';this.element.style.height='500px'})():null;
    this.element.classList.add('xu_minder');
    let svg = this._createElement("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("version", "1.1");
    this.g_big = this._createElement("g");
    this.g_line = this._createElement("g");
    this.g_node = this._createElement("g");
    svg.setAttribute('id','xu_svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');
    this.g_big.setAttribute('id','g_big');
    this.g_big.setAttribute('width','100%');
    this.g_big.setAttribute('width','100%');
    this.g_big.setAttribute('transform','matrix(1,0,0,1,0,0)');
    this.g_line.setAttribute('id','g_line');
    this.g_node.setAttribute('id','g_node');
    /*监听右键操作展示菜单*/
    if(svg.addEventListener){
      svg.addEventListener("DOMMouseScroll",this._translate.bind(this));//添加右键菜单事件
      svg.oncontextmenu=(e)=>{
        var e = event || window.event;
        var clickEle=e.target.tagName=='DIV'?e.target.parentElement.parentElement:e.target.parentElement;
        [...this.topicMenu.firstElementChild.children].forEach((v,i)=>{v.style.display='block';})//先设置都显示
        if(this.isLook){//查看模式下的菜单
          [...this.topicMenu.firstElementChild.children].forEach((v,i)=>{if(i!=3&&i!=2){v.style.display='none';}})
        }else if(e.target.nodeName=='svg'||clickEle.getAttribute('id').indexOf('xu')==-1){
          [...this.topicMenu.firstElementChild.children].forEach((v,i)=>{if(i==0){v.style.display='none';}})//判断是不是节点非粘贴按钮
        }else{
          [...this.topicMenu.firstElementChild.children].forEach(v=>{v.style.display='block';})
        }
        this.topicMenu.style.display = "block";//显示菜单
        this.topicMenu.style.left = e.clientX+'px';
        this.topicMenu.style.top = e.clientY +'px';
        return false;//取消右键点击的默认事件
      };
      document.onclick=()=>{//隐藏菜单
        this.topicMenu?this.topicMenu.style.display = 'none':null;
      }
    }
    /*监听鼠标滚轮滚动*/
    svg.onmousewheel = this._translate.bind(this);
    this.g_big.appendChild(this.g_line);
    this.g_big.appendChild(this.g_node);
    svg.appendChild(this.g_big);
    this.element.appendChild(svg);
    if((this.data&&this.data.length)){
      this.render(this.data);
    }
    this.drawTopic();
    // this.nodeChange();//监听节点名称变化
    /*生成缩放控价*/
    var controlData = [{
      text:'xu-bar',
      children:[{
        text:'',
        children:[{text:'xu_add_icon',click:'big'}]
      },{
        text:'zoom-pan',
        children:[{text:'origin',style:'transform: translate(0px, 35px)'},{text:'indicator',style:'transition:transform 200ms ease 0s;transform:translate(0px, 35px)'}]
      },{
        text:'',
        children:[{text:'xu_reduce_icon',click:'small'}]
      }]
    }];
    var xu_div = controlData.map(v=>{
      let div1 = document.createElement('div');
      div1.classList.add(v.text);
      if(v.children){
        v.children.forEach(u=>{
          let div2 = document.createElement('div');
          div1.appendChild(div2);
          u.text?div2.classList.add(u.text):null;
          if(u.children){
            u.children.forEach(i=>{
              let div3 = document.createElement('div');
              i.click?div3.addEventListener('click',this.scale.bind(this,i.click)):null;
              div2.appendChild(div3);
              div3.classList.add(i.text);
              i.style?div3.style=i.style:null;
            })
          }
        })
      }
      return div1
    })
    this.element.appendChild(xu_div[0]);
  },
  _callback:function(arr,previous=null){//遍历函数渲染
    for(let i=0;i<arr.length;i++){
      if(arr[i].parent&&arr[i].parent.length>1){//判断是否有多个父级
        if(this._id[arr[i].id]){//判断当前id是否已经画有而不再重新画
          if(previous!==null){
            var _trans = this.domObject[this._id[arr[i].id]].rect.parentElement.getAttribute('transform').slice(10,-1).split(",");
            this.renderLine(previous.rightX,previous.rightY,this.domObject[this._id[arr[i].id]].circleLeft.getAttribute('cx')*1+_trans[0]*1,this.domObject[this._id[arr[i].id]].circleLeft.getAttribute('cy')*1+_trans[1]*1,previous.id,this._id[arr[i].id]);
          }
          continue;
        }
        var step = this.add(arr[i]);
        this._id[arr[i].id] = step.id;//将当前有多个父级的节点存储
      }else{
        var step = this.add(arr[i]);
      }

      if(previous!==null){
        this.renderLine(previous.rightX,previous.rightY,step.leftX,step.leftY,previous.id,step.id)
      }
      if(arr[i].children.length){
        this._callback(arr[i].children,step);
      }
    }
  },
  draw:function(data){//外部用的渲染
    this.clear();
    this._callback(data);
  },
  render:function(data){//整理复制用的渲染
    this._callback(data);
  },
  _createElement:function(name){
    return document.createElementNS("http://www.w3.org/2000/svg", name)
  },
  drawTopic:function(){//右键菜单
    var arr = [{text:'复制'},{text:'粘贴'},{text:'清除'},{text:'整理'}]
    var topic_menu =this.topicMenu =  document.createElement('div');
    topic_menu.classList.add('topic-menu');
    topic_menu.style.display='none';
    topic_menu.style.position='fixed';
    var tm_list = document.createElement('ul');
    tm_list.classList.add('tm-list');
    for(let i=0;i<arr.length;i++){
      var tml_item = document.createElement('li');
      var span = document.createElement('span');
      span.innerText = arr[i].text;
      if(i==0){tml_item.addEventListener('click',this.copy.bind(this))}//复制
      if(i==1){tml_item.addEventListener('click',this.paste.bind(this))}//粘贴
      if(i==2){tml_item.addEventListener('click',this.clear.bind(this))}//清除
      if(i==3){tml_item.addEventListener('click',this.reset.bind(this))}//整理
      tml_item.appendChild(span);
      tml_item.classList.add('tml-item');
      tm_list.appendChild(tml_item);
    }
    topic_menu.appendChild(tm_list);
    document.body.appendChild(topic_menu);
  },
  renderLine:function(x1,y1,x2,y2,startRectName,endRectName){//画线
    let line = this._createElement("line");
    line.setAttribute('stroke-width',"3");
    line.setAttribute('x1',x1);
    line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);
    line.setAttribute('y2',y2);
    line.setAttribute('stroke',myColor['1']);
    line.setAttribute('start',startRectName);
    line.setAttribute('end',endRectName);
    line.addEventListener('dblclick',this.delLine.bind(this));
    line.addEventListener("mouseover", ()=>{
      this.isLook?null:line.setAttribute('stroke','red');
    });
    line.addEventListener("mouseout", ()=>{
      line.setAttribute('stroke',myColor['1']);
    });
    this.domObject[startRectName].lineRight?this.domObject[startRectName].lineRight.push(line):(this.domObject[startRectName].lineRight = [line]);
    this.domObject[endRectName].lineLeft?this.domObject[endRectName].lineLeft.push(line):(this.domObject[endRectName].lineLeft = [line]);
    this.g_line.appendChild(line);
    this.domObject[startRectName].circleRight.setAttribute("fill",myColor['1']);//将父节点右边连线设置成蓝色
    this.domObject[endRectName].circleLeft.setAttribute("fill",myColor['1']);//将子节点左边连线设置成蓝色
    this.allObject[startRectName].children.push(this.allObject[endRectName]);//将父节点children添加子节点
    this.allObject[endRectName].parent.push({id:this.allObject[startRectName].id});//在子节点parent添加父节点
  },
  add:function(obj){//添加节点
    let {step,text,type,data,isLastNode,icon,warning,color,playColor,attrColor}=obj;
    data=JSON.parse(JSON.stringify(data));//深复制
    if(!this.stepObject[step]){
      this.stepObject[step]={};
    }
    this.stepObject[step].num=this.stepObject[step].num?this.stepObject[step].num+1:1;
    this.allObject['xu_mind'+this.treeId]={"id":'xu_mind'+this.treeId,type,isLastNode,icon,warning,data,color,text,step,playColor,attrColor,"children":[],"parent":[]};
    if(step==1){
      this.treeData.push(this.allObject['xu_mind'+this.treeId]);
    }
    let g = this._createElement("g");
    let rect = this._createElement("rect");
    // let textEle = this._createElement("text");
    let foreignObject = this._createElement("foreignObject");
    let textEle = document.createElement("div");
    foreignObject.setAttribute("width",128);
    foreignObject.setAttribute("height",40);
    foreignObject.setAttribute("x",8);
    foreignObject.appendChild(textEle);
    textEle.setAttribute("title",text);
    textEle.innerHTML=text;
    textEle.style="color:#fff;text-align:center;line-height:40px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;";
    let delButton = this._createElement("image");
    let play = this._createElement("image");
    let details = this._createElement("image");
    let warn = this._createElement("image");
    // textEle.setAttribute('x',8);
    // textEle.setAttribute('y',25);
    // textEle.style='fill:#fff';
    // textEle.innerHTML=text;
    rect.setAttribute('rx',8);
    rect.setAttribute('ry',8);
    color?rect.setAttribute('fill',myColor["2"]):rect.setAttribute('fill',myColor['3']);
    rect.setAttribute('stroke-width','2');
    g.appendChild(rect);
    g.appendChild(foreignObject);
    // g.appendChild(textEle);
    this.g_node.appendChild(g);
    rect.setAttribute('width',"144");
    // rect.setAttribute('width',(textEle.getBBox().width*1<64?64:textEle.getBBox().width*1)+16);
    // textEle.getBBox().width*1<64?textEle.setAttribute('x',(80-textEle.getBBox().width*1)/2):null;//如果文字不够再居中
    rect.setAttribute('height',"40");
    play.setAttribute('width',"18");
    play.setAttribute('height',"18");
    play.setAttribute('x',10);
    play.setAttribute('y',rect.getAttribute('height')*1-10);
    var iconUrl= icon=='img'?(playColor?imgIconUrl:imgIconUrl_grey):icon=='gif'?(playColor?gifIconUrl:gifIconUrl_grey):icon=='music'?(playColor?musicIconUrl:musicIconUrl_grey):icon=='video'?(playColor?videoIconUrl:videoIconUrl_grey):'';
    iconUrl?play.setAttribute('href',iconUrl):null;
    play.style.display="none";
    play.addEventListener("click", this.play.bind(this));
    play.addEventListener("mouseover", ()=>{
      play.style.cursor='pointer';
    });
    details.setAttribute('width',"18");
    details.setAttribute('height',"18");
    details.setAttribute('x',rect.getAttribute('width')*1-30);
    details.setAttribute('y',rect.getAttribute('height')*1-10);
    details.setAttribute('href',attrColor?detailIconUrl:detailIconUrl_grey);
    details.addEventListener("click", this.showDetails.bind(this));
    details.style.display="none";
    details.addEventListener("mouseover", ()=>{
      details.style.cursor='pointer';
    });
    delButton.setAttribute('x',rect.getAttribute('width')*1-8);
    delButton.setAttribute('y',-8);
    delButton.setAttribute('width',"16");
    delButton.setAttribute('height',"16");
    delButton.setAttribute('href',delIconUrl);
    delButton.addEventListener("mouseover", ()=>{
      delButton.style.cursor='pointer';
    });
    this.isLook||data.id?delButton.style.display="none":null;
    delButton.addEventListener('click',this.del.bind(this));
    warn.setAttribute('x',rect.getAttribute('width')*1-28);//感叹号
    warn.setAttribute('y',rect.getAttribute('height')*1-26);
    warn.setAttribute('width',"16");
    warn.setAttribute('height',"16");
    warn.setAttribute('href',warnIconUrl);
    !warning?warn.style.display='none':null;
    g.setAttribute('step',step);
    g.setAttribute('id','xu_mind'+this.treeId);
    g.addEventListener("mousedown", this.dragstart.bind(this));
    g.addEventListener("mouseover", ()=>{
      play.style.display="block";
      details.style.display="block";
      g.style.cursor='default';
    });
    g.addEventListener("mouseout", ()=>{
      play.style.display="none";
      details.style.display="none";
    });
    g.appendChild(delButton);
    iconUrl?g.appendChild(play):null;
    g.appendChild(details);
    g.appendChild(warn);
    let circleRight;
    let circleLeft;
    if(!isLastNode){
      circleRight= this._createElement("circle");
      circleRight.setAttribute('cx',rect.getAttribute('width')*1);
      circleRight.setAttribute('cy',rect.getAttribute('height')/2);
      circleRight.setAttribute('r','6');
      circleRight.setAttribute('fill',myColor['3']);
      circleRight.setAttribute('stroke','#fff');
      circleRight.addEventListener('click',this.drawLineStart.bind(this));
      circleRight.addEventListener("mouseover", ()=>{
        circleRight.setAttribute('stroke','red');
      });
      circleRight.addEventListener("mouseout", ()=>{
        circleRight.setAttribute('stroke','#fff');
      });
    }
    if(step==1){
      // this.domObject['xu_mind'+this.treeId]={rect,circleRight,play,details};
      var gTranslateX=50*1;
      var gTranslateY = 60*this.stepObject[step].num;
      g.setAttribute('transform',`translate(${gTranslateX},${gTranslateY})`);
    }else if(step>1){
      // let positionUp = [];
      // this.stepObject[step*1-1].dom?[...this.stepObject[step*1-1].dom].forEach(v=>{//与上一节点隔开
      //   var width = v.rect.parentElement.getAttribute('transform').slice(10,-1).split(",")[0]*1+v.rect.getAttribute('width')*1;
      //   positionUp.push(width);
      // }):null
      // positionUp.sort();
      // var gTranslateX = positionUp.length?positionUp[positionUp.length-1]+20:80*1*step;
      var gTranslateX=50**1*step+144*(1*step-1);
      var gTranslateY = 60*this.stepObject[step].num;
      g.setAttribute('transform',`translate(${gTranslateX},${gTranslateY})`);
      circleLeft = this._createElement("circle");
      circleLeft.setAttribute('cx',0);
      circleLeft.setAttribute('cy',rect.getAttribute('height')/2);
      circleLeft.setAttribute('r','6');
      circleLeft.setAttribute('fill',myColor['3']);
      circleLeft.setAttribute('stroke','#fff');
      circleLeft.addEventListener('click',this.drawLineEnd.bind(this));
      circleLeft.addEventListener("mouseover", ()=>{
        circleLeft.setAttribute('stroke','red');
      });
      circleLeft.addEventListener("mouseout", ()=>{
        circleLeft.setAttribute('stroke','#fff');
      });
    }
    this.domObject['xu_mind'+this.treeId]={rect,textEle,delButton,circleLeft,circleRight,play,details,warn};
    this.stepObject[step].dom?this.stepObject[step].dom.push({rect,textEle,delButton,circleLeft,circleRight,play,details,warn}):this.stepObject[step].dom=[{rect,textEle,delButton,circleLeft,circleRight,play,details,warn}];
    circleRight?g.appendChild(circleRight):null;
    circleLeft?g.appendChild(circleLeft):null;
    this.treeId++;
    console.log(this.treeData,'this.treeData');
    return {id:'xu_mind'+(this.treeId-1),leftX:circleLeft?0+gTranslateX:null,leftY:circleLeft?rect.getAttribute('height')/2+gTranslateY:null,rightX:circleRight?rect.getAttribute('width')*1+gTranslateX:null,rightY:circleRight?rect.getAttribute('height')/2+gTranslateY:null}
  },
  update:function(obj={}){//节点样式更新
    if(obj.delAllWarn){//去除所有感叹号
      for(var w in this.allObject){
        if(this.allObject[w]&&this.allObject[w].warning){
          this.allObject[w].warning=false;
          this.domObject[w].warn.style.display='none';
        }
      }
      return;
    }
    console.log(this,this.currentDetailsNode,'更新')
    let rectName = this.currentDetailsNode.getAttribute('id');
    var rect = this.domObject[rectName].rect;
    var text = this.domObject[rectName].textEle;
    var warn= this.domObject[rectName].warn;
    var play= this.domObject[rectName].play;
    var details= this.domObject[rectName].details;
    //obj包含text、word、color、delWarn、playColor、attrColor、delAllWarn
    if(obj.word){//更改节点文字
      text.innerHTML = obj.text;
      text.setAttribute("title",obj.text);
      this.allObject[rectName].text=obj.text;
    }
    if(obj.color===true){//节点颜色
      rect.setAttribute('fill',myColor["2"])
      this.allObject[rectName].color =true;
    }else if(obj.color===false){
      rect.setAttribute('fill',myColor["3"])
      this.allObject[rectName].color =false;
    }
    if(obj.playColor===true){//播放图标颜色
      play.setAttribute('href',eval(this.allObject[rectName].icon+'IconUrl'));
      this.allObject[rectName].playColor =true;
    }else if(obj.playColor===false){
      play.setAttribute('href',eval(this.allObject[rectName].icon+'IconUrl_grey'));
      this.allObject[rectName].playColor =false;
    }
    if(obj.attrColor===true){//属性颜色
      details.setAttribute('href',detailIconUrl);
      this.allObject[rectName].attrColor =true;
    }else if(obj.attrColor===false){
      details.setAttribute('href',detailIconUrl_grey);
      this.allObject[rectName].attrColor =false;
    }
    if(obj.delWarn){//去除感叹号
      if(warn){
        warn.style.display='none';
        this.allObject[rectName].warning=false;
      }
    }
    // if(word){//更改节点文字
    //   text.innerHTML = val;
    //   text.setAttribute("title",val);
    // }
    // if(Array.isArray(val)){
    //   val.length?rect.setAttribute('fill',myColor["2"]):rect.setAttribute('fill',myColor['3']);
    // }else{
    //   val?rect.setAttribute('fill',myColor["2"]):rect.setAttribute('fill',myColor['3']);
    // }
    // if(delWarn){
    //   if(warn){
    //     warn.style.display='none';
    //     this.allObject[rectName].warning=false;
    //   }
    // }
  },
  del:function(e){//删除节点
    console.log(e);
    let currentClick = e.target.parentElement;
    this.fire('close',{});
    let rectName = currentClick.getAttribute('id');
    let step = currentClick.getAttribute('step');
    if(this.allObject[rectName].data.id){
      return;//编辑的主节点不能删除
    }
    this.g_node.removeChild(currentClick);
    let objectData = this.domObject[rectName];//被删除者节点数据对象
    objectData.lineRight?[...objectData.lineRight].forEach(v=>{v.parentElement.removeChild(v)}):null;//删除线
    objectData.lineLeft?[...objectData.lineLeft].forEach(v=>{v.parentElement.removeChild(v)}):null;
    let parent = this.allObject[rectName].parent;//被删除者父级id数组
    this.allObject[rectName].children.forEach(v=>{
      v.parent=v.parent.filter(i=>i.id!=rectName);//将它所有子级的它这个父级清除
      this.domObject[v.id].lineLeft = this.domObject[v.id].lineLeft.filter(u=>u.getAttribute('start')!=rectName);//将子级连接它的线从数据中删除
      if(!this.domObject[v.id].lineLeft.length)this.domObject[v.id].circleLeft.setAttribute("fill",myColor['3'])//判断子级还有没有其他连线并置灰
    });
    parent.forEach(v=>{
      this.domObject[v.id].lineRight = this.domObject[v.id].lineRight.filter(u=>u.getAttribute('end')!=rectName);//将父级连接它的线从数据中删除
      if(!this.domObject[v.id].lineRight.length)this.domObject[v.id].circleRight.setAttribute("fill",myColor['3'])//判断父级还有没有其他连线并置灰
    })
    parent.length?parent.forEach(u=>{this.allObject[u.id].children.splice(this.allObject[u.id].children.map(v=>v.id).indexOf(rectName),1)}):null;//先判断有没有父级将父级里的自己删除
    if(this.allObject[rectName].step==1){this.treeData.splice(this.treeData.map(v=>v.id).indexOf(rectName),1)}
    this.allObject[rectName]=null;//清掉数据
    this.domObject[rectName] =null;
    this.currentClick = null;//将点击置空
    this.currentDetailsNode=null;
    console.log(this.treeData,'this.treeData');
  },
  clear:function(e){//清除数据
    if(e){
      this.isLook=false;
      this.fire('play',{nodeType:'look'});
    }
    this.domObject={};
    this.allObject={};
    this.stepObject={};
    this.currentClick=null;
    this.currentClickObject=null;
    this.currentDetailsNode=null;
    this.treeData=[];
    this.g_node.innerHTML='';
    this.g_line.innerHTML='';
    this._id={};
    this.fire('close',{})
  },
  reset:function(){//整理
    this.domObject={};
    this.stepObject={};
    this.currentClick=null;
    this.currentClickObject=null;
    this.currentDetailsNode=null;
    this.g_node.innerHTML='';
    this.g_line.innerHTML='';
    this._id={};//将id清空
    var newData = [JSON.parse(JSON.stringify(this.treeData))];//主节点
    this.treeData=[];
    for(var key in this.allObject){//将没有连接主节点的遍历出来
      if(this.allObject[key]&&this.allObject[key].step>1&&this.allObject[key].parent.length<1){
        var data1 = [JSON.parse(JSON.stringify(this.allObject[key]))];
        newData.push(data1);
      }
    }
    this.allObject={};
    newData.forEach(v=>{//渲染
      this.render(v);
    })
    this.fire('close',{})
    // [2,3].forEach(step=>{//下一节点与上一节点隔开
    //   let positionUp = [];
    //   this.stepObject[step*1-1].dom?[...this.stepObject[step*1-1].dom].forEach(v=>{
    //     var width = v.rect.parentElement.getAttribute('transform').slice(10,-1).split(",")[0]*1+v.rect.getAttribute('width')*1;
    //     positionUp.push(width);
    //   }):null
    //   positionUp.sort();
    //   var gTranslateX = positionUp.length?positionUp[positionUp.length-1]+20:80*1*step;
    // })
  },
  dragstart:function(e){//拖拽开始
    this.currentClick = e.target.tagName=='DIV'?e.target.parentElement.parentElement:e.target.parentElement;
    window.addEventListener("mousemove", this.dragmove);
    window.addEventListener("mouseup", this.dragend);
    let currentPositionArr=this.currentClick.getAttribute('transform')?this.currentClick.getAttribute('transform').slice(10,-1).split(","):[0,0];//获取初始位移值
    this.oldLeft = currentPositionArr[0]*1;
    this.oldTop = currentPositionArr[1]*1;
    this.ex = e.pageX;
    this.ey = e.pageY;
    let rectName = this.currentClick.getAttribute('id');
    let step = this.currentClick.getAttribute('step');

    let lineRight = this.domObject[rectName].lineRight;//获取右边连接点
      if(lineRight&&lineRight.length){
        this.rightX1 = Number(lineRight[0].getAttribute('x1'));
        this.rightY1 = Number(lineRight[0].getAttribute('y1'));
      }
    if(step>1){//非主节点才有左边连接点
      let lineLeft = this.domObject[rectName].lineLeft;//获取左边连接点
      if(lineLeft&&lineLeft.length){
        this.leftX2 = Number(lineLeft[0].getAttribute('x2'));
        this.leftY2 = Number(lineLeft[0].getAttribute('y2'));
      }
    }
  },
  dragmove:function(e){//拖拽移动
    let matrix = this.g_big.getAttribute('transform').slice(7,-1).split(",")[0];//获取缩放值
    this.newLeft = (e.pageX - this.ex)/matrix + this.oldLeft;
    this.newTop = (e.pageY - this.ey)/matrix + this.oldTop;
    //console.log(this.newLeft,this.newTop)
    this.currentClick.setAttribute('transform',`translate(${this.newLeft},${this.newTop})`);
    //让线跟着一起动
    let rectName = this.currentClick.getAttribute('id');
    this.currentClick.style.cursor='-webkit-grab';
    let step = this.currentClick.getAttribute('step');
      let lineRight = this.domObject[rectName].lineRight;
      if(lineRight&&lineRight.length){//更新已连接线的位置
        [...lineRight].forEach(v=>{
          v.setAttribute("x1",this.rightX1+this.newLeft - this.oldLeft)
          v.setAttribute("y1",this.rightY1+this.newTop - this.oldTop)
        });
      }
    if(step>1){//非主节点才有左边连接点
      let lineLeft = this.domObject[rectName].lineLeft;
      if(lineLeft&&lineLeft.length){//更新已连接线的位置
        [...lineLeft].forEach(v=>{
          v.setAttribute("x2",this.leftX2+this.newLeft - this.oldLeft)
          v.setAttribute("y2",this.leftY2+this.newTop - this.oldTop)
        });
      }
    }
  },
  dragend:function(e){//拖拽结束
    console.log('弹起',this)
    this.currentClick.style.cursor='default';
    window.removeEventListener("mousemove", this.dragmove);
    window.removeEventListener("mouseup", this.dragend);
    // this.currentClick=null;
  },
  drawLineStart:function(e){//连线开始
    let currentNeedLine = e.target.parentElement;
    this.startRectName = currentNeedLine.getAttribute('id');
    this.stepStart = currentNeedLine.getAttribute('step');
    this.drawStart = this.domObject[this.startRectName];
    let gPositionStart = currentNeedLine.getAttribute('transform')?currentNeedLine.getAttribute('transform').slice(10,-1).split(","):[0,0];
    let gXStart = Number(gPositionStart[0]);
    let gYStart = Number(gPositionStart[1]);
    this.lineStartX = Number(this.drawStart.circleRight.getAttribute('cx'))+gXStart;//起始节点的连接点坐标
    this.lineStartY = Number(this.drawStart.circleRight.getAttribute('cy'))+gYStart;
  },
  drawLineEnd:function(e){//连线结束
    let currentNeedLine = e.target.parentElement;
    let rectName = currentNeedLine.getAttribute('id');
    let step = currentNeedLine.getAttribute('step');
    if((this.lineStartX===''&&this.lineStartY==='')||this.stepStart>=step){
      return;
    }
    if(this.stepStart*1+1<step){//跨级无法连线
      return;
    }
    // if(this.allObject[this.startRectName].children.some(v=>v.type==this.allObject[rectName].type)){//不能连接多个同一type节点
    //   Message.error('不能连接多个同一类型子节点');
    //   return;
    // }
    let drawEnd = this.domObject[rectName];
    let gPositionEnd = currentNeedLine.getAttribute('transform')?currentNeedLine.getAttribute('transform').slice(10,-1).split(","):[0,0];
    let gXEnd = Number(gPositionEnd[0]);
    let gYEnd = Number(gPositionEnd[1]);
    this.lineEndX = Number(drawEnd.circleLeft.getAttribute('cx'))+gXEnd;//结束节点的连接点坐标
    this.lineEndY = Number(drawEnd.circleLeft.getAttribute('cy'))+gYEnd;
    let isLine = this.drawStart.lineRight?this.drawStart.lineRight.some(v=>v.getAttribute("start")==this.startRectName&&v.getAttribute("end")==rectName):false;

    if(isLine){//不能重复连线
      return;
    }
    /*画线*/
    let line = this._createElement("line");
    line.setAttribute('stroke-width',"3");
    line.setAttribute('x1',this.lineStartX);
    line.setAttribute('y1',this.lineStartY);
    line.setAttribute('x2',this.lineEndX);
    line.setAttribute('y2',this.lineEndY);
    line.setAttribute('stroke',myColor['1']);
    line.setAttribute('start',this.startRectName);
    line.setAttribute('end',rectName);
    line.addEventListener('dblclick',this.delLine.bind(this));
    /*添加hover事件*/
    line.addEventListener("mouseover", ()=>{
      line.setAttribute('stroke','red');
    });
    line.addEventListener("mouseout", ()=>{
      line.setAttribute('stroke',myColor['1']);
    });
    this.drawStart.lineRight?this.drawStart.lineRight.push(line):(this.drawStart.lineRight = [line]);
    drawEnd.lineLeft?drawEnd.lineLeft.push(line):(drawEnd.lineLeft = [line]);
    this.g_line.appendChild(line);
    this.domObject[this.startRectName].circleRight.setAttribute("fill",myColor['1']);//将父节点右边连线设置成蓝色
    this.domObject[rectName].circleLeft.setAttribute("fill",myColor['1']);//将子节点左边连线设置成蓝色
    this.allObject[this.startRectName].children.push(this.allObject[rectName]);//将父节点children添加子节点
    this.allObject[rectName].parent.push({id:this.allObject[this.startRectName].id});//在子节点parent添加父节点
    this.lineStartX='';//将初始点击清除
    this.lineStartY='';
    this.fire('drawLine',{line,parentData:this.allObject[this.startRectName],data:this.allObject[rectName].data});
    console.log(this.treeData,'this.treeData');
  },
  delLine:function(e){//删除连线
    if(this.isLook){//查看下无法删除
      return;
    }
    let line = e.target?e.target:e;//判断是事件触发还是手动
    let startRectName = line.getAttribute('start');
    let endRectName = line.getAttribute('end');
    this.domObject[startRectName].lineRight = this.domObject[startRectName].lineRight.filter(v=>v.getAttribute('end')!=endRectName);
    if(!this.domObject[startRectName].lineRight.length){this.domObject[startRectName].circleRight.setAttribute("fill",myColor['3'])}//判断将连接点颜色设置为灰色
    this.domObject[endRectName].lineLeft = this.domObject[endRectName].lineLeft.filter(v=>v.getAttribute('start')!=startRectName);
    if(!this.domObject[endRectName].lineLeft.length){this.domObject[endRectName].circleLeft.setAttribute("fill",myColor['3'])}
    this.allObject[startRectName].children.splice(this.allObject[startRectName].children.map(v=>v.id).indexOf(endRectName),1);//删除子级
    this.g_line.removeChild(line);
    console.log(this.treeData,'this.treeData');
  },
  copy:function(){//复制节点
    console.log('copy')
    let rectName = this.currentClick.getAttribute('id');
    this.currentClickObject = JSON.parse(JSON.stringify(this.allObject[rectName]));
  },
  paste:function(){//粘贴节点
    console.log('paste')
    if(!this.currentClickObject){return}
    if(this.currentClickObject.step==1){
      // this.currentClickObject.text=this.currentClickObject.text+'-复制'
      // this.currentClickObject.data.name=this.currentClickObject.data.name+'-复制'
      this.currentClickObject.data.id?this.currentClickObject.data.id=null:null;//将id清掉
    }
    this._id={};//粘贴前将id清空
    this.render([this.currentClickObject]);
  },
  play(e){//展示图片或播放音乐等
    let node = e.target.parentElement;
    let rectName = node.getAttribute('id');
    this.fire('play',{nodeType:this.allObject[rectName].type,...JSON.parse(JSON.stringify(this.allObject[rectName].data))});
  },
  showDetails(e){//展示属性
    this.currentDetailsNode = e.target.parentElement;
    let rectName = e.target.parentElement.getAttribute('id');
    this.activeNode?this.activeNode.setAttribute('stroke',''):null;//取消上一次高亮
    this.activeNode = this.domObject[rectName].rect;
    this.activeNode.setAttribute('stroke',myColor['1']);//高亮
    this.currentNodeType = this.allObject[rectName].type;
    this.fire('open',this.allObject[rectName].data);
  },
  on:function(type,callback){//监听
    window.addEventListener(type,callback);
  },
  remove:function(type,callback){//移除监听
    if(this.topicMenu){
      document.body.removeChild(this.topicMenu);
      this.topicMenu=null;
    }
    window.removeEventListener(type,callback);
  },
  fire:function(type,data){//注册并触发事件
    if(window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent(type, {"detail":data}));
    } else {
      window.fireEvent(new CustomEvent(type, {"detail":data}));
    }
  },
  scale:function(type,e){//缩放
    var target = e.target.parentElement;
    [...target.parentElement.children].forEach(v=>{v.style.backgroundColor="";})
    if(type=='small'){
      if(this.sliderValue==70){
        target.style.backgroundColor="#5A6378";
        return;
      }
      this.sliderValue = this.sliderValue+7;
      let matrix = this.g_big.getAttribute('transform').slice(7,-1).split(",");
      this.g_big.setAttribute('transform',`matrix(${matrix[0]*1-0.1},${matrix[1]},${matrix[2]},${matrix[3]*1-0.1},${matrix[4]*1+25},${matrix[5]*1+25})`);
      if(this.sliderValue==70){
        target.style.backgroundColor="#5A6378";
      }
    }else if(type=='big'){
      if(this.sliderValue==0){
        target.style.backgroundColor="#5A6378";
        return;
      }
      this.sliderValue = this.sliderValue-7;
      let matrix = this.g_big.getAttribute('transform').slice(7,-1).split(",");
      this.g_big.setAttribute('transform',`matrix(${matrix[0]*1+0.1},${matrix[1]},${matrix[2]},${matrix[3]*1+0.1},${matrix[4]*1-25},${matrix[5]*1-25})`)
      if(this.sliderValue==0){
        target.style.backgroundColor="#5A6378";
      }
    }
    target.parentElement.children[1].lastElementChild.style.transform =`translate(0px, ${this.sliderValue}px)`;
  },
  _translate:function(event){//滚轮上下平移
    var e=event || window.event;
    var value;
    if(!this.g_node.innerHTML){
      return;
    }
    if(e.wheelDelta){//IE/Opera/Chrome
        value=e.wheelDelta;
        let matrix = this.g_big.getAttribute('transform').slice(7,-1).split(",");
        this.g_big.setAttribute('transform',`matrix(${matrix[0]},${matrix[1]},${matrix[2]},${matrix[3]},${matrix[4]},${matrix[5]*1+value/20})`)
    }else if(e.detail){//Firefox
        value=e.detail;
        let matrix = this.g_big.getAttribute('transform').slice(7,-1).split(",");
        this.g_big.setAttribute('transform',`matrix(${matrix[0]},${matrix[1]},${matrix[2]},${matrix[3]},${matrix[4]},${matrix[5]*1+value*2})`)
    }
    if(e.preventDefault){
      e.preventDefault();
    }
    return false;
  },
}
export default XUMinder
