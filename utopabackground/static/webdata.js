class  webdata{
  constructor (id){
    //this.limit=limit||3;
    this.line=[];//中间件
    this._linedata=[];//线集合
    this._lineId=0;
    this._initId=id||0;
  }
  addPC(ob){
    let keys=Object.keys(ob);
    //console.log(keys.includes('parent')||keys.includes('children'))
    let hasPC=keys.includes('parent')||keys.includes('children');
    hasPC&&(()=>{
      console.warn('has already includes')
    })();
    this._initId++;
    ob.parent=[];
    ob.children={};
    ob.id=this._initId;
    ob.selfX=this._initId*40;
    ob.selfY=this._initId*40;
  }
  drawLine(ob){
    //console.log(this.line,1111)
    if (this.line.length==0)  {
      this.line.push(ob);
      return false;
    }else if(this.line.length==1){
      var lineVal=null;
      this.line.push(ob);
      let num=this.line[0].type-this.line[1].type;
      if(num==-1){
        //console.log(this.line,77777777777)
        this.line[0].children[this.line[1].id]=this.line[1];
        //this.line[1].parent[this.line[0].id]=this.line[0];
        this.line[1].parent.push(this.line[0].id);
        lineVal=true;
      }else {
        console.warn('type is not suit')
        this.line=[];
        lineVal=false
      }
       return lineVal;
    }else if(this.line.length==2){
      this.line=[];
      this.line.push(ob);
      return false;
    }
    //过滤节点
  }
  lineData(ob){
    console.log(ob,7777777)
    let t=Array.isArray(ob);
    !t&&(()=>{
      console.error('ob is not a array')
    })();
    t&&(()=>{
      this.line.length==2&&(()=>{
        var _line={
          parent:{},
          child:{},
          lineId:''
        }
        _line.parent=this.line[0];
        _line.child=this.line[1];
        let parentId=_line.parent.id;
        let childId=_line.child.id;
        let P=ob.filter(v=>{
          return v.parent.id==parentId;
        })
        let C=P.filter(v=>{
          return v.child.id==childId;
        })
        !C.length&&(()=>{
          _line.lineId=this._lineId;
          this.line[0].lineIdTotal.push(this._lineId);
          this.line[1].lineIdTotal.push(this._lineId);
          this.line[0].rightColor='red';
          this.line[1].leftColor='red';
          ob.push(_line);
          this._linedata=ob;
          this._lineId++;
        })();
      })();
      this.line.length!=2&&(()=>{
        console.error('drawline must retrun true')
      })();
    })();
  }
  deleteLine(index){
    typeof index=='number'&&(()=>{
      index>=this._linedata.length&&(()=>{
        console.error('index is error')
      })();
      index<this._linedata.length&&(()=>{
        let parentId=this._linedata[index].parent.id;
        let childId=this._linedata[index].child.id;
        delete this._linedata[index].parent.children[childId];
        //delete this._linedata[index].child.parent[parentId];
        this._linedata[index].child.parent.forEach(function(item, index, arr) {
          if(item == parentId) {
            arr.splice(index, 1);
          }
        })
        Object.keys(this._linedata[index].parent.children).length==0&&(()=>{
          this._linedata[index].parent.rightColor='green';
        })();
        // Object.keys(this._linedata[index].child.parent).length==0&&(()=>{
        //   this._linedata[index].child.leftColor='green';
        // })();
        this._linedata[index].child.parent.length==0&&(()=>{
          this._linedata[index].child.leftColor='green';
        })();
        this._linedata.splice(index,1);

      })();
    })();
    typeof index!='number'&&(()=>{
      console.error('index must be number')
    })();
  }
  //节点删除后删除连线
  batchDelete(i){
    console.log(i,777)
    Array.isArray(i)&&(()=>{
      !i.length&&(()=>{
        console.warn('index is []')
      })();
      i.length&&(()=>{
         i.map(v=>{
          this._linedata.forEach(function(item, index, arr) {
             if(item.lineId==v) {
               arr.splice(index, 1);
             }
           });
         })
      })();
    })();
    !Array.isArray(i)&&(()=>{
      console.error('index must be array')
    })();
  }
  //复制节点
  copyData(ob){
    //debugger;
    this._initId++;
    ob.parent=[];
    ob.children={};
    ob.lineIdTotal=[];
    ob.id=this._initId;
    ob.selfX=this._initId*40;
    ob.selfY=this._initId*40;
    ob.rightX=this._lineId+82;
    ob.rightY=this._lineId+22;
    ob.leftX=this._lineId;
    ob.leftY=this._lineId+20;
    ob.leftColor='green';
    ob.rightColor='green';
    return ob;
  }
  copyLine(a,b,ob){
    //debugger;
      this.line=[a,b];
      this.drawLine(a);
      this.drawLine(b);
      this.lineData(ob);

  }
}
export default webdata;

