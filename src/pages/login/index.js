import React, { useState } from 'react'
import { useNavigate, connect } from 'umi';
import { Modal, Form, Input, Button, Checkbox, Space, Radio, Image, Grid, Dialog, AutoCenter } from 'antd-mobile';
import {setCookie, getCookie, clearCookie} from '@/utils/rememberPassword';
import { request } from '@/services';
import './index.less';

const deviceTypeOption = {
  "1": 'android',
  "2": 'ios',
  "3": 'windows',
  "4": 'h5',
}

const Login = (props) => {
  const {username = "", tempPassword = "", isRemember = true} = getCookie();
  const [loading, setLoading] = useState(false);

  let userAgreement_ = localStorage.getItem('userAgreement');
  userAgreement_ = userAgreement_ ? JSON.parse(userAgreement_) : [];
  const [userAgreement, setUserAgreement] = useState(userAgreement_);  //用户协议

  //登陆成功提示模态框
  let navigate = useNavigate();
  const handleInputSuccess = () => {
    navigate("/courseCatalog", { replace: true });
  }
  //登陆失败提示模态框（账户密码错误）
  const handleInputError = () => {
    Modal.show({
      title: '用户名或密码错误',
      content: '如您遗忘用户名或密码，请联系老师',
      closeOnAction: true,
      actions: [
        {
          key: 'online',
          text: '再试一次',
          primary: true,
        },
        {
          key: 'download',
          text: '我没买课',
          onClick: () => {}
        },
      ],
    })
  }
  //登陆失败提示模态框（设备过限）
  const handleDeviceError = async (id) => {
    //查询设备列表、数量
    const deviceNumRes = await request.get('/business/web/member/device-count/' + id);
    const deviceListRes = await request.get('/business/web/member/device-list/' + id);
    const deviceNum = deviceNumRes.content;
    const deviceList = deviceListRes.content;
    props.dispatch({
      type: "user/changeDeviceNum",
      payload: deviceNum
    })
    props.dispatch({
      type: "user/changeDeviceList",
      payload: deviceList
    })
    Modal.show({
      title: '登陆设备已达到上限，请在常用设备登陆或联系老师',
      content: (
        <ul>
          <li style={{marginBottom: '8px'}}>
            <Grid columns={3} gap={8}>
              <Grid.Item>
                <div className='gridBox'>
                  设备类型
                </div>
              </Grid.Item>
              <Grid.Item span={2}>
                <div className='gridBox'>
                  设备名称
                </div>
              </Grid.Item>
            </Grid>
          </li>
          {
            deviceList.map(item => {
              const {id, deviceType, deviceId, deviceName} = item;
              return (
                <li key={id} style={{marginBottom: '8px'}}>
                  <Grid columns={3} gap={8}>
                    <Grid.Item>
                      <div className='gridBox'>
                        {deviceTypeOption[deviceType] || '未知'}
                      </div>
                    </Grid.Item>
                    <Grid.Item span={2}>
                      <div className='gridBox'>
                        {deviceName}
                      </div>
                    </Grid.Item>
                  </Grid>
                </li>
              )
            })
          }
        </ul>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'online',
          text: '再试一次',
          primary: true,
        },
      ],
    })
  }
  //表单信息
  const [form] = Form.useForm()
  const onFinish = () => {
    //判断有无勾选保密协议
    if(userAgreement.length < 2) {
      Dialog.alert({
        content: (
          <p>
            <AutoCenter>请勾选同意购课须知、课程保密协议</AutoCenter>
            <AutoCenter>（下面2个勾勾打上才能登陆）</AutoCenter>
          </p>
        ),
        onConfirm: () => {
          console.log('Confirmed')
        },
      })
      return;
    }
    localStorage.setItem('userAgreement', JSON.stringify(userAgreement))

    setLoading(true)
    const values = form.getFieldsValue();
    request.post('/business/web/member/signIn', {
      data: values
    }).then(res => {
      setLoading(false);
      const { code, content } = res;

      //登录成功
      if(code === '00000') {
        //记住密码控制逻辑
        const { mobile, password, autoLogin } = values;
        if(autoLogin === '1') {
          setCookie(mobile, password, 7)
        }else {
          clearCookie()
        }
        //设置token、水印名称
        const { name, token, id } = content;
        props.dispatch({
          type: "user/changeToken",
          payload: token
        })
        props.dispatch({
          type: "user/changeWaterMarkContent",
          payload: name
        })
        handleInputSuccess();
      }

      //登录设备超出限制
      if(code === 'A0100') {
        const { token, id } = content;
        props.dispatch({
          type: "user/changeToken",
          payload: token
        })
        handleDeviceError(id);
      }

      //账号密码错误
      if(code === 'A0004') {
        handleInputError();
      }

    })
  }
  return (
    <div className="login">
      <Image className="img_login" src='./image/img_login.png' />
      <div className="loginContain">
        <p className="loginHeader">
          <span>登录</span>
          <span>/ Masuk / Entrar / </span>
          <span>
            <i>Login</i>
          </span>
        </p>
        <Form
          layout='horizontal'
          form={form}
          initialValues={{
            mobile: username,
            password: tempPassword,
            autoLogin: isRemember ? "1" : '0',
          }}
          onFinish={onFinish}
          footer={
            <Button
              className="loginBtn"
              loading={loading}
              loadingText='登陆中'
              color='primary'
              type='submit'
              block
              size='mini'>
              <div className="loginBtnCon">
                <div className="loginBtnConLeft">
                  <Image className="loginIcon" src='./image/icon_LogIn.png' />
                  <span>登录系统</span>
                </div>
                <div className="loginBtnConRight">
                  <p>Masuk sistem</p>
                  <p>Entrar no sistema</p>
                  <p>
                    <i>User login</i>
                  </p>
                </div>
              </div>
            </Button>
          }
        >
          <Form.Item
            name='mobile'
            label='用户名'
            rules={[{ required: true, message: '用户名不能为空' }]}>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item
            name='password'
            label='密码'
            rules={[{ required: true, message: '密码不能为空' }]}>
            <Input placeholder='请输入密码' />
          </Form.Item>
          <Form.Item
            name='autoLogin'
            label='记住密码：'>
            <Radio.Group>
              <Space>
                <Radio value='1'>是</Radio>
                <Radio value='0'>否</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
      <div className='confidentialityBlock'>
        <div className='confidentialityTxt'>
          <Image
            className="questionIcon"
            src='./image/question.png' />
          <div className="questiontxt">
            <span>请您注意，课程仅供您个人使用。若您将账号共享至他人使用，您的账号会在无警告的前提下永久禁用。</span>
          </div>
        </div>
        <Checkbox.Group
          value={userAgreement}
          onChange={val => setUserAgreement(val)}
        >
          <Space direction='vertical'>
            <Checkbox className="confidentialityCheckbox" value='one'>
              我是本账号持有人，且清楚课程无法退款
            </Checkbox>
            <Checkbox className="confidentialityCheckbox" value='two'>
              我同意并遵守《课程保密协议》
              {/*<a href="./doc/useTerms.pdf" rel="noopener noreferrer">《用户协议（EULA）》</a>*/}
              {/*<a href="./doc/privacyPolicy.pdf" rel="noopener noreferrer">《隐私政策》</a>*/}
            </Checkbox>
          </Space>
        </Checkbox.Group>
      </div>
    </div>
  )
}

export default connect((state) => ({}))(Login)
