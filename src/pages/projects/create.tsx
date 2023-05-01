import { Image, Project, Tag } from "@/types"
import { Button, Form, Input, Select } from "antd"
import axios from "axios"
import { FC, useMemo, useState } from "react"
import "dropzone/src/dropzone.scss"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"
import styles from "@/styles/Projects.module.scss"
import { requireAuthetication } from "@/utils/requireAuthentication";
import { useDropzone } from "react-dropzone";
import baseStyle from "@/utils/dropzoneStyles";
import SortableImageList from "@/components/SortableImageList";

const {TextArea} = Input

export const getServerSideProps = async (context) => {
    return requireAuthetication(context, async () => {
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
    })
}

type ProjectCreateType = {
    tags: Tag[]
}
interface ResponseCreating {
    message: string
    project: Project
}

const ProjectCreate: FC<ProjectCreateType> = ({tags}) => {
    const [form] = Form.useForm()
    const router = useRouter()
    const [files, setFiles] = useState<Image[]>([]);

    const onFinish = async (values) => {
        values.images = files.map(image => image.path)

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
            <Form.Item label="Название проекта" name={"title"}>
                <Input/>
            </Form.Item>

            <Form.Item label="Описание" name={"description"}>
                <TextArea autoSize={{ minRows: 3 }} />
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

            <div {...getRootProps({style, className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Для загрузки файлов переташите их в данную область, или кликните по ней</p>
                <aside className={styles.thumbsContainer}>
                    <SortableImageList files={files} setFiles={setFiles}/>
                </aside>
            </div>

            <Button type="primary" htmlType="submit" className={styles.submit}>
                    Сохранить
            </Button>
        </Form>
    )
}

export default ProjectCreate