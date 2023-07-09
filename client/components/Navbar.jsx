"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {RxHamburgerMenu} from 'react-icons/rx'
import {BsSearch} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
import {MdOutlineClose} from 'react-icons/md'
import Favorites from './Favorites'
import dynamic from 'next/dynamic';
const ethers = dynamic(() => import('ethers'), {ssr: false});
// import {ethers} from 'ethers';

const Navbar = ({ onSmallScreenChange }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false)

  useEffect(() => {

    // Initial check for screen size
    setIsSmallScreen(window.innerWidth < 768); // Adjust the breakpoint as needed

    const handleResize = () => {
      const isSmall = window.innerWidth < 768
      setIsSmallScreen(isSmall); // Adjust the breakpoint as needed
      onSmallScreenChange(isSmall)
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onSmallScreenChange]);

  useEffect(() => {
    
    setShowSideBar(false)
    
  }, [isSmallScreen])
  

  const handleToggleSidebar = () => {
    if(isSmallScreen){
      setShowSideBar(!showSideBar);
    }
  };

  const [walletAddress, setWalletAddress] = useState("");

  async function requestAccount(){
    console.log('Requesting account');

    // Check if MetaMask exists:
    if(window.ethereum){
      console.log('detected');

      try{
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log(accounts);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting');
      }
    } else {
      console.log('MetaMask not detected');
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      if (ethers && ethers.providers && ethers.providers.Web3Provider) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        console.error("Ethers is not correctly initialized");
      }
    }
  }
  
  

  return (
    <>
    <div className={`fixed ${isSmallScreen ? 'top-0 w-full h-14 bg-gradient-to-r from-blue-900 to-blue-700' : 'left-0 h-screen w-56 flex flex-col justify-start'} bg-gray-800 z-10 text-white`}>

      <div className={`${isSmallScreen ? 'flex justify-between' : ''} items-center w-full h-full px-2`}>

        <Link className={`flex ${isSmallScreen ? '' : 'mt-2'} items-center`} href='/'>
          <Image src="/assets/arbitrum-logo.png" alt="Arbitrum logo"
          width={isSmallScreen ? 40 : 61} height={isSmallScreen ? 30 : 29}
          className={` ${isSmallScreen}`}/>
          <div className='ml-2 font-bold text-[15px]'>Arbitrum Analytics</div>
        </Link>
        {!isSmallScreen && (
          <>
          <button className='mt-7 mb-2 bg-gray-900 p-2 hover:scale-105 ease-in duration-300 rounded-md' onClick={connectWallet}>
            {walletAddress ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
          <div className='font-medium mx-1'>
            {walletAddress ? `${walletAddress.substring(0, 5)}...${walletAddress.substring(walletAddress.length - 4)}` : ''}
          </div>
          <div className="py-2 my-3 mx-1">
              <div className="flex font-medium mb-1">Your Watchlist</div>
              <Favorites />
          </div>
          </>
        )}
        {isSmallScreen && (
          <div className='flex'>
            <button className="rounded-lg bg-blue-600 mr-2 h-8 w-8" ><BsSearch className="m-auto"/></button>
            <button className="rounded-lg bg-blue-600 mr-2 h-8 w-8" ><FiSettings className="m-auto"/></button>
            <button className="rounded-lg bg-blue-600 mr-2 h-8 w-8" onClick={handleToggleSidebar}><RxHamburgerMenu className="m-auto"/></button>
          </div>
        )}
        
      </div>
    </div>
    {(isSmallScreen && showSideBar)&& (
      <div className="slideInUp fixed right-0 w-64 bg-gray-700 z-20 text-white h-full px-2">
        <div className="flex justify-end mb-1">
          <div onClick={handleToggleSidebar} className="mt-3 mr-3"><b><MdOutlineClose className=" scale-150 font-extrabold"/></b></div>
        </div>
        <div className='flex flex-col justify-center m-4'>
          <button className='my-2 bg-gray-900 p-2 hover:scale-105 ease-in duration-300 rounded-md' onClick={connectWallet}>
            {walletAddress ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
          <div className='font-medium mx-1 text-center'>
            {walletAddress ? `${walletAddress.substring(0, 5)}...${walletAddress.substring(walletAddress.length - 4)}` : ''}
          </div>
        </div>
        
        <div className="flex justify-center font-medium">Your Watchlist</div>
        <Favorites />
          
      </div>
    )}
    </>
  );
};

export default Navbar;
