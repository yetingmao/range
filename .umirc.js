/*
 * @Description: 
 * @Autor: yetm
 * @Date: 2019-12-16 09:07:43
 * @LastEditors: yetm
 * @LastEditTime: 2020-07-23 16:43:59
 */

export default {
  disableCSSModules: true,
  treeShaking: true,
  routes: [{
    path: '/',
    component: '../layouts/index',
    routes: [
      {
        path: '/',
        component: './index',//首页
      },
      {
        path: '/data/set',
        component: './data/set',
      },
      {
        path: '/data/group',
        component: './data/group',
      },
      {
        path: '/data/lable',
        component: './data/lable',
      },
      {
        path: '/data/entity',
        component: './data/entity',
      },
      {
        path: '/data/relation',
        component: './data/relation',
      },
      {
        path: '/data/relmark',
        component: './data/relmark',
      },
    ]
  }],
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: true,

      dynamicImport: false,
      title: '',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  theme: {
    "@primary-color": "#1890ff"
  }
}
