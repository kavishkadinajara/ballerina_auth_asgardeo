'use client';
import Link from 'next/link'
export default function LoginPage() {
    return (
        <main
            className=''>
            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
                <div className="w-full p-6 bg-black rounded-md shadow-md lg:max-w-xl">
                    <Link href="/">
                    <h1 className="text-3xl font-bold text-center text-yellow-400">
                        <span className="text-yellow-500">Village</span>-<span className="text-yellow-300">Vision</span>
                    </h1> 
                    </Link>
                    <form className="mt-10" onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-yellow-200">
                                User Name (Living Home Number)
                            </label>
                            <input
                                type="text"
                                name="userName" 
                                id='userName'
                                placeholder="195/2B"
                                className="block w-full px-4 py-2 mt-2 text-yellow-900 bg-white border rounded-md focus:border-yellow-400 focus:ring-yellow-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />

                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-yellow-200">
                                Password
                            </label>
                            <input
                                type="password"
                                name='password'
                                id='password'
                                placeholder="********"
                                className="block w-full px-4 py-2 mt-2 text-yellow-900 bg-white border rounded-md focus:border-yellow-400 focus:ring-yellow-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />

                        </div>
                        <Link href="/forget" className="text-xs text-yellow-200 hover:underline">
                        Forget Password?
                        </Link>
                        <div className="mt-2">
                            <button
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:bg-yellow-700">
                                Login
                            </button>
                        </div>
                    </form>

                     {/* Display login status and message */}
                    {loginStatus !== null && (
                        <div className={`mt-4 text-sm text-center ${loginStatus ? 'text-yellow-600' : 'text-red-600'}`}>
                            {loginMessage}
                        </div>
                    )} 


                    <p className="mt-4 text-sm text-center text-gray-700">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-medium text-yellow-600 hover:underline">
                        Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}