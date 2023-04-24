import {FC } from "react";
import axios from "axios";
import {Project} from "@/types";
import {Button, Tag } from "antd";
import SwiperComponent from "@/components/Swiper";

export const getServerSideProps = async (context) => {
    const id = context.params.id
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects/${id}`)
        // const {data: profile}: { data: Project } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/profile/${project.user_id}`)
        // console.log(profile)
        return {props: {data: null/*, profile*/}}
    } catch (e) {
        console.log(e)
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            }
        };

    }
}
const Project: FC = ({project}: {project: Project}) => {
    if (!project) return <h1>Pososi</h1>
    return (
        <>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <Button type="primary"><a href={project.url} target={"_blank"}>Ссылка на Github</a></Button>
            {project.tags &&
                <div>
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
        </>
    )
}

export default Project