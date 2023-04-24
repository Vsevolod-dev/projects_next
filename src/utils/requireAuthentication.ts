import { getSession } from "next-auth/react"

export const requireAuthetication = async (context, cb) => {
    const session = await getSession(context)
    console.log(session, 123);
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    return cb()
}