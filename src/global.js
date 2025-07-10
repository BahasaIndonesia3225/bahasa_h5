import { isMobileOnly, isTablet, isMobile, isDesktop } from 'react-device-detect';

console.log(isMobileOnly, isTablet, isMobile, isDesktop);
// 手机
if (isMobileOnly) {}
// 移动设备(手机, 平板...)
if (isMobile) {}
if (isTablet) {
  // 平板(iPad, 安卓平板...)
  window.location.href = 'http://studypc.bahasaindo.cn/';
  // window.location.href = 'http://studypc.bahasaindo.net';
}
if (isDesktop) {
  // 桌面端浏览器
  window.location.href = 'http://studypc.bahasaindo.cn/';
  // window.location.href = 'http://studypc.bahasaindo.net';
}
