import axios from "axios";
import React, {FC} from "react";
import {Project} from "@/types";
import {Avatar, Card} from 'antd';
import styles from "@/styles/Projects.module.scss"
import {useRouter} from "next/router";

const {Meta} = Card;

export const getServerSideProps = async () => {
    try {
        const {data}: { data: Project[] } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects`)
        return {props: {projects: data}}
    } catch (e) {
        console.log(e)
        return {
            props: {data: null}
        }
    }
}

const Projects: FC = ({projects}: { projects: Project[] }) => {
    const router = useRouter()
    const goToCard = (id: number) => {
        router.push(`/projects/${id}`)
    }

    return (
        <>
            <h1>Projects</h1>
            <div className={styles.projects__container}>
                {projects && projects.map(project =>
                    <Card
                        key={project.id}
                        style={{width: 300}}
                        cover={
                            <img
                                alt="example"
                                src={
                                    project.image
                                        ? process.env.NEXT_PUBLIC_API_HOST + "/image/" + project.image
                                        : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                }
                                className={styles.card__image}
                            />
                        }
                        className={styles.card}
                        onClick={() => goToCard(project.id)}
                    >
                        <Meta
                            // avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel"/>}
                            title={project.title}
                            description={project.description}
                            className={styles.card__meta}
                        />
                    </Card>
                )}
            </div>
        </>
    )
}

export default Projects