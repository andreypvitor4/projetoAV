import '../styles/global.css'
import '../styles/adm/style.css'
import { FullLayout, EmptyLayout } from '../components/layout'
import { AuthProvider } from '../contexts/authContext'
import LoginAuth from '../components/loginAuth'

function MyApp({ Component, pageProps }) {
  const Layout = Component.noLayout ? EmptyLayout : FullLayout
  const LoginAuthComponent = Component.noAuthNeeded ? EmptyLayout : LoginAuth
  
  return (
    <AuthProvider>
      <Layout>
        <LoginAuthComponent>
          <Component {...pageProps} />
        </LoginAuthComponent>
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
