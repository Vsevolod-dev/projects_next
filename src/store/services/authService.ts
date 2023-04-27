import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_HOST,
        mode: 'cors'
    }),
    endpoints: (build) => ({
        profileInfo: build.query<any, string>({
            query: (token) => ({
                url: '/profile',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }),
    })
})

export const {useProfileInfoQuery} = authApi