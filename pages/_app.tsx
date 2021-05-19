import * as React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { Auth0Provider } from '../utils/auth0-spa'
import '../styles/globals.css'
export default class MyApp extends App {
    render() {
        const { Component, pageProps, router } = this.props

        const onRedirectCallback = (appState: any) => {
            router.push(appState && appState.targetUrl ? appState.targetUrl : '/')
        }

        const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '';
        const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '';
        const hostUrl = process.env.NEXT_PUBLIC_HOST_URL ?? '';

        return (
            <React.Fragment>
                <Head>
                    <title>My App</title>
                </Head>
                <Auth0Provider
                    domain={domain}
                    clientId={clientId}
                    redirectUri={hostUrl + '/callback' }
                    onRedirectCallback={onRedirectCallback}
                >
                    <Component {...pageProps} router={router} />
                </Auth0Provider>
            </React.Fragment>
        )
    }
}