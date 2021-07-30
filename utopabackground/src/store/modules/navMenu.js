import http from  '../../http'
import router from '../../router'
import {Message} from 'element-ui'
var baner;
function convertTree(tree, keyId) {
  // console.log(tree,keyId,8888888)
  let apple={};
  tree.map(v=>{
    // console.log(v.url.split('/'),777)
    apple[v.url.split('/')[1]]=JSON.stringify(v)}
  )
  // console.log(apple,9999111111)
  let bu=[];
  bu.push(JSON.parse(apple[keyId.split('/')[1]]))
  // console.log(bu,9999)
  return bu
}
const state={
  menus:[],
  menus2:[],
  title:'',
};
const mutations={
	init(state, payload) {
    // console.log(payload,'payload')
    state.menus = payload.res.data.data
    state.menus2 = convertTree(payload.res.data.data, payload.params.routeName)
    // state.title=state.menus2.filter()
	}
};
const actions={
	menuInit({commit},params){
    http.post('/api/utopa/ar/user/treeMenu', params).then(res => {
      if(res.code){
        Message.error(res.msg)
      }else{
        commit("init", { res, params})
      }
    }).catch(err => {
    })

   }

};
export default {
  namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  actions,
  mutations
}
