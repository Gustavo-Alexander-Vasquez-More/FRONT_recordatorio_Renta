import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {uploadFoto} from "../firebase/images.js"
export default function modalEdit({ usuario, closeModal }) {
  const [datas, setDatas] = useState([]);
  console.log(datas);
  const [fotoBase64, setFotoBase64] = useState('');
  const [foto, setFoto] = useState();
  const [foto_temporal, setFoto_temporal] = useState();
  const [dato, setDato] = useState();
  const [valorDato, setValorDato] = useState();
  const [loading, setLoading] = useState(true); 
  const [nombre_usuario, setNombre_usuario]=useState()
  const [nombre_completo, setNombre_completo]=useState()
  const [contraseña, setContraseña]=useState('***************')
  const [rol, setRol]=useState()
  const [modal_change_foto, setModal_change_foto]=useState(true)
  const input_foto=useRef()
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto_temporal(URL.createObjectURL(file)); // Actualiza la previsualización de la foto
    }
  };
  
  const handleSaveFoto = async () => {
    if(foto_temporal){
      setFoto(foto_temporal)
      closeModal_change_foto()
    }
  };
  function clearField(setFieldValue) {
    setFieldValue(''); // Limpia el valor del campo al hacer clic en el botón de editar
  }

  function openModal_change_foto(){
    setModal_change_foto(true)
  }
 function closeModal_change_foto(){
  setModal_change_foto(false)
  }

  async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/read_especific?usuario=gus`);
      setDatas(data.response);
      setNombre_completo(data.response[0].nombre)
      setNombre_usuario(data.response[0].usuario)
      setRol(data.response[0].rol)
      setFoto(data.response[0].foto)
      // if (data.response && data.response[0].foto) {
      //   setFotoBase64(data.response[0].foto); // Aquí asumimos que 'foto' contiene la cadena base64
      // }
      setLoading(false);  // Desactivar el loader cuando los datos se han cargado
    } catch (error) {
      console.error('Error fetching image data:', error);
      setLoading(false);  // También desactivar el loader en caso de error
    }
  }
  async function editarUsuario() {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
  
    let datos = {
      [dato]: valorDato
    };
  
    try {
    
      // Enviar los datos con axios PUT
      await axios.put(`https://backrecordatoriorenta-production.up.railway.app/api/admins/update/${usuario}`, datos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
  
      closeModal();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }
useEffect(() => {
  get();
}, []);

  return (
    <>
    {modal_change_foto === true && (
      <div className="w-full h-screen absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
        <div className='flex flex-col items-center w-[35%] gap-3 bg-white py-[1rem] px-[1rem]'>
          <p className=' font-semibold'>Selecciona una nueva foto</p>
          <input ref={input_foto} onChange={handleFotoChange}  class="form-control" type="file" id="formFile"/>
          <div className='flex w-full justify-between'>
          <button  onClick={handleSaveFoto} className='bg-success text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Guardar</button>
          <button  onClick={closeModal_change_foto} className='bg-[#808080] text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Cancelar</button>
          </div>
        </div>
      </div>
    )}
    <div className="w-full h-screen absolute z-40 bg-[#d9d9d97b] flex justify-center items-center">
      <div className="bg-white rounded-[10px] w-[90%] lg:w-[45%] h-auto flex flex-col">
        <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid'>
          <p className='text-white font-semibold'>Editar Usuarios</p>
          <button onClick={closeModal}>
            <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
          </button>
        </div>
        
          <div className='w-full flex py-[1rem] '>
          {/* //PARTE DE LA foto */}
          <div className='w-[30%] flex justify-center'>
            <div className='w-full items-center gap-2 flex flex-col'>
              <img src={foto} className="w-[7rem] h-[7rem] rounded-full" />
              <button onClick={openModal_change_foto} className='flex gap-1 items-center bg-[#808080]  px-[1rem] rounded-[5px] py-[0.3rem] justify-center text-white'><svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
</svg> Cambiar foto
</button>
            </div>
          </div>
          <div className='w-[70%] px-[1.5rem]'>
            <p className='font-semibold text-[1.3rem] underline pb-3'>Datos del usuario</p>
            <div className='flex flex-col'>
            <div class="mb-2">
    <label for="exampleInputEmail1" class="form-label">Usuario</label>
    <div className='w-full flex gap-1'>
      <input placeholder='Escribe el nuevo nombre de usuario' value={nombre_usuario}  onChange={(e) => setNombre_usuario(e.target.value)} className="w-full border rounded p-2" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
      <button onClick={() => clearField(setNombre_usuario)} className='flex gap-1 items-center underline'>
        <svg class="w-6 h-6 text-[#808080]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="mb-2">
    <label for="exampleInputEmail1" class="form-label">Nombre completo</label>
    <div className='w-full flex gap-1'>
      <input placeholder='Escribe el nuevo nombre' value={nombre_completo} onChange={(e) => setNombre_completo(e.target.value)} type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
      <button className='flex gap-1 items-center underline' onClick={() => clearField(setNombre_completo)}>
        <svg class="w-6 h-6 text-[#808080]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="mb-2">
    <label for="exampleInputEmail1" class="form-label">Contraseña</label>
    <div className='w-full flex gap-1'>
      <input placeholder='Escribe la nueva contraseña' value={contraseña} onChange={(e) => setContraseña(e.target.value)} type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
      <button className='flex gap-1 items-center underline' onClick={() => clearField(setContraseña)}>
        <svg class="w-6 h-6 text-[#808080]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="mb-2">
    <label for="exampleInputEmail1" class="form-label">Rol de usuario</label>
    <div className='w-full flex gap-1'>
      <input placeholder='Escribe el nuevo rol' value={rol} type="number" onChange={(e) => setRol(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
      <button className='flex gap-1 items-center underline' onClick={() => clearField(setRol)}>
        <svg class="w-6 h-6 text-[#808080]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>
      </button>
    </div>
    <div id="emailHelp" class="form-text">1=Administrador 2=Empleado</div>
  </div>
  <div class="pb-4 pt-[1rem] flex justify-between">
    <button className='bg-warning px-[1rem] py-[0.3rem] text-white font-semibold rounded-[5px]'>Guardar cambios</button>
    <button onClick={closeModal} className='bg-[#808080] px-[1rem] py-[0.3rem] text-white font-semibold rounded-[5px]'>Cancelar</button>
  </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    </>
  );
}
