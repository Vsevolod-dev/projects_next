import axios from "axios";
import React, {FC, useState} from "react";
import {Project, Tag} from "@/types";
import {Card, Input, Select} from 'antd';
import styles from "@/styles/Projects.module.scss"
import {useRouter} from "next/router";
import Image from "next/image";
import { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

const {Meta} = Card;

export const getServerSideProps = async () => {
    try {
        const {data: projects}: { data: Project[] } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects`)
        const {data: tags} = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects/tags`)
        return {
            props: {
                projects,
                tags
            }
        }
    } catch (e) {
        console.log(e)
        return {
            props: {
                projects: null
            }
        }
    }
}

const Projects: FC = ({projects, tags}: { projects: Project[], tags: Tag[] }) => {
    const [localProjects, setLocalProjects] = useState<Project[]>(projects)
    const router = useRouter()

    const [search, setSearch] = useState('')
    const debouncedSearch: string = useDebounce<string>(search, 500);

    const [selectedTags, setSelectedTags] = useState()
    const debouncedSelectedTags: string = useDebounce<string>(selectedTags, 500);

    const selectAfter = (
        <Select 
            value={selectedTags} 
            onChange={setSelectedTags} 
            style={{width: 175}}
            mode="multiple"
            allowClear
            placeholder="Выберите тэг"
            maxTagCount='responsive'
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            options={
                tags ? tags.map(tag => ({
                    label: tag.title,
                    value: tag.id
                })) : []
            }
        />
    )

    const goToCard = (id: number) => {
        router.push(`/projects/${id}`)
    }

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        const fetchProjects = async () => {
            const {data}: { data: Project[] } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects`, {
                params: {
                    title: debouncedSearch,
                    description: debouncedSearch,
                    url: debouncedSearch,
                    tags: debouncedSelectedTags
                }
            })
            setLocalProjects(data)
        }
        fetchProjects()
    }, [debouncedSearch, debouncedSelectedTags])

    return (
        <>
            <h1>Проекты</h1>
            <div className={styles.projects__container}>
                <Input placeholder={"Введите имя проекта"} value={search} onChange={searchHandler} addonAfter={selectAfter}/>
                {localProjects && localProjects.map(project =>
                    <Card
                        key={project.id}
                        style={{width: 300}}
                        cover={
                            <Image
                                alt="example"
                                width={300}
                                height={200}
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