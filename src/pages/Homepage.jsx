import React, { useState } from 'react';
import Navbar from '../components/navbar';
import background from '../images/background_index.jpg'
export default function Homepage() {

  return (
    <>
    <div className='w-full flex flex-col'>
    <Navbar/>
    <div className='w-full h-[89.2vh] bg-cover bg-no-repeat' style={{ backgroundImage: `url(${background})`}}></div>
    </div>
    </>
  );
}
