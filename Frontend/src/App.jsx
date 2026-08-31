import { useState } from 'react'
import { RegisterPage } from '../components/registerPage'
import { AppRoutes } from './routes/routes'
import { LoginPage } from '../components/loginPage'
function App() {


  return (
    <div>
    <header className="w-full bg-white shadow-sm px-8 py-6">
    <div className='flex justify-end items-center'>
    <nav className='flex items-center gap-7'>
        <a className='whitespace no-wrap hover:no-underline font-medium rounded-[8px] text-sm text-[#333] hover:bg-[#5E5E5E] transition duration-150 ease-in-out flex items-center p-[10px] relative' href='/login'>
          Login
          </a>
          <a className='whitespace no-wrap hover:no-underline font-medium rounded-[8px] text-sm text-[#333] hover:bg-[#5E5E5E] transition duration-150 ease-in-out flex items-center p-[10px] relative' href='/'>
            Sign Up
            </a>
            <a className='whitespace no-wrap hover:no-underline font-medium rounded-[8px] text-sm text-[#333] hover:bg-[#5E5E5E] transition duration-150 ease-in-out flex items-center p-[10px] relative' href='/logout'>
              Logout
            </a>
            <a
                href="/system-login"
                className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
                Admin Login
            </a>
            </nav>
            </div>
    </header>
    <div className='flex items-center justify-between mb-8'>
    <h1 className='flex items-center text-lg text-gray-900'>Welcome to Banking transaction system</h1>
    </div>
    <AppRoutes />
    </div>
   
  )
}

export default App
