import cookie from "cookie"

export const requireAuthetication = async (context, cb) => {
    let token: string

    if (context.req.headers.cookie) {
        token = cookie.parse(context.req.headers.cookie).token
    }

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    return cb()
}