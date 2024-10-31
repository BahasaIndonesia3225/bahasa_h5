import React, { useState, useEffect } from 'react'
import { Space, Mask, SpinLoading, Divider, Image, Modal } from 'antd-mobile'
import AMapLoader from "@amap/amap-jsapi-loader";
import styles from "./index.less";
import {request} from "../../../services";

export default function MapContainer() {
  const [visible, setVisible] = useState(true);

  const updateCoordinate = (lng, lat) => {
    const data = {lng, lat};
    request.post('/business/web/member/updateUserLat', { data }).then(res => {
      console.log(res)
    })
  }

  const getAllUserCoordinate = () => {
    const data = {page: 1, size: 3000};
    request.post('/business/admin/member/listH5', { data }).then(res => {
      console.log(res)
    })
  }
  useEffect(() => { getAllUserCoordinate() })

  //初始化地图
  let map = null;
  useEffect(() => {
    window._AMapSecurityConfig = { securityJsCode: "bf5a67900d50ea87ba733cc59e04b95a" };
    AMapLoader.load({
      key: "fc442aa14ddc3a244d645bd4d4f8ab7a", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap) => {
        //获取地图的定位坐标
        AMap.plugin('AMap.Geolocation', function() {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 10000, // 设置定位超时时间，默认：无穷大
            offset: [10, 20],  // 定位按钮的停靠位置的偏移量
            zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            position: 'RB' //  定位按钮的排放位置,  RB表示右下
          })
          geolocation.getCurrentPosition(function(status,result){
            if(status === 'complete'){
              onComplete(result)
            }else{
              onError(result)
            }
          });

          function onComplete (data) {
            console.log('浏览器定位');

            setVisible(false)
            const { position } = data;
            const { lng, lat } = position;
            updateCoordinate(lng, lat)
            map = new AMap.Map("container", {
              viewMode: "3D", // 是否为3D地图模式
              zoom: 11, // 初始化地图级别
              center: [lng, lat], // 初始化地图中心点位置
            });
            // 添加自己的位置
            const marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat),
              title: "我的位置",
            });
            map.add(marker);
          }

          function onError (data) {
            console.log('城市定位');
            AMap.plugin('AMap.CitySearch', function () {
              var citySearch = new AMap.CitySearch()
              citySearch.getLocalCity(function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  // 查询成功，result即为当前所在城市信息
                  const { city, bounds } = result;
                  const { southWest, northEast } = bounds;
                  const southWest_lnglat = new AMap.LngLat(southWest.lng, southWest.lat);
                  const northEast_lnglat = new AMap.LngLat(northEast.lng, northEast.lat);
                  const Bounds = new AMap.Bounds(southWest_lnglat, northEast_lnglat);

                  setVisible(false)
                  const position = Bounds.getCenter();
                  const { lng, lat } = position;
                  updateCoordinate(lng, lat)
                  map = new AMap.Map("container", {
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                    center: [lng, lat], // 初始化地图中心点位置
                  });
                  // 添加自己的位置
                  const marker = new AMap.Marker({
                    position: new AMap.LngLat(lng, lat),
                    title: "我的位置",
                  });
                  map.add(marker);
                }
              })
            })
          }
        })
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map?.destroy();
    };
  }, []);

  return (
    <>
      <Mask opacity='thin' visible={visible}>
        <div className={styles.overlayContent}>
          <Space direction='vertical'>
            <SpinLoading color='primary' />
            <span>定位中...</span>
          </Space>
        </div>
      </Mask>
      <div
        id="container"
        className={styles.container}>
      </div>
    </>
  );
}
