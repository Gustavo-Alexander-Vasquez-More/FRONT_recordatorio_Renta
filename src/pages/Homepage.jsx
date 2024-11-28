import React from 'react';
import Navbar from '../components/navbar';
import Menu from '../components/menu';
export default function Homepage() {
  return (
    <>
    <Navbar/>
    <Menu/>
    <div className='w-full h-full flex'>
    <div className='w-[20%]'></div>
    <div className='w-[80%]  h-[90.3vh]'>

    </div>
    </div>
    </>
  );
}
