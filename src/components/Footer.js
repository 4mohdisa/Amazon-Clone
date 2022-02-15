import React from 'react';
import Image from 'next/image'
function Footer() {
    return (
        <div className="flex flex-col">
            <div className="text-sm p-3 w-full flex justify-center bg-amazon_blue-blue hover:bg-amazon_blue-light cursor-pointer">
                <p className="cursor-pointer text-gray-300">Back To top</p>
            </div>
            <div className="border-b border-gray-600  max-w-full flex flex-col md:flex-row md:justify-around bg-amazon_blue text-white h-full pb-5">
                <div className="ml-5">
                    <h1 className="mt-6 mb-3 font-bold text-base">Get to Know Us</h1>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="footer-links">About Us</p>
                        <p className="footer-links">Careers</p>
                        <p className="footer-links">Press Releases</p>
                        <p className="footer-links">Amazon Cares</p>
                        <p className="footer-links">Gift a Smile</p>
                    </div>
                </div>
                <div className="ml-5">
                <h1 className="mt-6 mb-3 font-bold text-base">Contact With Us</h1>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="footer-links">Facebook</p>
                        <p className="footer-links">Twitter</p>
                        <p className="footer-links">Instagram</p>
                    </div>
                </div>
                <div className="ml-5">
                <h1 className="mt-6 mb-3 font-bold text-base">Make Money with Us</h1>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="footer-links">Sell On Amazon</p>
                        <p className="footer-links">Sell under Amazon Acceleration</p>
                        <p className="footer-links">Amazon Global Selling</p>
                        <p className="footer-links">Become an Affiliate</p>
                        <p className="footer-links">Fulfilment By Amazon</p>
                        <p className="footer-links">Advertise Your Product</p>
                        <p className="footer-links">Amazon Pay on Merchants</p>
                    </div>
                </div>
                <div className="ml-5">
                <h1 className="mt-6 mb-3 font-bold text-base">Let Us Help You</h1>
                    <div className="text-sm leading-snug mt-2 text-gray-300">
                        <p className="footer-links">COVID-19 and Amazon</p>
                        <p className="footer-links">Your Account</p>
                        <p className="footer-links">Return Center</p>
                        <p className="footer-links">100% Purchase Protection</p>
                        <p className="footer-links">Amazon App Download</p>
                        <p className="footer-links">Amazon Assistant Download</p>
                        <p className="footer-links">Help</p>
                    </div>
                </div>
            </div>
            <div className="flex text-sm p-3 space-x-3 w-full lg:justify-around  bg-amazon_blue">
            <div className="absolute">          
             <Image
             src="https://links.papareact.com/f90"
             width={80}
             height={40}
             objectFit='contain'
             className='cursor-pointer'
             />
             </div>
             <div className="flex mt-10 flex-col md:flex-row md:justify-start">
                        <p className="footer-links mr-3">Australia</p>
                        <p className="footer-links mr-3">Brazil</p>
                        <p className="footer-links mr-3">Canada</p>
                        <p className="footer-links mr-3">China</p>
                        <p className="footer-links mr-3">France</p>
                        <p className="footer-links mr-3">Germany</p>
                        <p className="footer-links mr-3">Japan</p>
                        <p className="footer-links mr-3">Mexico </p>
                        </div>
            </div>
            <div className="flex text-sm p-3 space-x-3 w-full justify-center bg-amazon_blue">
                <p className="flex text-gray-300">Made with ♥ by</p>
                <h1 className="link text-gray-300 font-bold"> <a href="http://isa-codes.co/" target="_blank">Xcoder</a> </h1>
            </div>
        </div>
    )
}

export default Footer;
