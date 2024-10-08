import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, connect } from 'umi';
import { Space, Modal, Radio, AutoCenter, List, Image, Empty, Skeleton } from 'antd-mobile'
import { LockFill } from 'antd-mobile-icons'
import { request } from "@/services";
import './index.less';

const courseList = (props) => {
  const stateParams = useLocation();
  const { id, name, iconArt } = stateParams.state;
  const [loading, setLoading] = useState(false)
  const [courseListData, setCourseListData] = useState([]);

  //观看课程
  const navigate = useNavigate();
  const dumpDetail = ({ id, title, vod, isPass }, index) => {
    if(index === 0) {
      //点击第一节课程
      navigate("/confidentiality", {
        replace: false,
        state: { id, title, vod }
      })
    }else {
      //点击非第一节课程
      if(isPass === 0) {
        //课程未通过
        Modal.show({
          content: <AutoCenter>您没有观看本课的权限，请先通过上节课的题目测试。</AutoCenter>,
          closeOnAction: true,
          actions: [
            {
              key: 'online',
              text: '我知道了',
              primary: true,
            },
          ],
        })
      }else {
        //课程已通过
        Modal.show({
          title: '我们需要知道您的情况',
          content:
            <Radio.Group defaultValue='2' >
              <Space direction='vertical'>
                <Radio value='1'>
                  <span style={{color: 'blue'}}>我已经认真看完上节课的内容同时做好了笔记，背诵好了所有知识点，做好了学习下节课的准备。</span>
                </Radio>
                <Radio value='2'>
                  <span style={{color: 'red'}}>我没有看过上节课，或者我并没有认真背诵好上节课的单词，但是我仍然希望观看这节课，我愿意承担学到后面越来越学不懂的风险。</span>
                </Radio>
              </Space>
            </Radio.Group>,
          actions: [
            {
              key: 'agree',
              text: '开始学习',
              disabled: false,
              primary: true,
              onClick: () => {
                navigate("/confidentiality", {
                  replace: false,
                  state: { id, title, vod }
                })
              }
            },
            {
              key: 'refuse',
              text: '我不学了'
            },
          ],
          closeOnAction: true
        })
      }
    }
  }

  const queryCourse = () => {
    setLoading(true)
    request.get('/business/web/course/find/TYAIILon')
      .then(res => {
        const { success, content } = res;
        setLoading(false)
        if(success) {
          let { sections } = content;
          let courseList = sections.filter(j => j.chapterId === id )
          courseList = courseList.sort((a, b) => a.sort - b.sort)
          setCourseListData(courseList);

          props.dispatch({
            type: "user/changeCourseList",
            payload: courseList
          })

        }
      })
  }
  useEffect(() => {
    queryCourse()
  }, [])

  return (
    <div className="courseList">
      <div className="chapterAttention">
        <p>{name}</p>
        <div className="courseNum">
          <span>共{courseListData.length}节课程</span>
        </div>
        <div className="imgContian">
          <Image src={iconArt} />
        </div>
      </div>
      <div className="chapterContain">
        {
          loading ? (
            <>
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={5} animated />
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={5} animated />
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={5} animated />
            </>
          ) : (
            courseListData.length ? (
              <List>
                {
                  courseListData.map((item, index) => {
                    const {id, title, vod, isPass, questionNum} = item;

                    //判断上一节答题有没有通过，1 通过，0 未通过
                    let isPass_ = 0;
                    if(index > 0) isPass_ = courseListData[index - 1].isPass;

                    return (
                      <List.Item
                        key={vod}
                        onClick={() => dumpDetail({id, title, vod, isPass: isPass_}, index)}
                      >
                        <div className="courseItem">
                          <span>{index + 1}</span>
                          <span>{title.split('】')[1]}</span>
                          {(index > 0 && isPass_ === 0) ? <LockFill fontSize={20}/> : <></>}
                        </div>
                      </List.Item>
                    )
                  })
                }
              </List>
            ) : <Empty description='暂无数据' style={{ marginTop: '50%' }} />
          )
        }
      </div>
    </div>
  )
}

export default connect((state) => ({}))(courseList)
