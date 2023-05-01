export interface Image {
    id: number
    name: string
    path: string
    size: number
}

interface Tag {
    id: number
    title: string
}

interface User {
    id: number
    name: string
    email: string
    job?: string
}
export interface Project {
    id: number
    title: string
    description: string
    url: string
    userId: number
    user_id: number
    image: string
    images?: Image[]
    tags: Tag[]
    user?: User
}

export interface Profile {
    id?: number
    email: string
    github?: string
    instagram?: string
    job?: string
    name?: string
    password?: string
    phone?: string
    telegram?: string
    phonePrefix?: string
}

type ProfileComponentType = {
    profile: Profile
    owner: boolean
}