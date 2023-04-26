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

export const getServerSideProps = async (context) => {
    try {
        const {data: tags} = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/projects/tags`)

        return {
            props: { tags }
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

type ProjectCreateType = {
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

interface ResponseCreating {
    message: string
    project: Project
}

const ProjectCreate: FC<ProjectCreateType> = ({tags}) => {
    const [form] = Form.useForm()
    const dropzoneRef = useRef<HTMLDivElement>()
    const router = useRouter()
    const [images, setImages] = useState<Image[]>([])

    const onFinish = async (values) => {
        values.images = images.map(image => image.path)

        try {
            const {data}: {data: ResponseCreating} = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/projects`, values, {
                headers: {
                    Authorization: `Bearer ${getCookie('token')}`
                }
            })
            router.push(`/projects/${data.project.id}`)
        } catch (e) {
            console.log(e);
        }
    }
    
    useEffect(() => {
        new Dropzone(dropzoneRef.current, {
            ...dropzoneOptions,
            init: function() {
                const myDropzone = this;
                // setImages(project.images)

                // //Populate any existing thumbnails
                // console.log(project.images);
                // if (project.images) {
                //     for (let i = 0; i < project.images.length; i++) {
                //         //@ts-ignore
                //         const mockFile: DropzoneFile = {
                //             name: project.images[i].name,
                //             size: project.images[i].size,
                //             type: 'image/jpeg',
                //             status: Dropzone.ADDED,
                //             accepted: true,
                //             dataURL: `${process.env.NEXT_PUBLIC_API_HOST}/image/${project.images[i].path}`
                //         };

                //         myDropzone.emit("addedfile", mockFile);
                //         myDropzone.emit("thumbnail", mockFile, `${process.env.NEXT_PUBLIC_API_HOST}/image/${project.images[i].path}`);
                //         myDropzone.emit("complete", mockFile);

                //         myDropzone.files.push(mockFile);
                //     }
                // }

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
            <Form.Item label="Название проекта" name={"title"}>
                <Input/>
            </Form.Item>

            <Form.Item label="Описание" name={"description"}>
                <Input/>
            </Form.Item>

            <Form.Item label="Тэги" name={"tags"}>
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

            <Form.Item label="Ссылка на Github" name={"url"}>
                <Input/>
            </Form.Item>

            <div id="previews" className="dropzone mt-3" ref={dropzoneRef}></div>

            <Button type="primary" htmlType="submit">
                    Сохранить
            </Button>
        </Form>
    )
}

export default ProjectCreate