import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import {uploadFoto} from "../../firebase/images.js"
export default function editar_clientes({_id, closeModal ,gett}) {
    console.log(_id);
const [nombre, setNombre]=useState()
console.log(nombre);
const [telefono, setTelefono]=useState()
const [loading, setLoading]=useState()
const [datas, setDatas]=useState()
const [foto_ine_delantero, setFoto_ine_delantero]=useState()
const [foto_ine_trasero, setFoto_ine_trasero]=useState()
const [edit_nombre, setEdit_nombre ]=useState(false)
const [edit_telefono, setEdit_telefono ]=useState(false)
const [modal_change_foto_delantero, setModal_change_foto_delantero]=useState(false)
const [modal_change_foto_trasero, setModal_change_foto_trasero]=useState(false)
const [foto_temporal_delantero, setFoto_temporal_delantero] = useState();
const [foto_temporal_trasero, setFoto_temporal_trasero] = useState();


const input_foto_delantero=useRef()
const input_foto_trasero=useRef()

function openModal_change_foto_delantero(){
    setModal_change_foto_delantero(true)
}
function closeModal_change_foto_delantero(){
setModal_change_foto_delantero(false)
}
function openModal_change_foto_trasero(){
    setModal_change_foto_trasero(true)
}
function closeModal_change_foto_trasero(){
setModal_change_foto_trasero(false)
}

const handleFotoChange_delantero = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto_temporal_delantero(file); // Actualiza la previsualización de la foto
    }
  };

  const handleFotoChange_trasero = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto_temporal_trasero(file); // Actualiza la previsualización de la foto
    }
  };

  async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/clients/read_especific?_id=${_id}`);
      setDatas(data.response);
      setNombre(data.response[0].nombre)
      setTelefono(data.response[0].telefono)
      setFoto_ine_delantero(data.response[0].foto_ine_delantero)
      setFoto_ine_trasero(data.response[0].foto_ine_trasero)
      setLoading(false);  // Desactivar el loader cuando los datos se han cargado
    } catch (error) {
      console.error('Error fetching image data:', error);
      setLoading(false);  // También desactivar el loader en caso de error
    }
  }

  useEffect(() => {
   get()
  }, []);

  async function editarFoto_delantero(e) {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
    const file = foto_temporal_delantero
    console.log(file);
    const foto_url=await uploadFoto(file)
console.log(foto_url);
  try {
      
        const datos={
          foto_ine_delantero:foto_url || ''
        }
        
        await axios.put(
          `https://backrecordatoriorenta-production.up.railway.app/api/clients/update/${_id}`, datos,
          { headers: { 'Content-Type': 'application/json' } }
        );
      setFoto_ine_delantero(foto_url)
        await gett()
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
     

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }

  async function editarFoto_trasero(e) {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
    const file = foto_temporal_trasero
    console.log(file);
    const foto_url=await uploadFoto(file)
console.log(foto_url);
  try {
      
        const datos={
          foto_ine_trasero:foto_url || ''
        }
        
        await axios.put(
          `https://backrecordatoriorenta-production.up.railway.app/api/clients/update/${_id}`, datos,
          { headers: { 'Content-Type': 'application/json' } }
        );
      setFoto_ine_trasero(foto_url)
        await gett()
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
     

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }


  async function editarCliente(tipo_dato,valor) {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
  
  try {
      
        const datos={
          [tipo_dato]:valor
        }
        await axios.put(
          `https://backrecordatoriorenta-production.up.railway.app/api/clients/update/${_id}`, datos,
          { headers: { 'Content-Type': 'application/json' } }
        );
      
  
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
     await gett()

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }

  return (
<>
{modal_change_foto_delantero === true && (
        <div className="w-full h-full absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
          <div className='flex flex-col items-center w-[90%] lg:w-[35%] gap-3 bg-white py-[1rem] px-[1rem]'>
            <p className=' font-semibold'>Selecciona una nueva foto</p>
            <input ref={input_foto_delantero} onChange={handleFotoChange_delantero}  class="form-control" type="file" id="formFile"/>
            <div className='flex w-full justify-between'>
            <button  onClick={editarFoto_delantero} className='bg-success text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Guardar</button>
            <button  onClick={closeModal_change_foto_delantero} className='bg-[#808080] text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {modal_change_foto_trasero === true && (
        <div className="w-full h-full absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
          <div className='flex flex-col items-center w-[90%] lg:w-[35%] gap-3 bg-white py-[1rem] px-[1rem]'>
            <p className=' font-semibold'>Selecciona una nueva foto</p>
            <input ref={input_foto_trasero} onChange={handleFotoChange_trasero}  class="form-control" type="file" id="formFile"/>
            <div className='flex w-full justify-between'>
            <button  onClick={editarFoto_trasero} className='bg-success text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Guardar</button>
            <button  onClick={closeModal_change_foto_trasero} className='bg-[#808080] text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Cancelar</button>
            </div>
          </div>
        </div>
      )}
<div className="w-full lg:h-screen absolute z-40 bg-[#d9d9d97b] flex lg:py-0 py-[1rem] justify-center items-center">
    <div className="bg-white rounded-[10px] w-[90%] lg:w-[45%] h-auto flex flex-col">
      <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid'>
        <p className='text-white font-semibold'>Crear clientes</p>
        <button onClick={closeModal}>
          <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
          </svg>
        </button>
      </div>
      
<div className='w-full flex justify-center items-center py-[1rem] bg-[#EBEBEB] relative '>
            <div className='w-full flex flex-col px-[1.5rem]'>
              <p className='font-semibold text-[1.3rem] underline pb-3'>Datos del cliente</p>
              <div className='flex flex-col'>
        
    <div className="mb-2">
    <label htmlFor="exampleInputEmail1" className="form-label">
      Nombre del cliente
    </label>
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-1">
        {/* Input deshabilitado dinámicamente */}
        <input
          placeholder="Escribe el nuevo nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          type="text"
          className={`form-control ${!edit_nombre ? 'bg-gray-200 cursor-not-allowed' : ''}`}
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          disabled={!edit_nombre} // Deshabilitado si no se está editando
        />
        {/* Botón para habilitar la edición */}
        <button
          className="flex gap-1 items-center underline"
          onClick={() => setEdit_nombre(true)}
        >
          <svg
            className="w-6 h-6 text-[#808080]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
            />
          </svg>
        </button>
      </div>
      {/* Botones de guardar/cancelar */}
      {edit_nombre && (
        <div className="flex gap-2 text-[0.8rem]">
          <button
            onClick={() => {
              // Aquí guardarías los cambios
              setEdit_nombre(false); ; editarCliente('nombre', nombre)// Deshabilitar de nuevo
            }}
            className="bg-[red] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
          >
            Guardar
          </button>
          <button
            onClick={() => {setEdit_nombre(false), setNombre(datas[0]?.nombre)}} // Cancelar y deshabilitar
            className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  </div>
  
  <div className="mb-2">
      <label htmlFor="exampleInputEmail1" className="form-label">
        WhatsApp
      </label>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex gap-1">
          {/* Input deshabilitado dinámicamente */}
          <input
            placeholder="Escribe el nuevo precio"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            type="text"
            className={`form-control ${
              !edit_telefono ? 'bg-gray-200 cursor-not-allowed' : ''
            }`}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            disabled={!edit_telefono} // Deshabilitado si no se está editando
          />
          {/* Botón para habilitar la edición */}
          <button
            className="flex gap-1 items-center underline"
            onClick={() => setEdit_telefono(true)}
          >
            <svg
              className="w-6 h-6 text-[#808080]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
          </button>
        </div>
        {/* Botones de guardar/cancelar */}
        {edit_telefono && (
          <div className="flex gap-2 text-[0.8rem]">
            <button
              onClick={() => {
                setEdit_telefono(false);
                editarCliente('telefono', telefono); // Guardar cambios
              }}
              className="bg-[red] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEdit_telefono(false);
                setTelefono(datas[0]?.telefono); // Restaurar precio original
              }}
              className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>

  <div className="mb-2">
    <label htmlFor="exampleInputEmail1" className="form-label">
      Foto del INE delantero
    </label>
    <div className=' lg:w-[60%] w-full flex justify-start'>
              <div className='w-full  gap-2 flex flex-col'>
                <img src={foto_ine_delantero} className="w-full lg:w-[45%]" />
                <button onClick={openModal_change_foto_delantero} className='flex gap-1 items-center bg-[#808080]  px-[1rem] rounded-[5px] py-[0.3rem] justify-center text-white'><svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
  </svg> Cambiar foto del INE delantero
  </button>
              </div>
            </div>
  </div>
  <div className="mb-2">
    <label htmlFor="exampleInputEmail1" className="form-label">
      Foto del INE trasero
    </label>
    <div className='lg:w-[60%] w-full flex justify-start'>
              <div className='w-full  gap-2 flex flex-col'>
                <img src={foto_ine_trasero} className="w-full lg:w-[45%]" />
                <button onClick={openModal_change_foto_delantero} className='flex gap-1 items-center bg-[#808080]  px-[1rem] rounded-[5px] py-[0.3rem] justify-center text-white'><svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
  </svg> Cambiar foto del INE trasero
  </button>
              </div>
            </div>
  </div>
              </div>
            </div>
          
</div>
</div>
      </div>
</>
  );
}
