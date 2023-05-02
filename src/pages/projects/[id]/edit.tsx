import { Image, Project, Tag } from "@/types"
import { Button, Form, Input, Select } from "antd"
import axios from "axios"
import cookie from "cookie"
import { FC, useMemo, useState } from "react"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"
import styles from "@/styles/Projects.module.scss"
import {useDropzone} from 'react-dropzone';
import SortableImageList from "@/components/SortableImageList"
import baseStyle from "@/utils/dropzoneStyles"

const { TextArea } = Input;

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

const ProjectEdit: FC<ProjectEditType> = ({project, tags}) => {
    const [form] = Form.useForm()
    const router = useRouter()
    const [files, setFiles] = useState(project.images);

    const onFinish = async (values) => {
        values.images = files.map(image => image.path)

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

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
        'image/*': []
        },
        onDropAccepted: async (acceptedFiles) => {
            let file = acceptedFiles[0]
            let formData = new FormData()
            formData.append('filetoupload', file, file.name)
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/upload`, formData)

            setFiles(p => [...p, {
                name: res.data.image.originalFilename,
                path: res.data.image.newFilename,
                size: res.data.image.size
            } as Image])
        }
    });

    const style = useMemo(() => ({
        ...baseStyle
    }), []);

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Название проекта" name={"title"} initialValue={project.title}>
                <Input/>
            </Form.Item>

            <Form.Item label="Описание" name={"description"} initialValue={project.description}>
                <TextArea autoSize={{ minRows: 3 }} />
            </Form.Item>

            <Form.Item label="Тэги" name={"tags"} initialValue={project.tags.map(tag => tag.id)}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Пожалуйста выберите тэг"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
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

            <div {...getRootProps({style, className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Для загрузки файлов переташите их в данную область, или кликните по ней</p>
                <aside className={styles.thumbsContainer}>
                    <SortableImageList files={files} setFiles={setFiles}/>
                </aside>
            </div>
            
            <div className={styles.btns}>
                <Button onClick={router.back}>Назад</Button>
                <Button type="primary" htmlType="submit">
                        Сохранить
                </Button>
            </div>
        </Form>
    )
}

export default ProjectEdit