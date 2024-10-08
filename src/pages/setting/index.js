import React, { useLayoutEffect, useState }  from 'react';
import { useNavigate, connect } from 'umi';
import { List, Switch } from 'antd-mobile';
import "./index.less"

export default () => {
  let navigate = useNavigate();

  return (
    <div className="setting">
      <List header='偏好设置'>
        <List.Item onClick={() => {
          navigate("/aboutUs", { replace: true })
        }}>
          关于我们
        </List.Item>
      </List>
    </div>
  )
}
