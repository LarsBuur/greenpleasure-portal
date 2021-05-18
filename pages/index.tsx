import Link from 'next/link'
import Layout from '../components/Layout'
import { useAuth0 } from '../utils/auth0-spa'

const IndexPage = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, loading } = useAuth0()

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>

      <div>
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect({})}>Log in</button>
        )}

        {isAuthenticated && user && (
          <div>
            <p>{user && user.nickname}</p>
            <textarea defaultValue={JSON.stringify(user)}></textarea>
            <img src={user && user.picture} />
            <button onClick={() => logout()}>Log out</button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default IndexPage