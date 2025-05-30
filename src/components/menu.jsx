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
const [modal_clientes, setModal_clientes] = useState(false);
const [datas, setDatas]=useState([])
const toggleListVisibility = () => {setModal_usuarios(prev => !prev);};
const toggleListVisibility2 = () => {setModal_productos(prev => !prev);};
const toggleListVisibility3 = () => {setModal_rentas(prev => !prev);};
const toggleListVisibility4 = () => {setModal_clientes(prev => !prev);};
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
    <div className='absolute z-50 top-0 left-0 bg-[#323B75] w-[70%] lg:w-[20%] h-screen flex flex-col'>
    <div className='w-full flex items-center bg-[#323B75] justify-between border-solid border-b-white border-b-[1px] h-[4.5rem] px-[1rem]'>
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
      {dat.rol === 1 && (
      <div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
        <a href="/users_panel" className='w-full h-full flex justify-between items-center'>
          <div className='flex items-center gap-3 text-white'>
            <img className='w-[2rem]' src={icon_user} alt="" />
            <p>Crear / editar usuarios</p>
          </div>
         
        </a>
      </div>
)}
{/* Otro botón debajo */}
<div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
        <a href="/clients_panel"
          className='w-full h-full flex justify-between items-center'>
          <div className='flex items-center gap-3 text-white'>
          <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16">
  <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"/>
</svg>
            <p>Crear / editar clientes</p>
          </div>

        </a>
      </div>
      {/* Otro botón debajo */}
      

      {/* Lista desplegable productos */}
      {dat.rol === 1 && (
        <div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
        <a href="/products_panel"
          className='w-full h-full flex justify-between items-center'>
          <div className='flex items-center gap-3 text-white'>
          <img className='w-[2rem]' src={box} alt="" />
            <p>Crear / editar equipos</p>
          </div>

        </a>
      </div>
        
      )}
     
{dat.rol === 2 && (
    <div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
    <a href="/product_list"
      className='w-full h-full flex justify-between items-center'>
      <div className='flex items-center gap-3 text-white'>
      <img className='w-[2rem]' src={box} alt="" />
        <p>Lista de equipos</p>
      </div>

    </a>
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

      {/* Apartado para Notas de Remisión (visible para todos los roles) */}
<div className='border-solid border-b-white border-b-[1px] px-[1rem] h-[10vh] flex'>
  <button
    onClick={toggleListVisibility4}
    className='w-full h-full flex justify-between items-center'
    type="button"
  >
    <div className='flex items-center gap-3 text-white'>
      {/* Puedes cambiar el SVG por otro ícono si lo deseas */}
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
        <path d="M5 7h6v1H5V7zm0 2h6v1H5V9zm0 2h4v1H5v-1z"/>
        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3-.5a.5.5 0 0 1-.5-.5V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5h-2.5A1.5 1.5 0 0 1 11 4z"/>
      </svg>
      <p>Notas de Remisión</p>
    </div>
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
    </svg>
  </button>
</div>

{/* Lista desplegable Notas de Remisión */}
<div className={`overflow-hidden transition-all duration-500 ease-in-out ${modal_clientes ? 'h-auto' : 'h-0'}`}>
  <div className='px-[1rem] py-2'>
    <ul className='flex flex-col gap-2'>
      <a href="/notas_remision"><li className='text-white'>Panel notas de remisión</li></a>
      <a href="/create_notas"><li className='text-white'>Generar notas de remisión</li></a>
    </ul>
    
  </div>
</div>
    </div>
  </div>
   ))}
  </>
  );
}
