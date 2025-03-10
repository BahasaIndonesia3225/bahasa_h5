import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, connect } from 'umi';
import { Dialog, Image, Modal, AutoCenter, Button, NoticeBar } from 'antd-mobile'
import { EditSOutline } from 'antd-mobile-icons'
import { request } from '@/services';
import "./index.less"

const courseDetail = (props) => {
  const stateParams = useLocation();
  const { id, title, vod } = stateParams.state;
  const [currentId, setCurrentId] = useState(id);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentVod, setCurrentVod] = useState(vod);
  const [player, setPlayer] = useState(null);

  let navigate = useNavigate();
  const courseList = props.courseList;
  const { questionNum } = courseList.filter(item => item.vod === currentVod)[0];
  const [questionNumber, setQuestionNumber] = useState(questionNum);

  if(player) {
    player.on('ended', function() {
      switchCourse('next')
    })
  }

  const doExercises = () => {
    navigate("/doExercises", {
      replace: false,
      state: {
        id: currentId,
        title: currentTitle,
        vod: currentVod,
        nextTitle: "",
        nextVod: "",
      }
    })
  }
  const switchCourse = async (type) => {
    const index = courseList.findIndex(item => item.vod === currentVod);
    let newId = "";
    let newTitle = "";
    let newVod = "";
    if(type === 'next') {
      //查看下一课程
      if(index === courseList.length - 1) {
        const result = await Dialog.confirm({
          content: '当前课程已是最后一个！',
        })
        return;
      }else {
        const {id, title, vod} = courseList[index + 1];
        const isPass = courseList[index].isPass;
        newId = id;
        newTitle = title;
        newVod = vod;
        if(isPass === 0) {
          Modal.show({
            content: <AutoCenter>需要通过本节课测试才能进入下一课，你做好准备了吗？</AutoCenter>,
            closeOnAction: true,
            actions: [
              {
                key: 'online',
                text: '做好准备了',
                primary: true,
                onClick: () => {
                  navigate("/doExercises", {
                    replace: false,
                    state: {
                      id: currentId,
                      title: currentTitle,
                      vod: currentVod,
                      nextId: newId,
                      nextTitle: newTitle,
                      nextVod: newVod,
                    }
                  })
                }
              },
              {
                key: 'online',
                text: '还没准备好',
              },
            ],
          })
          return;
        }
      }
    }else {
      //查看上一课程
      if(index === 0) {
        const result = await Dialog.confirm({
          content: '当前课程已是第一个！',
        })
        return;
      }
      newId = courseList[index - 1].id;
      newTitle = courseList[index - 1].title;
      newVod = courseList[index - 1].vod;
    }
    setCurrentId(newId)
    setCurrentTitle(newTitle);
    setCurrentVod(newVod);
  }

  useEffect(() => {
    if(player) {
      request.get('/file/web/get-auth/' + currentVod).then(res => {
        const { success, content } = res;
        player.replayByVidAndPlayAuth(currentVod,content);
      })
    }else {
      request.get('/file/web/get-auth/' + currentVod).then(res => {
        const { success, content } = res;
        if(success) {
          new Aliplayer({
            id: "player-con",
            vid: currentVod,
            playauth: content,
            height: "300px",
            cover: './image/cover.jpg',
            "autoplay": true,
            "isLive": false, //是否为直播播放
            "rePlay": false,
            "playsinline": true,
            "preload": true,
            "language": "zh-cn",
            "controlBarVisibility": "click",
            "showBarTime": 5000,
            "useH5Prism": true,
            "components": [{
              name: 'BulletScreenComponent',
              type: AliPlayerComponent.BulletScreenComponent,
              args: [
                props.waterMarkContent + "，加油学习！",
                {
                  fontSize: '16px',
                  color: 'rgba(136, 0, 174, 0.1)'
                },
                'random'
              ]
            }]
          }, function (player) {
            setPlayer(player);
          });
        }
      })
    }
  }, [ currentVod ])

  return (
    <div className="courseDetail">
      <p className="helloUser">
        <span>你好呀，{props.waterMarkContent}</span>
      </p>
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
          <Image src='./image/img_intro.png'/>
        </div>
      </div>
      <p className="courseTitle">
        <span>{currentTitle}</span>
      </p>
      <div className="coursePlayArea">
        <div id="player-con"/>
      </div>
      {
        questionNumber > 0 && (
          <Button
            color='primary'
            fill='outline'
            block
            onClick={doExercises}
            style={{ marginBottom: 28 }}>
            <EditSOutline />&nbsp;
            随堂练习(共{questionNumber}道题目)
          </Button>
        )
      }
      <div className="courseNextBtn">
        <Image
          style={{marginRight: 12}}
          src='./image/prveCourse.png'
          onClick={() => switchCourse('prve')}/>
        <Image
          src='./image/nextCourse.png'
          onClick={() => switchCourse('next')}/>
      </div>
      <NoticeBar
        content='如果视频无法加载（如黑屏、一直转圈或出现错误代码），请尝试切换网络重新登录后再播放。由于印尼 WiFi 质量较差，建议切换到移动流量以获得更稳定的连接。老师解答时间为早上9点至晚上7点。'
        wrap
        color='alert'
      />
    </div>
  )
}

export default connect((state) => {
  return {
    waterMarkContent: state.user.waterMarkContent,
    courseList: state.user.courseList,
  }
})(courseDetail)
