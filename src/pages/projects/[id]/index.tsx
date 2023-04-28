import {FC, useReducer } from "react";
import axios from "axios";
import cookie from "cookie"
import {Project} from "@/types";
import {Avatar, Button, Tag } from "antd";
import SwiperComponent from "@/components/Swiper";
import Link from "next/link";
import styles from '@/styles/Projects.module.scss'
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
    const id = context.params.id
    try {
        let token = ''

        if (context.req.headers.cookie) {
            token = cookie.parse(context.req.headers.cookie).token
        }

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects/${id}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : null
            }
        })
        let owner = false
        if (
            res.headers.user_by_token && res.data.user.id && 
            res.headers.user_by_token == res.data.user.id
        ) {
            owner = true
        }

        return {
            props: {
                project: res.data,
                owner
            }
        }
    } catch (e) {
        console.log(e);
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            }
        };

    }
}

type ProjectType = {
    project: Project
    owner: boolean
}

const Project: FC<ProjectType> = ({project, owner}) => {
    const router = useRouter()

    return (
        <>
            <h1>{project.title}</h1>
            <p className={styles.project__description}>{project.description}</p>
            <Button className={styles.btn__github} type="primary"><a href={project.url.includes('http') ? project.url : `https://${project.url}`} target={"_blank"}>Ссылка на Github</a></Button>
            {project.tags &&
                <div className={styles.tags}>
                    <h2>Теги</h2>
                    {project.tags.map(tag => <Tag key={tag.id}>{tag.title}</Tag>)}
                </div>
            }
            {project.images &&
                <>
                    <h2>Скриншоты</h2>
                    <SwiperComponent images={project.images} />
                </>
            }
            <h3 className={styles.author__title}>Автор</h3>
            <Link href={`/profile/${project.user.id}`} className={styles.author__link}>
                <Avatar 
                    src={'https://xsgames.co/randomusers/avatar.php?g=pixel'} 
                    size={70}
                    className={styles.author__avatar}
                />
                <div className={styles.author__info}>
                    <div>{project.user.name} | {project.user.email}</div>
                    <div>{project.user.job}</div>
                </div>
            </Link>
            <div className={styles.btns}>
                <Button onClick={router.back}>Назад</Button>
                {owner && 
                <Button type={"primary"} onClick={() => router.push(`/projects/${project.id}/edit`)}>
                    Редактировать
                </Button>}
            </div>
        </>
    )
}

export default Project