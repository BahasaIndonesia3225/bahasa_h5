import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, connect } from 'umi';
import { Space, Modal, Radio, AutoCenter, List, Image, Empty, NoticeBar } from 'antd-mobile'
import HistoryManager from '@/utils/index'
import './index.less';

const courseList = (props) => {
  const historyManager = new HistoryManager("historyRecords");
  const [courseListData, setCourseListData] = useState([]);
  useEffect(() => {
    const courseListData = historyManager.getHistory();
    setCourseListData(courseListData)
  }, [])

  //观看课程
  const navigate = useNavigate();
  const dumpDetail = ({ id, title, vod }, index) => {
    navigate("/confidentiality", {
      replace: false,
      state: { id, title, vod }
    })
  }

  return (
    <div className="historyCourse">
      <div className="chapterAttention">
        <div>
          <p>观看历史</p>
          <div className="courseNum">
            <span>共{courseListData.length}条记录</span>
          </div>
        </div>
        <NoticeBar
          style={{
            borderRadius: 16,
            '--background-color': '#ffffff',
            '--border-color': '#ffffff'
          }}
          content="观看历史仅保存在浏览器缓存中。更换浏览器或者清空缓存可能会导致观看历史丢失，请不要在微信中直接打开学习系统。"
          color='info'
        />
      </div>
      <div className="chapterContain">
        {
          courseListData.length ? (
            <List>
              {
                courseListData.map((item, index) => {
                  const {id, title, vod, time} = item;
                  return (
                    <List.Item
                      key={vod}
                      onClick={() => dumpDetail({id, title, vod}, index)}
                    >
                      <div className="courseItem">
                        <div className="courseNum">
                          <span>{index + 1}</span>
                        </div>
                        <div className="courseTitle">
                          <div className="courseName">
                            <span>{title.split('】')[1]}</span>
                          </div>
                          <div className="courseTime">
                            <span>观看于{time}</span>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )
                })
              }
            </List>
          ) : <Empty description='暂无数据' style={{marginTop: '50%'}}/>
        }
      </div>
    </div>
  )
}

export default courseList
