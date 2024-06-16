'use client'
import { createClient } from "@supabase/supabase-js";
import { useUrl } from "nextjs-current-url";
import { useEffect, useState } from "react";

function ResetP() {
  const { href: currentUrl, pathname } = useUrl() ?? {};
  const url = currentUrl?.replace(`${process.env.NEXT_PUBLIC_URL}/#`, '')
  const [isLoading, setIsloading] = useState(false)

  const [password, SetPassword] = useState('')
  const [rePass, setRePass] = useState('')
  var urlParams = new URLSearchParams(url);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  async function updateUser(user) {
    const { error } = await supabase.auth.updateUser({
      email: user.email,
      password: password
    })
    console.log('error update user', error);
    if (error) return false
    return true
  }

  async function updateProfiles(user) {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      date_change: new Date()
    })
    console.log('error update profile', error);
    if (error) return false
    return true
  }

  async function updatePassword() {
    setIsloading(true)
    if (password !== rePass) {
      window.alert('Different between 2 passwords')
      return
    }
    const { data: { user }, error } = await supabase.auth.getUser(urlParams.get('access_token'))
    console.log(user);
    if (!user) {
      window.alert('Link has expired')
      setIsloading(false)
      return
    }

    const resultUpdateUser = await updateUser(user)
    const resultUpdateProfiles = await updateProfiles(user)

    if (!error || !resultUpdateUser || !resultUpdateProfiles) {
      console.log(error);
      return
    }
    setIsloading(false)
    window.alert('finish')

    return
  }

  useEffect(()=>{},[isLoading])


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={updatePassword} method="POST">
          <div className="mb-10">
            <label htmlFor="email" className="block mb-5 text-sm  font-medium leading-6 text-[200%]">
              Password
            </label>
            <div className="mt-2">
              <input
                disabled={isLoading}
                id="password"
                name="password"
                type="password"
                onChange={(event) => SetPassword(event.target.value)}
                required
                className="block w-full h-16 border-0 py-1.5  shadow-sm ring-1 ring-inset bg-transparent px-5 rounded-full ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block mb-5 text-sm  font-medium leading-6 text-[200%]">
                Re-enter Password
              </label>

            </div>
            <div className="mt-2">
              <input
                disabled={isLoading}
                id="rePassword"
                name="rePassword"
                type="password"
                onChange={(event) => {
                  setRePass(event.target.value)
                }}
                required
                className="block w-full h-16 border-0 py-1.5  shadow-sm ring-1 ring-inset bg-transparent px-5 rounded-full ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? 'bg-gray-600' : ''} flex w-full justify-center h-13 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {isLoading ? 'Loading...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetP;

