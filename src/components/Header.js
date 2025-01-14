import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { MenuIcon, SearchIcon, ShoppingBagIcon, ShoppingCartIcon, LocationMarkerIcon} from "@heroicons/react/outline";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectItems} from "../slices/basketSlice";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Header() {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const items = useSelector(selectItems);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAuth = () => {
        if (user) {
            signOut(auth)
                .then(() => {
                    router.push('/auth/signin');
                })
                .catch((error) => {
                    console.error('Error signing out:', error);
                });
        } else {
            router.push('/auth/signin');
        }
    };

    return (
        <header className="">
        {/* Top Nav */}
        <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
            <div onClick={() => router.push('/')} className="mt-2 flex items-center flex-grow sm:flex-grow-0">
                <Image
                    src="https://links.papareact.com/f90"
                    width={150}
                    height={40}
                    style={{
                        objectFit: "contain"
                    }}
                    className="cursor-pointer"
                    alt="Amazon Logo"
                    priority
                />
            </div>

            {/* {search element} */}
            <div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500">
                <input type="text" className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 "/>
                <SearchIcon className="h-12 p-4" />
            </div>

            {/* Right corner of nav */}
            <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
                <div onClick={handleAuth} className="link">
                    <p>
                        {user ? `Hello, ${user.displayName || user.email}` : 'Sign In'}
                    </p>
                    <p className="font-extrabold md:text-sm">
                        {user ? 'Logout' : 'Account & Lists'}
                    </p>
                </div>

                <div className="link">
                    <p>Returns</p>
                    <p className="font-extrabold md:text-sm">& Orders</p>
                </div>

                <div onClick={() => router.push('/checkout')} className="relative flex items-center link">
                    <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
                        {items.length}
                    </span>
                    <ShoppingCartIcon className="h-10"/>   
                    <p className="hidden md:inline font-extrabold md:text-sm mt-2">Basket</p>
                </div>
            </div>
        </div>

        {/* Bottom Nav */}
        <div className="flex items-center space-x-3 p-4 pl-6 bg-amazon_blue-light text-white text-xs">
            <p className="link flex items-center">
                <MenuIcon className="h-6 mr-1" />
            </p>
            <p className="link">
                All
            </p>
            <p className="link">
                Prime Video
            </p>
            <p className="link">
                Amazon Business
            </p>
            <p className="link">
                Today's Deals
            </p>
            <p className="link hidden lg:inline-flex">
                Electronics
            </p>
            <p className="link hidden lg:inline-flex">
                Food & Grocery
            </p>
            <p className="link hidden lg:inline-flex">
                Prime
            </p>
            <p className="link hidden lg:inline-flex">
                Buy Again
            </p>
            <p className="link hidden lg:inline-flex">
                Shopping Toolkit
            </p>
            <p className="link hidden lg:inline-flex">
                Health & Personal Care
            </p>
        </div>
        </header>
    );
}

export default Header
