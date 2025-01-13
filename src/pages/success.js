import React, { useEffect } from 'react'
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { CheckCircleIcon } from '@heroicons/react/solid';
import Header from '../components/Header'
import { clearBasket } from '../slices/basketSlice';

function Success() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the basket after successful purchase
    dispatch(clearBasket());
  }, [dispatch]);

  return (
    <div className="bg-gray-100 h-screen">
      <Header />

      <main className="max-w-screen-lg mx-auto"> 
       <div className="flex flex-col p-10 bg-white">
        <div className="flex items-center space-x-2 mb-5">
          <CheckCircleIcon className="text-green-500 h-10"/>
          <h1 className="text-3xl">
          Thank you, your order has been confirmed!
          </h1>
        </div>
         <p className="text-lg mb-5">
            Thank you for shopping with us. We'll send a confirmation email once your item has
            shipped. If you would like to check the status of your order(s) please press the
            link below.
         </p>
         <div className="flex flex-col space-y-4">
          <button 
          onClick={() => router.push('/orders')} className="button text-center">View my orders</button>
          <button 
          onClick={() => router.push('/')} className="button text-center">Continue Shopping</button>
         </div>
       </div>
       
      </main>
    </div>
  )
}

export default Success