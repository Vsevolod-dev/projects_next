import Layout from '@/components/Layout'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
        <main className={'container'}>
            <Component {...pageProps} />
        </main>
    </Layout>
  )
}
