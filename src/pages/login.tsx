import {Alert, Button, Form, Input } from "antd";
import axios from "axios";
import {setCookie} from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from '@/styles/Login.module.scss'

const Register = () => {
    const [form] = Form.useForm();
    const router = useRouter()
    const [error, setError] = useState(false)

    const onFinish = async (values: any) => {
        try {
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/auth/login`, {
                params: values
            })

            setCookie('token', data.token)
            router.push('/projects')
        } catch (e) {
            console.error(e);
            setError(true)
            setTimeout(() => setError(false), 3000)
        }
    };

    return (
        <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            className={styles.form}
        >
            {error && <Alert className={styles.error} message="Неправильный логин или пароль" type="error" closable  />}
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
            <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.login_btn}>
                    Войти
                </Button>
                <Link href={'register'}>Регистрация</Link>
            </Form.Item>
        </Form>
    );
}

export default Register