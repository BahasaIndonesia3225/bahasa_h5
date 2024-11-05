import React, { useState, useEffect } from 'react'
import { Space, Mask, SpinLoading, Divider, Image, Modal } from 'antd-mobile';
import {APIProvider, Map, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import styles from "./index.less";
import {request} from "../../../services";

export default function MapContainer(props) {
  const [visible, setVisible] = useState(false);

  const PoiMarkers = () => {
    const { locations } = props;
    return (
      <>
        {locations.map(({lng, lat, name}) => (
          <AdvancedMarker
            key={name}
            position={{lat, lng}}>
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    );
  };

  const updateCoordinate = (lng, lat) => {
    const data = {lng, lat};
    request.post('/business/web/member/updateUserLat', { data }).then(res => {
      console.log('位置更新成功！')
    })
  }

  const onCameraChanged = (ev) => {
    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
  }

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
      <APIProvider apiKey={'AIzaSyDNl5Yr1UFu_AZVBKi5LH89fxkd7wnWo24'}>
        <Map
          style={{width: '100vw', height: '100vh'}}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          defaultZoom={3}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onCameraChanged={ (ev) => onCameraChanged(ev) }
        >
          <PoiMarkers />
        </Map>
      </APIProvider>
    </>
  )
}
