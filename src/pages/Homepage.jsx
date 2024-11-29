import React, { useState } from 'react';
import Navbar from '../components/navbar';

export default function Homepage() {

  return (
    <>
    <div className='w-full flex flex-col'>
    <Navbar/>
    <div className='w-full h-[90vh] bg-[red]'></div>
    </div>
    </>
  );
}
