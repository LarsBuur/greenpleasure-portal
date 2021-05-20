import * as React from 'react'
import { useAuth0 } from '../utils/auth0-spa'

const Profile = () => {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

    if (!isAuthenticated) {
        return (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <a href="#" className="flex-shrink-0 group block">
                    <div className="flex items-center">
                        <div>
                            <div><button onClick={() => loginWithRedirect({})}>Log in</button></div>
                        </div>
                    </div>
                </a>
            </div>
        )
    }

    return (
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 group block">
                <div className="flex items-center">
                    <div>
                        <img
                            className="inline-block h-10 w-10 rounded-full"
                            src={user.picture}
                            alt=""
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{user.nickname}</p>
                        <button className="text-sm font-medium text-gray-500 group-hover:text-gray-700" onClick={() => logout()}>Log out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

{/* 
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <a href="#" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                    <div>
                        <img
                            className="inline-block h-9 w-9 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tom Cook</p>
                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                    </div>
                </div>
            </a>
        </div>
*/}

export default Profile;
