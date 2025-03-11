import React, { useState, useEffect } from 'react'
import { Space, Mask, SpinLoading, Dialog, Image, Modal } from 'antd-mobile';
import {APIProvider, Map, useMap, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import styles from "./index.less";
import {request} from "../../../services";

export default function MapContainer(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [poiMarkers, setPoiMarkers] = useState([]);
  const [center, setCenter] = useState({lat: -6.189465707537651, lng: 106.82024454977989});

  //地图加载成功
  const onLoadMap = () => {
    setIsLoading(false)
    // getLocation()
  }

  //获取用户位置
  const getLocation = async () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = (position) => {
      const { locations } = props;
      const { latitude: lat, longitude: lng } = position.coords;
      setCenter({ lat, lng });
      setPoiMarkers([{lng, lat, name: 'me'}, ...locations]);
      updateCoordinate(lng, lat);
    }
    const error = (error) => {
      Dialog.alert({
        content: '获取定位失败',
        onConfirm: () => {
          const { locations } = props;
          setPoiMarkers(locations);
        },
      })
    }
    //WGS84坐标
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  //位置信息更新
  const updateCoordinate = async (lng, lat) => {
    try {
      const data = { lng, lat };
      await request.post('/business/web/member/updateUserLat', { data });
    } catch (error) {
      console.error('Update location failed:', error);
      // 可添加用户提示，如 Toast 显示错误信息
    }
  }

  const onCameraChanged = (ev) => {
    const { center, zoom } = ev.detail;
    setCenter(center);
  }

  return (
    <>
      <Mask opacity='thin' visible={isLoading}>
        <div className={styles.overlayContent}>
          <Space direction='vertical' align='center'>
            <SpinLoading color='primary' />
            <span>地图加载中...</span>
          </Space>
        </div>
      </Mask>
      <APIProvider
        apiKey={'AIzaSyDNl5Yr1UFu_AZVBKi5LH89fxkd7wnWo24'}
        onLoad={() => onLoadMap()}>
        <Map
          style={{width: '100vw', height: '100vh'}}
          mapId='2d961d7bb1e17687'
          center={center}
          defaultZoom={10}
          minZoom={7}
          maxZoom={13}
          gestureHandling='greedy'
          disableDefaultUI={true}
          onCameraChanged={ (ev) => onCameraChanged(ev) }
        >
          {
            poiMarkers.map(({ name, lat, lng }, index) => (
              <AdvancedMarker
                key={`${name}-${index}`}
                position={{lat, lng}}>
                <Pin
                  background={'#ff0000'}
                  glyphColor={'#000'}
                  borderColor={'#000'} />
              </AdvancedMarker>
            ))
          }
        </Map>
      </APIProvider>
    </>
  )
}
