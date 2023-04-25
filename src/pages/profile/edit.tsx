import { Avatar, Form, Input, Layout } from "antd"
import { FC } from "react"
import cookie from "cookie"
import axios from "axios"
import styles from "@/styles/Profile.module.scss"
import { CheckSquareOutlined } from "@ant-design/icons"
import { ProfileComponentType } from "@/types"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"


const { Content, Sider } = Layout

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

    const onFinish = async (values) => {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/profile`, values, {
            headers: {
                Authorization: `Bearer ${getCookie('token')}`
            }
        })
        router.push(`/profile`)
        console.log(res);
    }

    return (
        <Form onFinish={onFinish} initialValues={profile} form={form} layout="vertical">
            <Layout className={styles.profile__wrapper}>
                <Sider theme="light" className={styles.profile__sider}>
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
                </Sider>
                <Content className={styles.profile__content}>
                    <h3>Информация</h3>
                    <hr />
                    <div className={styles.profile__info}>
                        <Form.Item
                            label="Email"
                            name="email"
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
                </Content>
            </Layout>
        </Form>
    )
}

export default EditProfile