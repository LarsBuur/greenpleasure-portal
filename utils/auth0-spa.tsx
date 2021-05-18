//@ts-ignore: Object is possibly 'null'.
import * as React from 'react'
import createAuth0Client, { User } from '@auth0/auth0-spa-js'
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client"
import { useRouter } from 'next/router'
import { NextPage } from 'next'

const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname)

interface Auth0ProviderProps {
    children: React.ReactNode
    onRedirectCallback: (arg0: any) => any
    domain: string
    clientId: string
    redirectUri: string
}

interface Auth0ContextProps {
    isAuthenticated: boolean
    user: Partial<User>
    loading: boolean
    popupOpen: boolean
    loginWithPopup: (arg0: any) => any
    handleRedirectCallback: (arg0: any) => any
    getIdTokenClaims: (arg0: any) => any
    loginWithRedirect: (arg0: any) => any
    getTokenSilently: (arg0: any) => any
    getTokenWithPopup: (arg0: any) => any
    logout: () => any
}

export const Auth0Context = React.createContext<Auth0ContextProps>({
    isAuthenticated: false, user: {}, loading: false, popupOpen: false, 
    loginWithPopup: ()=>{}, 
    handleRedirectCallback: ()=>{},
    getIdTokenClaims: () => { },
    loginWithRedirect: () => { },
    getTokenSilently: () => { },
    getTokenWithPopup: () => { },
    logout: () => { },
})
export const useAuth0 = () => React.useContext(Auth0Context)

export const Auth0Provider: React.FunctionComponent<Auth0ProviderProps> = ({
    children,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    domain,
    clientId,
    redirectUri
}) => {
    console.log(`domain: ${domain} clientId: ${clientId} redirectUri: ${redirectUri}`)
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)
    const [user, setUser] = React.useState<Partial<User>>({name: 'not logged in'})
    const [auth0Client, setAuth0] = React.useState<Auth0Client | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [popupOpen, setPopupOpen] = React.useState(false)

    React.useEffect(() => {
        const initAuth0 = async () => {
            const auth0FromHook = await createAuth0Client({
                domain,
                client_id: clientId,
                redirect_uri: redirectUri
            })

            if (auth0FromHook) {
                console.log(`auth0fromhook: ${JSON.stringify(auth0FromHook)}`)
                setAuth0(auth0FromHook)
            }

            if (window.location.search.includes('code=')) {
                const { appState } = await auth0FromHook.handleRedirectCallback()
                onRedirectCallback(appState)
            }

            if (auth0FromHook) {
                const isAuthenticated = await auth0FromHook.isAuthenticated()

                setIsAuthenticated(isAuthenticated)

                if (isAuthenticated) {
                    const user = await auth0FromHook.getUser();
                    if (user) {
                        setUser(user)
                    }

                }

            }

            setLoading(false)
        }

        initAuth0()
    }, [])

    const loginWithPopup = async (params = {}) => {
        setPopupOpen(true)
        try {
            if (auth0Client) {
                await auth0Client.loginWithPopup(params)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setPopupOpen(false)
        }
        //@ts-ignore: Object is possibly 'null'.
        if (auth0Client) {
            const user = await auth0Client.getUser()
            if (user) {
                setUser(user)
                setIsAuthenticated(true)
            }

        }


    }

    const handleRedirectCallback = async () => {
        if (auth0Client) {
            setLoading(true)
            await auth0Client.handleRedirectCallback()
            const user = await auth0Client.getUser()
            setLoading(false)
            if (user) {
                setIsAuthenticated(true)
                setUser(user)
            }
        }
    }

    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                getIdTokenClaims: (...p) => auth0Client ? auth0Client.getIdTokenClaims(...p) : () => { },
                loginWithRedirect: (...p) => auth0Client ? auth0Client.loginWithRedirect(...p) : () => { },
                getTokenSilently: (...p) => auth0Client ? auth0Client.getTokenSilently(...p) : () => { },
                getTokenWithPopup: (...p) => auth0Client ? auth0Client.getTokenWithPopup(...p) : () => { },
                logout: (...p) => auth0Client ? auth0Client.logout(...p) : () => { }
            }
            }
        >
            { children}
        </Auth0Context.Provider >
    )
}


export const requireUser = (
    page: NextPage
): React.FunctionComponent<NextPage> => {
    return (props: any) => {
        const router = useRouter()
        const { loading, isAuthenticated, loginWithRedirect } = useAuth0()

        React.useEffect(() => {
            if (loading || isAuthenticated) {
                return
            }

            const fn = async () => {
                await loginWithRedirect({
                    appState: { targetUrl: router.asPath }
                })
            }
            fn()
        }, [loading, isAuthenticated, loginWithRedirect, router.pathname])

        if (loading || !isAuthenticated) {
            return null
        }

        return React.createElement(page, props)
    }
}