import { FC } from "react"
import Profile from "."
import cookie from "cookie"
import axios from "axios"
import { ProfileComponentType } from "@/types"

export const getServerSideProps = async (context) => {
    let token = ''
    const profileId = context.params.id

    if (context.req.headers.cookie) {
        token = cookie.parse(context.req.headers.cookie).token
    }

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/profile/${profileId}`, {
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
}

const UserProfile: FC<ProfileComponentType> = ({profile, owner}) => {
    return (
        <Profile profile={profile} owner={owner}/>
    )
}

export default UserProfile