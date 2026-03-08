import React, { useState, useEffect, useRef } from 'react'
import { Space, Mask, SpinLoading, Divider, Image, Modal, Button, ActionSheet } from 'antd-mobile'
import { useNavigate } from 'umi';
import {request} from "@/services";
import './index.less';

export default () => {
  const timerRef = useRef(null); // 使用 Ref 存储定时器 ID
  const checkQrCode = (code) => {
    request.post('/business/web/member/getWxCode', { data: { code } })
      .then(res => {
        const { content } = res;
        console.log(content);


        // 如果校验成功，记得清除定时器！
        // clearInterval(timerRef.current);
      }).catch(error => {
      console.error('Failed to get QR code:', error); // 错误处理
    });
  }

  const queryQrCode = () => {
    request.get('/business/web/member/getWxQr')
    .then(res => {
      const { content } = res;
      const { state, url } = content;
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        // 如果需要新窗口打开（虽然微信内通常不支持多窗口，但H5可以环境尝试）
        // link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      // 清除旧的，开启新的
      if(timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        checkQrCode(state);
      }, 2000); // 建议间隔拉长到 2s，减轻服务器压力
    }).catch(error => {
      console.error('Failed to get QR code:', error); // 错误处理
    });
  }
  useEffect(() => {
    queryQrCode();
    return () => {
      if(timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // 加上空数组，保证只执行一次

  return (
    <div className="wxCheck">
      微信校验
    </div>
  )
}
