'use client';

import React, { useState } from 'react';
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const payload = { username: name, password };

    try {
      const res = await fetch('http://localhost:9090/store/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to register');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = await res.json();
      alert("Registration successful!");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <main className='min-h-screen'>
      <div className="relative flex justify-center py-16">
        <div style={{ minWidth: "40%" }}>
          <div className="flex shadow-lg flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-black">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Link href="/">
                <h1 className="text-3xl font-bold text-center text-yellow-400">
                  <span className="text-yellow-500">Village</span>-<span className="text-yellow-300">Vision</span>
                </h1>
              </Link>
              <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-yellow-200">
                Create a new account
              </h2>
              <h4 className='mt-6 text-red-300'>
                &quot;Only one account should be created per household, using the home number as the username.&quot;
              </h4>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-md font-medium leading-6 text-yellow-200">
                    Living Home Number (As User Name)
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      autoComplete="name"
                      required
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-black shadow-sm ring-1 ring-inset ring-yellow-400 placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-md font-medium leading-6 text-yellow-200">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-yellow-400 placeholder:text-black px-2 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="confirmpassword" className="block text-sm font-medium leading-6 text-yellow-200">
                      Confirm Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="confirmpassword"
                      name="confirmpassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-yellow-400 px-2 placeholder:text-yellow-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {errorMessage && <p className='text-red-200 text-sm'>{errorMessage}</p>}
                <div className=''>
                  <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-700">
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href={'/login'}>
                  <span className="font-medium text-yellow-600 hover:underline cursor-pointer">
                    Sign In
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
