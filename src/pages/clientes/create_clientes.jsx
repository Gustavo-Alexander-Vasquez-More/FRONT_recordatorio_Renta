import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import {uploadFoto} from '../../firebase/images.js'
import Swal from 'sweetalert2';

export default function create_clientes() {
  const notyf = new Notyf({
    position: {
      x: 'center',
      y: 'top',
    },
    duration:3500
  });

const [usuario, setUsuario]=useState()
const [foto_ine_delantero, setFoto_ine_delantero]=useState()
const [foto_ine_trasero, setFoto_ine_trasero]=useState()
const [telefono, setTelefono]=useState()

const input_foto_ine_delantero=useRef()
const input_foto_ine_trasero=useRef()
const input_telefono=useRef()
const input_usuario=useRef()


const capture_ususario = () => {
setUsuario(input_usuario.current.value.trim())
}
const capture_telefono = () => {
setTelefono(input_telefono.current.value)
}
function captureFoto_delantera(event){
  setFoto_ine_delantero(event.target.files)
}
function captureFoto_trasera(event){
  setFoto_ine_trasero(event.target.files)
}

async function create_clientes() {
  Swal.fire({
    title: 'Cargando, por favor espere...',
    didOpen: () => {
      Swal.showLoading();  // Mostrar el spinner de carga
    }
  });
  const fotoURL_1 = await uploadFoto(foto_ine_delantero[0]);
  const fotoURL_2 = await uploadFoto(foto_ine_trasero[0]);
  const datos={
    nombre:usuario,
    telefono:telefono,
    foto_ine_delantero:fotoURL_1 || '',
    foto_ine_trasero:fotoURL_2 || '',
  }

  try {
    await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/clients/create`, datos);
    Swal.close()
    notyf.success('El cliente se ha registrado en la base de datos');
    setTimeout(() => {
      window.location.reload();
  }, 1000);
  } catch (error) {
    Swal.close()
    notyf.error('Este cliente ya existe en la base de datos, genera uno nuevo o selecciona uno ya existente');
    setInfo_registro('error')
  }
}
  return (
    <>
       <Navbar/>
       
       <div className='w-full h-full flex'>
       
       <div className='w-full flex justify-center items-center bg-[#EBEBEB] relative  h-[89vh]'>
             
           <div className='bg-[white] w-[90%] lg:w-[35%] rounded-[10px] items-center flex flex-col  px-[1.5rem] py-[1rem]'>
          
               <div class="mb-3 w-full">
                   <label for="exampleInputPassword1" class="form-label">Nombre de usuario</label>
                   <input ref={input_usuario} onChange={capture_ususario} type="text" class="form-control" id="exampleInputPassword1"/>
               </div>
               <div className="mb-3 w-full ">
                       <label  className="form-label">Telefono</label>
                       <div className='relative flex  items-center'>
                           <input ref={input_telefono} onChange={capture_telefono}
                           type='text' 
                           className="form-control " 
                            
                       />
                       </div>
                   </div>
               <div class="mb-3 w-full">
                   <label for="exampleInputPassword1" class="form-label">Foto del INE Delantero)</label>
                   <input type="file" ref={input_foto_ine_delantero} onChange={captureFoto_delantera} class="form-control" id="exampleInputPassword1"/>
               </div>
               <div class="mb-3 w-full">
                   <label for="exampleInputPassword1" class="form-label">Foto del INE Delantero)</label>
                   <input type="file" ref={input_foto_ine_trasero} onChange={captureFoto_trasera} class="form-control" id="exampleInputPassword1"/>
               </div>
             
               <div className="flex justify-center items-center w-full pt-[1rem]">
                   <button onClick={create_clientes} className='bg-[#0D6EFD] font-semibold text-white px-[2rem] py-[0.5rem] rounded-[10px] hover:bg-[#0d89fd]'>Crear usuario</button>
               </div>
           </div>
       </div>
       </div>
       </>
  );
}
