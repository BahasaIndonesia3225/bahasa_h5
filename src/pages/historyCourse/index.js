import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, connect } from 'umi';
import { Space, Modal, Radio, AutoCenter, List, Image, Empty, NoticeBar } from 'antd-mobile'
import HistoryManager from '@/utils/index'
import './index.less';
import {request} from "@/services";

const courseList = (props) => {
  const [courseListData, setCourseListData] = useState([]);
  useEffect(() => {
    request.get('/business/web/member/watchHistory').then(res => {
      const { code, content } = res;
      setCourseListData(content)
    })
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
      </div>
      <div className="chapterContain">
        {
          courseListData.length ? (
            <List>
              {
                courseListData.map((item, index) => {
                  const id = item.id;
                  const title = item.courseName;
                  const vod = item.courseVod;
                  const watchTime = item.creatorTime;
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
                            <span>观看于{watchTime}</span>
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

export default courseList;
