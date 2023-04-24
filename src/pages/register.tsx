import { Button, Form, Input } from "antd"
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Register = () => {
    const [form] = Form.useForm();
  
    const onFinish = async (values: any) => {
      try {
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/auth/register`, values)
        
        setCookie('token', data.token)
      } catch (e) {
        console.error(e);
      }
    };

    return (
        <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
        >
        <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Заполните поле!' }]}>
            <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
        >
            <Input.Password />
        </Form.Item>
        <Form.Item
            label="Повтор пароля"
            name="confirmPassword"
            rules={[{ required: true, message: 'Пожалуйста повторите пароль!' }]}
        >
            <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Регистрация
        </Button>
        <Link href={'login'}>Логин</Link>
      </Form.Item>
    </Form>
    )
}

export default Register