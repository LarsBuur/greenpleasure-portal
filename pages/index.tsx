import Link from 'next/link'
import Layout from '../components/Layout'

import { useAuth0 } from '../utils/auth0-spa'


const IndexPage = () => {

  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()


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

        {isAuthenticated && (
          <div>
            <p>{user && user.nickname}</p>
            <textarea>{JSON.stringify(user)}</textarea>
            <button onClick={() => logout()}>Log out</button>
          </div>
        )}
</div>


    </Layout>
  )

}


export default IndexPage
