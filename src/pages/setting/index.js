import React, { useState, useEffect }  from 'react';
import { useNavigate } from 'umi';
import { List, Form, Input, Modal, Toast } from 'antd-mobile';
import {request} from "@/services";
import "./index.less"

export default () => {
  let navigate = useNavigate();
  const [ phone, setPhone ] = useState("");
  const [visible, setVisible] = useState(false)

  const queryUserPhone = async () => {
    const result = await request.get('/business/web/member/getUser');
    const { code, content } = result;
    const { phone, deviceLimitNum } = content;
    setPhone(phone)
  }

  useEffect(() => {
    queryUserPhone()
  }, []);

  const [form] = Form.useForm();
  const handleGetCode = () => {
    form.validateFields(['mobile']).then(values => {
      request.post('/business/web/member/sendUser', {
        data: values
      }).then(res => {
        const { success, message } = res;
        if(!success) {
          Toast.show({
            icon: 'fail',
            content: message,
          })
        }else {
          Toast.show({
            icon: 'success',
            content: '发送成功',
          })
        }
      })
    })
  }
  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      request.post('/business/web/member/updateUser', {
        data: values
      }).then(res => {
        const { success, message } = res;
        if(!success) {
          Toast.show({
            icon: 'fail',
            content: message,
          })
        }else {
          Toast.show({
            icon: 'success',
            content: '绑定成功',
          })
          setVisible(false);
          queryUserPhone();
        }
      })
    })
  }

  return (
    <div className="setting">
      <List header='偏好设置'>
        <List.Item
          onClick={() => { setVisible(true) }}
          extra={phone || '未绑定'}
          clickable>
          手机号码
        </List.Item>
        <List.Item onClick={() => {
          navigate("/aboutUs", { replace: false })
        }}>
          关于我们
        </List.Item>
      </List>

      <Modal
        visible={visible}
        title='绑定手机号'
        content={
          <Form
            form={form}
            initialValues={{
              mobile: '',
              code: '',
            }}
          >
            <Form.Item
              name='mobile'
              label='手机号'
              rules={[
                { required: true, message: '手机号不能为空' },
                { pattern:  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的中国大陆手机号码' },
              ]}>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item
              name='code'
              label='验证码'
              extra={<a onClick={() => handleGetCode()}>发送验证码</a>}
              rules={[
                { required: true, message: '验证码不能为空' },
                { pattern:  /^\d{6}$/, message: '请输入正确的验证码' },
              ]}>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Header />
          </Form>
        }
        actions={[
          {
            key: 'confirm',
            text: '提交',
            primary: true,
            onClick: () => {
              handleFormSubmit()
            }
          },
          {
            key: 'online',
            text: '取消',
            onClick: () => {
              setVisible(false);
              form.resetFields();
            }
          },
        ]}
      />

    </div>
  )
}
