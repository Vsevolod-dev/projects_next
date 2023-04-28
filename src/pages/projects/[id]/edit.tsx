import { Image, Project, Tag } from "@/types"
import { Button, Form, Input, Select } from "antd"
import axios from "axios"
import cookie from "cookie"
import { FC, useEffect, useRef, useState } from "react"
import Dropzone, { DropzoneFile } from "dropzone";
import "dropzone/src/dropzone.scss"
import { getCookie } from "cookies-next"
import dropzoneOptions from '@/utils/dropzoneOptions'
import { useRouter } from "next/router"
import styles from "@/styles/Projects.module.scss"

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

        if (!owner) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            };
        }

        const {data: tags} = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects/tags`)

        return {
            props: {
                project: res.data, 
                owner,
                tags
            }
        }
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

type ProjectEditType = {
    project: Project
    owner: boolean
    tags: Tag[]
}

interface CustomResponse {
    message: string, 
    image: {
        size: number,
        originalFilename: string,
        newFilename: string
    }
}

const ProjectEdit: FC<ProjectEditType> = ({project, tags}) => {
    const [form] = Form.useForm()
    const dropzoneRef = useRef<HTMLDivElement>()
    const router = useRouter()
    const [images, setImages] = useState<Image[]>([])

    const onFinish = async (values) => {
        values.images = images.map(image => image.path)
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/projects/${project.id}`, values, {
                headers: {
                    Authorization: `Bearer ${getCookie('token')}`
                }
            })
            router.push(`/projects/${project.id}`)
        } catch (e) {
            console.log(e);
        }
    }
    
    useEffect(() => {
        new Dropzone(dropzoneRef.current, {
            ...dropzoneOptions,
            init: function() {
                const myDropzone = this;
                setImages(project.images)

                //Populate any existing thumbnails
                console.log(project.images);
                if (project.images) {
                    for (let i = 0; i < project.images.length; i++) {
                        //@ts-ignore
                        const mockFile: DropzoneFile = {
                            name: project.images[i].name,
                            size: project.images[i].size,
                            type: 'image/jpeg',
                            status: Dropzone.ADDED,
                            accepted: true,
                            dataURL: `${process.env.NEXT_PUBLIC_API_HOST}/image/${project.images[i].path}`
                        };

                        myDropzone.emit("addedfile", mockFile);
                        myDropzone.emit("thumbnail", mockFile, `${process.env.NEXT_PUBLIC_API_HOST}/image/${project.images[i].path}`);
                        myDropzone.emit("complete", mockFile);

                        myDropzone.files.push(mockFile);
                    }
                }

                this.on("removedfile", function(file) {
                    const path = file.dataURL.split('/').pop()
                    setImages(p => p.filter(image => image.path !== path))
                });
                this.on("success", (file, response: CustomResponse) => {
                    if (response.image) {
                        setImages(p => [...p, {
                            size: response.image.size,
                            name: response.image.originalFilename,
                            path: response.image.newFilename,
                        } as Image])
                    }
                })
            }
        })
    }, [])

    useEffect(() => {
        console.log(images);
    }, [images])

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Название проекта" name={"title"} initialValue={project.title}>
                <Input/>
            </Form.Item>

            <Form.Item label="Описание" name={"description"} initialValue={project.description}>
                <Input/>
            </Form.Item>

            <Form.Item label="Тэги" name={"tags"} initialValue={project.tags.map(tag => tag.id)}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Пожалуйста выберите тэг"
                    options={tags.map(tag => {
                        return {
                            label: tag.title,
                            value: tag.id
                        }
                    })}
                />
            </Form.Item>

            <Form.Item label="Ссылка на Github" name={"url"} initialValue={project.url}>
                <Input/>
            </Form.Item>

            <div id="previews" className="dropzone mt-3" ref={dropzoneRef}></div>

            <Button type="primary" htmlType="submit" className={styles.submit}>
                    Сохранить
            </Button>
        </Form>
    )
}

export default ProjectEdit