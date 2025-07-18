import { defineConfig } from "umi";

const { serverConfig } = require('./server.config');
const config = serverConfig[process.env.APP_ENV || 'Hongkong'];
const { outputPath } = config;

const baseUrl =  "http://study.bahasaindo.cn";

//配置文件，包含 Umi 所有非运行时配置
export default defineConfig({
  title: "东东印尼语",
  npmClient: 'pnpm',
  outputPath,
  history: { type: 'hash' },
  hash: true,  //让 build 之后的产物包含 hash 后缀, 避免浏览器加载缓存
  mock: false, //关闭 Mock 功能
  clientLoader: {}, //路由数据预加载
  theme: {
    '@primary-color': '#1DA57A'
  },
  proxy: {
    //备用环境
    '/prod-api': {
      'target': baseUrl + '/prod-api/',
      'changeOrigin': true,
      'pathRewrite': { '^/prod-api' : '' },
    },
  },
  routes: [
    { path: "/", component: "home" },
    { path: "/home", component: "home" },
    { path: "/login", component: "login", name: "Selamat datang 欢迎" },
    { path: "/courseCatalog", component: "courseCatalog", name: "课程分类" },
    { path: "/courseList", component: "courseList", name: "课程目录" },
    { path: "/confidentiality", component: "confidentiality", name: "保密协议" },
    { path: "/courseDetail", component: "courseDetail", name: "课程查看" },
    { path: "/setting", component: "setting", name: "设置" },
    { path: "/doExercises", component: "doExercises", name: "习题练习" },
    { path: "/aboutUs", component: "aboutUs", name: "关于我们" },
    { path: "/peopleNearby", component: "peopleNearby", name: "附近的人" },
    { path: "/historyCourse", component: "historyCourse", name: "观看历史" },
  ],
  alias: {},
  links: [
    {
      rel: "stylesheet",
      type: "text/css",
      href: 'https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/skins/default/aliplayer-min.css'
    },
  ],
  headScripts: [
    'https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/aliplayer-h5-min.js',
    { src: '/lib/aliplayercomponents-1.0.9.min.js' },
  ],
  plugins: ['@umijs/plugins/dist/dva'],
  dva: {}
});
