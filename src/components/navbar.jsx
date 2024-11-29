import React, { useEffect, useState } from 'react';
import icon_logout from '../images/icon_logout.png'
import Menu from './menu';
import axios from 'axios';
import Swal from 'sweetalert2';
export default function navbar({}) {
const [datas, setDatas]=useState([])
const [fotoBase64, setFotoBase64] = useState('');
const [menu, setMenu]=useState(false)
function openMenu(){
  setMenu(true)
}
function closeMenu(){
  setMenu(false)
}
const path=window.location.pathname.slice(1);
let path_letra=''
if(path === 'Homepage'){
  path_letra='Homepage'
}
if(path === 'create_users'){
  path_letra='Crear usuarios'
}
if(path === 'delete_users'){
  path_letra='Eliminar usuarios'
}
if(path === 'edit_users'){
  path_letra='Editar usuarios'
}

if(path === 'create_products'){
  path_letra='Crear productos'
}
if(path === 'delete_products'){
  path_letra='Eliminar productos'
}
if(path === 'edit_products'){
  path_letra='Editar productos'
}

if(path === 'create_renta'){
  path_letra='Generar rentas'
}
if(path === 'delete_renta'){
  path_letra='Eliminar rentas'
}
if(path === 'update_renta'){
  path_letra='Editar rentas'
}
if(path === 'hist_renta'){
  path_letra='Historial de rentas'
}
useEffect(() => {
 get();
  }, []);

  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [datas]);
  async function get() {
    const usuario=localStorage.getItem('usuario')
   
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/read_especific?usuario=${usuario}`);
      setDatas(data.response)
      if (data.response && data.response[0].foto) {
        setFotoBase64(data.response[0].foto); // Aquí asumimos que 'foto' contiene la cadena base64
      }
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }
  async function LogOut() {
    const token = localStorage.getItem('token');
  
    try {
      // Mostrar alerta de "Cerrando sesión, hasta pronto"
      Swal.fire({
        title: 'Cerrando sesión...',
        text: 'Hasta pronto!',
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading(); // Mostrar el indicador de carga
        }
      });
  
      // Realizar la solicitud de logout
      await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/admins/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Limpiar datos del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
  
      // Redirigir a la página de inicio después de cerrar sesión
      window.location.href = `${window.location.origin}/`;
  
      // Cerrar la alerta después de redirigir
      Swal.close();
  
    } catch (error) {
      // Cerrar la alerta si ocurre un error
      Swal.close();
      console.log('No se cerró la sesión');
    }
  }
  return (
    <>
    {menu === true && (
      <Menu closeMenu={closeMenu}/>
    )}
    {datas.map(dat=>(
      <div className='w-full bg-[#f59600] flex justify-between px-[1rem] py-[1rem] gap-5 items-center text-white font-semibold relative'>
        <button onClick={openMenu}>
        <svg class="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
</svg>

        </button>
       <div className='flex gap-4 items-center'>
       <div className=' flex gap-2'>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
          </svg>
          <p>{path_letra}</p>
        </div>
       
      <p className='flex items-center gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-person-fill-check" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
        </svg>
        {dat.usuario}
      </p>
      {dat.foto && (
        <button data-bs-toggle="tooltip" data-bs-title="Mi perfil"><img className='w-[2.5rem] h-[2.5rem] rounded-full' src={fotoBase64}/></button>
      )}
      {!dat.foto && (
        <button className='w-[2.5rem] h-[2.5rem] rounded-full bg-gray-100' data-bs-toggle="tooltip" data-bs-title="Ver perfil"><svg  xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
    </svg></button>
      )}
      <button onClick={LogOut} data-bs-toggle="tooltip" data-bs-title="Salir"><img className='w-[2rem] h-[2rem]' src={icon_logout}/></button>
       </div>
    </div>
    ))}
    </>
  );
}
