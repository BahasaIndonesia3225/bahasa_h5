import React, { useState, useEffect } from 'react'
import { Space, Mask, SpinLoading, Divider, Image, Modal, Button, ActionSheet } from 'antd-mobile'
import { useNavigate } from 'umi';
import { extend } from "umi-request";
import './index.less';

const request = extend({ timeout: 10000 })

export default () => {
  let navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [visible_, setVisible_] = useState(false)
  const [appLink, setAppLink] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setVisible_(true);
    }, 500);
    request.get('http://taioassets.oss-cn-beijing.aliyuncs.com/appConfig.json').then(res => {
      const { appLink } = res;
      setAppLink(appLink)
    });
  }, [])

  const dumpLink = (type) => {
    const link = type === "youtube" ? "https://www.youtube.com/channel/UCNz0CuIKBXpizEmn8akC42w" : "https://v.douyin.com/iNNrghAv/ 8@5.com";
    window.open(link, "_blank")
  }

  const downLoadApp = (type) => {
    let url = "";
    if(type === "android") {
      url = appLink
    }else {
      url = 'https://apps.apple.com/cn/app/bahasadong/id6502833636'
    }
    var user = navigator.userAgent;
    var isAndroid = user.indexOf("Android") > -1 || user.indexOf("Adr") > -1;
    var isiOS = !!user.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isAndroid) {
      window.open(url)
    }else if(isiOS) {
      window.location.href = url;
    }
  }

  //线路切换功能
  const [lineVisible, setLineVisible] = useState(false);
  const lineText = () => {
    const url = window.location.href;
    if (url.indexOf("bahasaindo.net") > -1) {
      return "香港线路";
    }else if( url.indexOf("study.bahasaindo.cn") > -1) {
      return "大陆线路";
    }else {
      return '台湾线路';
    }
  };
  const lineList = [
    { key: 'line1', text: '香港线路', url: "http://bahasaindo.net/" },
    { key: 'line2', text: '大陆线路', url: "http://study.bahasaindo.cn/" },
    { key: 'line3', text: '台湾线路', url: "http://bahasaindo.com/" },
  ];
  const switchLine = (data) => {
    const { text, url } = data;
    try {
      // 优先使用双保险策略
      history.replaceState(null, "", url);
      window.location.replace(url);
    } catch (e) {
      // 兼容异常情况
      window.location.href = url;
    }
  }

  return (
    <div className="home">
      <Mask opacity='thick' visible={visible}>
        <div className='overlayContent'>
          <Space direction='vertical'>
            <SpinLoading color='primary' />
            <span>加载中...</span>
          </Space>
        </div>
      </Mask>
      <Modal
        visible={visible_}
        content={<b style={{color: 'red'}}>根据国内《网络安全法》有关规定，观看课程需要完成实名认证。东东印尼语从未与任何学习机构合作，请勿与他人共享帐号。</b>}
        closeOnAction
        onClose={() => {
          setVisible_(false)
        }}
        actions={[
          {
            key: 'confirm',
            text: '我知道了',
            primary: true,
          },
        ]}
      />
      <div className="lineSwitch">
        <Button
          color='primary'
          fill='none'
          onClick={() => setLineVisible(true)}>{lineText()}</Button>
        <ActionSheet
          extra='请在老师的指导下切换线路'
          closeOnAction={true}
          visible={lineVisible}
          actions={lineList}
          onAction={(key) => switchLine(key)}
          onClose={() => setLineVisible(false)}
        />
      </div>
      <Image
        className="logoCard"
        src='./image/login_home.png'
      />
      <Image src='./image/WechatIMG4809.jpg'/>
      <Image
        style={{marginBottom: 16, marginTop: 16}}
        src='./image/loginBtn.png'
        onClick={() => navigate("/login", { replace: false })}
      />
      <Image
        style={{marginBottom: 16}}
        src='./image/loginProtocol.png'
        onClick={() => window.open("https://taioassets.oss-cn-beijing.aliyuncs.com/Pdfs/%E4%B8%9C%E4%B8%9C%E5%8D%B0%E5%B0%BC%E8%AF%AD%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf", "_blank")}
      />
      <Image
        style={{marginBottom: 16}}
        src='https://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongIndonesiaVocabulary/merchantLogo.png'
        onClick={() => window.open("http://makandong.com", "_blank")}
      />
      <Divider>下载东东印尼语App</Divider>
      <Space className="downLoadBtn" style={{ '--gap': '8px' }} justify="center" block={true}>
        <Image
          className="androidDownload"
          src='./image/Android.png'
          onClick={() => downLoadApp('android')} />
        <Image
          className="iosDownload"
          src='./image/ios.png'
          onClick={() => downLoadApp('ios')} />
      </Space>
      <div className="bahasaindoFooter">
        <div className="friendLink">
          <span onClick={() => dumpLink('youtube')}>东东印尼语YouTube</span>
          <span onClick={() => dumpLink('tiktok')}>东东印尼语抖音</span>
        </div>
        <p>
          D 2019-2024 PT BahasaDona All rights reserved
        </p>
      </div>
    </div>
  )
}
