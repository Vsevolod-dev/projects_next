import axios from "axios";
import cookie from "cookie"
import {ProfileComponentType} from "@/types"
import {FC} from "react";
import { Layout } from "antd";
import {Avatar} from "antd";
import styles from "@/styles/Profile.module.scss"
import { EditOutlined, GithubOutlined, InstagramOutlined } from "@ant-design/icons";
import Image from 'next/image'
import { useRouter } from "next/router";
import { requireAuthetication } from "@/utils/requireAuthentication";


export const getServerSideProps = async (context) => {
    return requireAuthetication(context, async () => {
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
                    profile: res.data,
                    owner: res.headers.user_by_token == res.data.id
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
    })
}

const Profile: FC<ProfileComponentType> = ({profile, owner}) => {
    const router = useRouter()

    return (
        <Layout className={styles.profile__wrapper}>
            <div className={styles.profile__sider}>
                <Avatar 
                    src={'https://xsgames.co/randomusers/avatar.php?g=pixel'} 
                    size={70}
                    className={styles.profile__avatar}
                />
                <h3>{profile.name}</h3>
                <p>{profile.job}</p>
                {owner && <EditOutlined className={styles.icon + " " + styles.icon__edit} onClick={() => router.push('/profile/edit')}/>}
            </div>
            <div className={styles.profile__content}>
                <h3>Информация</h3>
                <hr />
                <div className={styles.profile__info}>
                    <div className={styles.info__email}><strong>Email</strong> {profile.email}</div>
                    {profile.phone && <div className={styles.info__phone}><strong>Phone</strong> {profile.phone}</div>}
                </div>
                <div className={styles.icons__row}>
                    {profile.github && <a href={profile.github.includes('http') ? profile.github : ('https://' + profile.github)} className={styles.link} target="_blank"><GithubOutlined className={styles.icon} href="vk.com"/></a>}
                    {profile.instagram && <a href={profile.instagram.includes('http') ? profile.instagram : ('https://' + profile.instagram)} className={styles.link} target="_blank"><InstagramOutlined className={styles.icon}/></a>}
                    {profile.telegram && <a href={profile.telegram.includes('http') ? profile.telegram : ('https://' + profile.telegram)} className={styles.link} target="_blank"><Image className={styles.icon} src="/telegram-50.svg" alt="telegram" width={26} height={26}/></a>}
                </div>
            </div>
        </Layout>
    )
}

export default Profile