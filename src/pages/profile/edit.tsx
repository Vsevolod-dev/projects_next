import { Alert, Avatar, Form, Input, Layout } from "antd"
import { FC, useState } from "react"
import cookie from "cookie"
import axios from "axios"
import styles from "@/styles/Profile.module.scss"
import { CheckSquareOutlined } from "@ant-design/icons"
import { ProfileComponentType } from "@/types"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"
import { KeyboardEvent } from "react"


export const getServerSideProps = async (context) => {
    let token = ''

    if (context.req.headers.cookie) {
        token = cookie.parse(context.req.headers.cookie).token
    }

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return {
            props: {
                profile: res.data
            }
        }
    } catch (e) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        };
    }
}

const EditProfile: FC<ProfileComponentType> = ({profile}) => {
    const [form] = Form.useForm()    
    const router = useRouter()
    const [error, setError] = useState('')

    const onFinish = async (values) => {
        values.phone = values.phone.replace(/[^0-9]/g, "")
        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/profile`, values, {
                headers: {
                    Authorization: `Bearer ${getCookie('token')}`
                }
            })
            router.push(`/profile`)
        } catch (e) {
            if (e.response) {
                switch (e.response.data.message) {
                  case "Email is not valid":
                    setError('Неверный email')
                    break
                  case "Phone is not valid":
                    setError('Неверный номер телефона')
                    break
                  case "This email is in use by another user":
                    setError('Пользователь с таким email уже зарегистрирован')
                    break
                  default:
                    setError('Ошибка при регистрации')
                    break
                }
              }
              setTimeout(() => setError(''), 3000)
        }
    }

    const submitForm = (event: KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            form.submit()
        }
    }

    return (
        <Form onFinish={onFinish} initialValues={profile} form={form} layout="vertical" onKeyUp={(e) => submitForm(e)}>
            {error !== '' && <Alert className={'error'} message={error} type="error" closable  />}
            <Layout className={styles.profile__wrapper}>
                <div className={styles.profile__sider}>
                    <Avatar 
                        src={'https://xsgames.co/randomusers/avatar.php?g=pixel'} 
                        size={70}
                        className={styles.profile__avatar}
                    />
                    <Form.Item
                        label="Имя пользователя"
                        name="name"
                        rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Должность"
                        name="job"
                    >
                        <Input />
                    </Form.Item>
                    <CheckSquareOutlined onClick={form.submit} className={styles.icon} />
                </div>
                <div className={styles.profile__content}>
                    <h3>Информация</h3>
                    <hr />
                    <div className={styles.profile__info}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Пожалуйста введите email!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Телефон"
                            name="phone"
                        >
                            {/* <Input /> */}
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Github"
                        name="github"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Инстаграм"
                        name="instagram"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Телеграм"
                        name="telegram"
                    >
                        <Input />
                    </Form.Item>
                </div>
            </Layout>
        </Form>
    )
}

export default EditProfile