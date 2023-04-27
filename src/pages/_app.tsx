import Layout from '@/components/Layout'
import { wrapper } from '@/store/store'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
        <main className={'container'}>
            <Component {...pageProps} />
        </main>
    </Layout>
  )
}

export default wrapper.withRedux(App)