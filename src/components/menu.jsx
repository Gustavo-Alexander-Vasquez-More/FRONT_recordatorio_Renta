import React, { useEffect, useState } from 'react';
import logo from '../images/logo_blanco.png'
import icon_user from '../images/icon_user.png'
import box from '../images/box.png'
import icon_bolsa from '../images/icon_bolsa.png'
import axios from 'axios';

export default function Menu({closeMenu}) {
const [modal_usuarios, setModal_usuarios] = useState(false);
const [modal_productos, setModal_productos] = useState(false);
const [modal_rentas, setModal_rentas] = useState(false);
const [datas, setDatas]=useState([])
const toggleListVisibility = () => {setModal_usuarios(prev => !prev);};
const toggleListVisibility2 = () => {setModal_productos(prev => !prev);};
const toggleListVisibility3 = () => {setModal_rentas(prev => !prev);};

async function get() {
  const usuario=localStorage.getItem('usuario')
 
  try {
    const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/read_especific?usuario=${usuario}`);
    setDatas(data.response)
  } catch (error) {
    console.error('Error fetching image data:', error);
  }
}

useEffect(() => {
 get()
}, []);
  return (
  <>
   {datas.map(dat=>(
    <div className='absolute z-50 top-0 left-0 bg-[#3B5A75] w-[15%] h-screen flex flex-col'>
    <div className='w-full flex items-center bg-[#2d76b5] justify-between border-solid border-b-white border-b-[1px] h-[4.5rem] px-[1rem]'>
      <a href="/Homepage">
        <img className='w-[5rem]' src={logo} alt="" />
      </a>
      <button onClick={closeMenu}>
      <svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
</svg>

      </button>
    </div>
    <div className='w-full flex flex-col h-auto'>
      {/* Botón que abre la lista */}
      <div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
        <button 
          onClick={toggleListVisibility} 
          className='w-full h-full flex justify-between items-center'>
          <div className='flex items-center gap-3 text-white'>
            <img className='w-[2rem]' src={icon_user} alt="" />
            <p>Usuarios</p>
          </div>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </button>
      </div>

      {/* Lista desplegable */}
      {dat.rol === 1 && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${modal_usuarios ? 'h-auto' : 'h-0'}`}>
        <div className='px-[1rem] py-2'>
          <ul className='flex flex-col gap-2'>
            <a href="/create_users"><li className='text-white'>Crear usuarios</li></a>
            <a href="/delete_users"><li className='text-white'>Eliminar usuarios</li></a>
            <a href="/edit_users"><li className='text-white'>Editar usuarios</li></a>
          </ul>
        </div>
      </div>
      )}

      {/* Otro botón debajo */}
      <div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
        <button 
          onClick={toggleListVisibility2} 
          className='w-full h-full flex justify-between items-center'>
          <div className='flex items-center gap-3 text-white'>
            <img className='w-[2rem]' src={box} alt="" />
            <p>Productos</p>
          </div>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </button>
      </div>

      {/* Lista desplegable productos */}
      {dat.rol === 1 && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${modal_productos ? 'h-auto' : 'h-0'}`}>
        <div className='px-[1rem] py-2'>
          <ul className='flex flex-col gap-2'>
            <a href="/create_products"><li className='text-white'>Crear un producto</li></a>
            <a href="/delete_products"><li className='text-white'>Eliminar un producto</li></a>
            <a href="/edit_products"><li className='text-white'>Editar un producto</li></a>
            <a href="/"><li className='text-white'>Lista de productos</li></a>
          </ul>
        </div>
      </div>
      )}
{dat.rol === 2 && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${modal_productos ? 'h-auto' : 'h-0'}`}>
        <div className='px-[1rem] py-2'>
          <ul className='flex flex-col gap-2'>
            <a href="/"><li className='text-white'>Lista de productos</li></a>
          </ul>
        </div>
      </div>
      )}
       {/* Otro botón debajo */}
       <div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
        <button 
          onClick={toggleListVisibility3} 
          className='w-full h-full flex justify-between items-center'>
          <div className='flex items-center gap-3 text-white'>
            <img className='w-[2rem]' src={icon_bolsa} alt="" />
            <p>Rentas</p>
          </div>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </button>
      </div>

      {/* Lista desplegable rentas */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${modal_rentas ? 'h-auto' : 'h-0'}`}>
        <div className='px-[1rem] py-2'>
          <ul className='flex flex-col gap-2'>
            <a href="/create_renta"><li className='text-white'>Generar una renta</li></a>
            <a href="/hist_renta"><li className='text-white'>Historial de rentas</li></a>
          </ul>
        </div>
      </div>
    </div>
  </div>
   ))}
  </>
  );
}
