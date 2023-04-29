import { Alert, Button, Form, Input } from "antd"
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useState } from "react";
import styles from "@/styles/Register.module.scss"

const Register = () => {
    const [form] = Form.useForm();
    const [error, setError] = useState('')
  
    const onFinish = async (values: any) => {
      try {
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/auth/register`, values)
        
        setCookie('token', data.token)
      } catch (e) {
        console.error(e);

        switch (e.response.data.message) {
          case "Password mismatch":
            setError('Пароли не совпадают')
            break
          case "User with this email is already exist":
            setError('Пользователь с таким email уже зарегистрирован')
            break
          default:
            setError('Ошибка при регистрации')
            break
        }
        setTimeout(() => setError(''), 3000)
      }
    };

    return (
      <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            className={styles.form}
        >
          {error !== '' && <Alert className={styles.error} message={error} type="error" closable  />}
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
        <Form.Item>
        <Button type="primary" htmlType="submit" className={styles.register_btn}>
          Регистрация
        </Button>
        <Link href={'login'}>Логин</Link>
      </Form.Item>
    </Form>
    )
}

export default Register