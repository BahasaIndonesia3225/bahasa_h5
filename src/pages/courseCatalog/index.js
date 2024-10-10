import React, { useState, useEffect } from 'react';
import { useNavigate, connect } from 'umi';
import { Image, Modal, AutoCenter, Empty, Skeleton } from 'antd-mobile'
import { request } from '@/services';
import './index.less';

const coverArtList = [
  {
    key: '基础课',
    title: "东东基础课 Dasar",
    iconArt: './image/img_base.png',
    coverArt: <Image src='./image/baseCourse.png' fit='fill' />
  },
  {
    key: '进阶课',
    title: "东东进阶课 Lanjutan",
    iconArt: './image/img_advanced.png',
    coverArt: <Image src='./image/advancedCourse.png' fit='fill' />
  },
  {
    key: '发音课',
    title: "东东发音课 Pgucapan",
    iconArt: './image/img_voice.png',
    coverArt: <Image src='./image/voiceCourse.png' fit='fill' />
  }
]

const courseCatalog = (props) => {
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [isPass_, setIsPass_] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleBindPhone = () => {
    Modal.show({
      title: '未绑定手机号码',
      content: <span>
          根据《中华人民共和国网络安全法》第24条有关规定，我们需要在2025年3月1日前完成所有用户的实名验证。
          <span style={{ color: '#ff0000', fontWeight: 'bold' }}>中国大陆用户可以通过绑定+86手机号完成实名制注册。</span>
          港澳台以及外籍人士请联系老师进行人工核验。
        </span>,
      closeOnAction: true,
      actions: [
        {
          key: 'download',
          text: '去绑定',
          primary: true,
          onClick: () => {
            navigate("/setting", {
              replace: false,
            })
          }
        },
        {
          key: 'online',
          text: '取消',
        },
      ],
    })
  }

  const queryChapters = async () => {
    //获取手机号、是否开通进阶课
    const userInfoResponse = await request.get('/business/web/member/getUser');
    const { code, content: userInfo } = userInfoResponse;
    const { phone, userType } = userInfo;
    if(!phone) handleBindPhone();

    //获取课程信息
    setLoading(true)
    const userCourseResponse = await request.get('/business/web/course/find/TYAIILon');
    const { success, content: userCourse } = userCourseResponse;
    let { chapters } = userCourse;
    //判断是否开通进阶课
    if(userType === 0) {
      chapters = chapters.filter(item => item.name.indexOf('进阶课') === -1)
    }
    chapters = chapters.map((item, index) => {
      const {id, name, isPass, doQuestion} = item;
      const otherData = coverArtList.filter(item => name.indexOf(item.key) > -1)[0]
      return {
        id, name, isPass, doQuestion,
        title: otherData['title'],
        iconArt: otherData['iconArt'],
        coverArt: otherData['coverArt'],
      }
    })
    setIsPass_(chapters[0].isPass);
    setChapters(chapters);
    setLoading(false)
  }

  useEffect(() => {
    queryChapters()
  }, [])

  //查看章节
  const dumpDetail = (item, index) => {
    const {id, name, isPass, title, iconArt} = item;
    if(name.indexOf('进阶课') > -1 && isPass_ === 0) {
      Modal.show({
        content: <AutoCenter>请先完成基础课的学习。</AutoCenter>,
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
      navigate("/courseList", {
        replace: false,
        state: { id, name: title, iconArt }
      })
    }
  }

  return (
    <div className="chapterCatalog">
      <div className="chapterAttention">
        <ul>
          <li>
            <span>学习过程中请勿开启录屏软件或第三方下载软件，否则您的帐号可能会受到限制。</span>
          </li>
          <li>
            <span>如果您的网络不佳，视频加载可能需要10-20秒，期间若</span>
            <span style={{color: '#ff0000'}}>出现转圈、黑屏、有声音没画面等情况，</span>
            <span> 请耐心等待。如果长时问无法加载，请切换网络重新登陆。</span>
          </li>
        </ul>
        <div className="chapterAttentionImg">
          <Image src='./image/img_intro.png' />
        </div>
      </div>
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
          chapters.length ? (
            <ul className="courseCatalogCard">
              {
                chapters.map((item, index) => {
                  return (
                    <li
                      key={item.id}
                      onClick={() => dumpDetail(item ,index)}>
                      {item.coverArt}
                    </li>
                  )
                })
              }
            </ul>
          ) : <Empty description='暂无数据' style={{ marginTop: '50%' }} />
        )
      }
    </div>
  )
}

export default courseCatalog
