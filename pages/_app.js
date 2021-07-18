import '../styles/global.css'
import '../styles/login/style.css'
import '../styles/home/style.css'
import '../styles/createRoute/style.css'
import '../styles/useRoute/style.css'
import '../styles/newPointForm/style.css'
import '../styles/points/style.css'
import '../styles/footer/style.css'
import '../styles/header/style.css'
import '../styles/account/style.css'
import '../styles/routes/style.css'
import '../styles/manageRoutes/style.css'
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
