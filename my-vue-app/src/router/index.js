import { createRouter, createWebHashHistory } from 'vue-router'

//路由规则
const routes = [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/Main.vue'),
      redirect:"/home",
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue')
      },
       {
        path: 'company',
        name: 'company',
        component: () => import('@/views/PublishCompany.vue')
      },
       {
        path: 'skiper',
        name: 'skiper',
        component: () => import('@/views/PublishSkiper.vue')
      },
       {
        path: 'userinfo',
        name: 'userinfo',
        component: () => import('@/views/UserInfo.vue')
      },
             {
        path: 'userdata',
        name: 'userdata',
        component: () => import('@/views/UserData.vue')
      },
    ]
    }
  ]

  const router = createRouter({
    //history设置路由模式
    history: createWebHashHistory(),
    routes
})

//把路由器暴露出去
export default  router