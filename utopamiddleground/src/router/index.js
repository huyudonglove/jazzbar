import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import applicationList from '../components/app/applicationList'
import createApplication from '../components/app/createApplication'
import pageSetting from '@/components/pageSetting/pageSetting'
import moduleList from '@/components/pageSetting/moduleList'
import createModule from '@/components/pageSetting/createModule'
import login from '../components/login/login'
import system from '@/components/system/system'
import userList from '@/components/system/userList'
import createUser from '@/components/system/createUser'
import roleList from '@/components/system/roleList'
import createRole from '@/components/system/createRole'
import assetsManager from '@/components/assetsManager/assetsManager'
import positionList from '@/components/assetsManager/positionList'
import stageContentList from '@/components/application/noverStage/stageContentList'
import createStageContent from '@/components/application/noverStage/createStageContent'
import createScene from '@/components/application/noverStage/createScene'
import createSceneModel from '@/components/application/noverStage/createSceneModel'
import createBgm from '@/components/application/noverStage/createBgm'
import createProgram from '@/components/application/noverStage/createProgram'

import backgroundMusic from '@/components/application/backgroundMusic'

// import arContentList from '@/components/application/arPhotograph/arContentList'
import arContentList from '@/components/application/arPhoto/arContentList'
import createArContent from '@/components/application/arPhotograph/createArContent'
import logout from '@/components/login/logout'
import forgot from '@/components/login/forgot'
import assetsManagement from '@/components/application/assetsManagement'
import assetsMoudel from '@/components/application/assetsMoudel'
import assetsMoudelVirtual from '@/components/application/assetsMoudelVirtual'
import putManage from '@/components/putIn/putManage'
import putList from '@/components/putIn/putList'
import putCreate from '@/components/putIn/putCreate'
import putInfo from '@/components/putIn/putInfo'
import firstNav from '@/components/firstNav'
import imageUtopa from '@/components/image/imageUtopa'
import feedBackList from '@/components/feedback/feedBackList'
import feedBackInfo from '@/components/feedback/feedBackInfo'
import version from '@/components/version'
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children:[
        {
          path:'/app/applicationList',
          name:'applicationList',
          component: applicationList
        },
        {
          path:'/app/createApplication',
          name:'createApplication',
          component:createApplication
        },
        {
          path:'/app/modulelist',
          name:'moduleList',
          component:moduleList,
          children:[
            {
              path:'/app/modulelist/createmodule',
              name:'createModule',
              component:createModule
            }

          ]
        },
        {
          path: '/app/feedBackList',//??????????????????
          name: 'feedBackList',
          component: feedBackList,
          children: [
            {
              path: '/app/feedBackList/feedBackInfo',//??????????????????
              name: 'feedBackInfo',
              component: feedBackInfo
            }
          ]
        },
      {
      path:'/system',
      name:'system',
      component: system,
      children:[
        {
          path:'/system/userlist',
          name:'userList',
          component: userList,
          children:[
            {
              path:'/system/userlist/createuser',
              name:'createUser',
              component: createUser
            }
          ]
        },
        {
          path:'/system/rolelist',
          name:'roleList',
          component: roleList,
          children:[
            {
              path:'/system/rolelist/createrole',
              name:'createRole',
              component: createRole
            }
          ]
        }
      ]

    },
    {
      path:'/assetsmanager',
      name:'assetsManager',
      component: assetsManager,
      children:[
        {
          path:'/assetsmanager/positionlist',
          name:'positionList',
          component: positionList,
        }
      ]
    },
    {
      path:'/glassesList',
      name:'glassesList',
      component: ()=>import('@/components/arglasses/glassesList'),
      children:[
        {
          path:'/glassesList/createGlasses',
          name:'createGlasses',
          component: ()=>import('@/components/arglasses/createGlasses'),
        }
      ]
    },
    {
      path: '/application/assetsList',
      name: 'assetsManagement',
      component: assetsManagement,
      children: [
        // {
        //   path: '/application/assetsList/assets/:moudle/:playId/:appId',
        //   name: 'assetsMoudel',
        //   component: assetsMoudel,
        // },
        {
          path: '/application/assetsList/assetsMoudelVirtual/:playId/:appId',
          name: 'assetsMoudelVirtual',
          component: assetsMoudelVirtual,
        },
        {
          path: '/application/assetsList/content/1/:appId',
          name: 'stageContentList',
          component: stageContentList,
          children:[
            {
              path:'/application/assetsList/content/1/:appId/createstagecontent',
              name:'createStageContent',
              component:createStageContent,
            },
            {
              path:'/application/assetsList/content/1/:appId/createscene',
              name:'createScene',
              component:createScene,
              children:[
                {
                  path:'/application/assetsList/content/1/:appId/createscene/createscenemodel',
                  name:'createSceneModel',
                  component:createSceneModel,
                },
                {
                  path:'/application/assetsList/content/1/:appId/createscene/createbgm',
                  name:'createBgm',
                  component:createBgm,
                },
                {
                  path:'/application/assetsList/content/1/:appId/createscene/createprogram',
                  name:'createProgram',
                  component:createProgram,
                },
              ]
            }
          ]
        },
        {
          path: '/application/assetsList/content/5/:appId',
          name: 'stageContentList',
          component: stageContentList,
          children:[
            {
              path:'/application/assetsList/content/5/:appId/createstagecontent',
              name:'createStageContent',
              component:createStageContent,
            },
            {
              path:'/application/assetsList/content/5/:appId/createscene',
              name:'createScene',
              component:createScene,
              children:[
                {
                  path:'/application/assetsList/content/5/:appId/createscene/createscenemodel',
                  name:'createSceneModel',
                  component:createSceneModel,
                },
                {
                  path:'/application/assetsList/content/5/:appId/createscene/createbgm',
                  name:'createBgm',
                  component:createBgm,
                },
                {
                  path:'/application/assetsList/content/5/:appId/createscene/createprogram',
                  name:'createProgram',
                  component:createProgram,
                },
              ]
            }
          ]
        },
        {
          path: '/application/assetsList/content/3/:appId',
          name:'scene',
          component:()=>import('@/components/noverStage/scene'),
          },
        {
          path: '/application/assetsList/content/2/:appId',
          name: 'arContentList',
          component: arContentList,
          children:[
            {
              path:'/application/assetsList/content/2/:appId/createarcontent',
              name:'createArContent',
              component:createArContent,
            }
          ]
        },
        {
          path: '/application/assetsList/backgroundMusic/1/:appId',
          name: 'backgroundMusic',
          component: backgroundMusic,
        },
        {
          path: '/application/assetsList/backgroundMusic/1/:appId',
          name: 'backgroundMusic',
          component: backgroundMusic,
        },
        {
          path: '/application/assetsList/content/4/:appId',
          name: 'arContentList',
          component: arContentList,
          children:[
            {
              path:'/application/assetsList/content/4/:appId/createarcontent',
              name:'createArContent',
              component:createArContent,
            }
          ]
        },
        {//????????????
          path: '/application/assetsList/equipPut/:playId/:appId',//????????????-????????????
          name: 'equipPutView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/equip/piano/:playId/:appId',//????????????-??????
          name: 'pianoView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/groupConnect/mp3Animation/:playId/:appId',//????????????-mp3??????
          name: 'mp3AnimationView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/groupConnect/ensemble/:playId/:appId',//????????????-?????????
          name: 'ensembleView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/groupConnect/pianoConcerto/:playId/:appId',//????????????-?????????
          name: 'pianoConcertoView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/groupConnect/icon/8/:appId',//????????????-icon
          name: 'iconModelView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/assets/100/:playId/:appId',//????????????-??????
          name: 'musicView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/assets/101/:playId/:appId',//????????????-??????
          name: 'animationView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/assets/102/:playId/:appId',//????????????-????????????
          name: 'carrierModelView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/material/103/:playId/:appId',//????????????-????????????
          name: 'modelView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/assets/104/:playId/:appId',//????????????-??????
          name: 'videoView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/assets/105/:playId/:appId',//????????????-????????????
          name: 'imageCutView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/assets/107/:playId/:appId',//????????????-MP4??????
          name: 'mp4VideoView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/material/109/:playId/:appId',//????????????-????????????
          name: 'cartoonmusicView',
          component: ()=>import('@/components/magical/viewM'),
        },
        {
          path: '/application/assetsList/material/110/:playId/:appId',//????????????-MP4??????
          name: 'mp4modelView',
          component: ()=>import('@/components/magical/viewM'),
        },
      ],
    },
    {
      path: '/firstNav',
      name: 'firstNav',
      component: firstNav
    },
  ]
 },
    {
      path: '/putManage',//????????????
      name: 'putManage',
      component: putManage,
      children:[
        {
          path: '/putManage/putList',//????????????
          name: 'putList',
          component: putList,
          children: [
            {
              path: '/putManage/putList/putCreate',//????????????
              name: 'putCreate',
              component: putCreate
            },
            {
              path: '/putManage/putList/putInfo',//????????????
              name: 'putInfo',
              component: putInfo
            }
          ]
        },

      ]
    },
    
     {
       path:'/login',
       name:'login',
       component:login
     },
    {
      path:'/logout',
      name:'logout',
      component:logout
    },
    {
      path:'/forgot',
      name:'forgot',
      component:forgot
    },
    {
      path:'/imageUtopa',
      name:'imageUtopa',
      component:imageUtopa
    },
    {
      path:'/version',
      name:'version',
      component:version
    }
 ]
})
