import React from 'react'
import Image from "next/image"
import { MenuIcon, SearchIcon, ShoppingBagIcon, ShoppingCartIcon, LocationMarkerIcon} from "@heroicons/react/outline";
import {signIn, signOut, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectItems} from "../slices/basketSlice";


function Header() {
    // const {session} = useSession();
    // const [ session ] = useSession();
    const { data: session} = useSession()
    const router = useRouter();
    const items = useSelector(selectItems);


    return (
        <header className="">
        {/* Top Nav */}
<div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
<div onClick={() => router.push('/')} className="mt-2 flex items-center flex-grow sm:flex-grow-0">
 

<Image
onClick={() => router.push('/')}
    src="https://links.papareact.com/f90"
    width={150}
    height={40}
    objectFit='contain'
    className='cursor-pointer'
/>
</div>


{/* {search element} */}
<div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500">
    <input type="text" className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 "/>
    <SearchIcon className=" h-12 p-4" />
</div>
{/* Right corner of nav */}
<div  className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap" >
    <div onClick={!session ? signIn : signOut} className="link ">
        <p>
        {session ? `Hello, ${session.user.name}` : 'Sign In'}
        </p>
        <p className="font-extrabold md:text-sm">{session ? `Logout ` : 'Account & Lists'}</p>

        </div>

    <div className="link">
    <p>Returns</p>
    <p className="font-extrabold md:text-sm">& Orders</p>
        </div>

    <div onClick={() => router.push('/checkout')} className=" relative flex items-center link">
    <span className='absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold'>
        {items.length}
    </span>
    <ShoppingCartIcon 
    
    className="h-10"/>   
    <p className="hidden md:inline font-extrabold md:text-sm mt-2">Basket</p>
        </div>

</div>
</div>
        {/* Top Nav */}
      

    <div className="flex items-center space-x-3 p-4 pl-6 bg-amazon_blue-light text-white text-xs">
        <p className="link flex items-center">
        <MenuIcon className='h-6 mr-1' />
            </p>
        <p className='link'>
        All
        </p>
        <p className='link'>
            Prime Video
        </p>
        <p className='link'>
        Amazon Buisness       
         </p>
        <p className='link'>
        Today's Deal       
         </p>
         <p className=' hidden lg:inline-flex link'>
            Electronics
        </p>

        <p className=' hidden lg:inline-flex link'>
            Food & Grocery
        </p>
        <p className=' hidden lg:inline-flex  link'>
            Prime
        </p>
        <p className=' hidden lg:inline-flex  link'>
            Buy Again
        </p>
        <p className=' hidden lg:inline-flex  link'>
            Shopping Toolkit
        </p>
        <p className=' hidden lg:inline-flex  link'>
            Health & Personal Care
        </p>

        
    </div>
        </header>
    )
}

export default Header
