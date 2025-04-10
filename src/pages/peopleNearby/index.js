import React, { useState, useEffect, useRef }  from 'react';
import { List, FloatingPanel, Image } from 'antd-mobile';
import AMap from './Amaps'
import GoogleMaps from './GoogleMaps'
import {request} from "@/services";
import styles  from "./index.less";

const anchors = [72, 72 + 119, window.innerHeight * 0.8]

export default () => {
  const ref = useRef(null);
  const [peopleNearby, setPeopleNearby] = useState([]);

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const getAllUserCoordinate = async () => {
    const data = { page: 1, size: 1000 };
    const { success, content } = await request.post('/business/web/member/listH5', { data });
    if(success) {
      setPeopleNearby(content)
    }
  }
  useEffect(() => { getAllUserCoordinate() }, [])

  return (
    <div className={styles.peopleNearby}>
      {/*<AMap className={styles.map} />*/}
      <GoogleMaps className={styles.map} locations={peopleNearby} />
      <FloatingPanel anchors={anchors} ref={ref}>
        <List header='寻找附近的同学'>
          {peopleNearby.map((item, index) => (
            <List.Item
              key={item.name}
              prefix={
                <Image
                  src={'https://api.dicebear.com/7.x/miniavs/svg?seed=' + (index + 1)}
                  style={{ borderRadius: 20 }}
                  fit='cover'
                  width={40}
                  height={40}
                />
              }
              description={`该同学今日已经学习${getRandomNumber(10, 100)}min`}>
              {item.name}
            </List.Item>
          ))}
        </List>
      </FloatingPanel>
    </div>
  )
}
