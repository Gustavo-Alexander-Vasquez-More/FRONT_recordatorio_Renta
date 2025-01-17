import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import { uploadFoto } from '../../firebase/images.js';
export default function modal_create_products({closeModal2}) {
    const notyf = new Notyf({
        position: {
          x: 'center',
          y: 'top',
        },
        duration:3500
      });
    const [foto, setFoto]=useState()
    const [nombre, setNombre]=useState()
    const [codigo, setCodigo]=useState()
    const [precio, setPrecio]=useState()
    const [stock, setStock]=useState()
    const [descripcion, setDescripcion]=useState()
    const input_nombre=useRef()
    const input_codigo=useRef()
    const input_precio=useRef()
    const input_sotck=useRef()
    const input_foto=useRef()
    const input_descripcion=useRef()
    
    function captureNombre(){
    setNombre(input_nombre.current.value)
    }
    function captureCodigo(){
    setCodigo(input_codigo.current.value)
    }
    function captureDescripcion(){
      setDescripcion(input_descripcion.current.value)
      }
    function capturePrecio(event) {
      let value = event.target.value;
    
      // Eliminar caracteres no numéricos (excepto el punto decimal)
      value = value.replace(/[^0-9.]/g, '');
    
      // Si contiene un punto, lo separamos en parte entera y decimal
      if (value.includes('.')) {
        let [entero, decimales] = value.split('.');
    
        // Formateamos la parte entera con comas para los miles
        entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
        // Actualizamos el estado con la parte entera y los decimales
        setPrecio(`${entero}.${decimales}`);
      } else {
        // Si no contiene punto, solo formateamos la parte entera con comas
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setPrecio(value);
      }
    }
    
    const handleChange = (e) => {
      const value = e.target.value;
      capturePrecio(e); // Aplicar el formateo en vivo
    };
    function captureStock(){
    setStock(input_sotck.current.value)
    }
    
    
    
    async function crear_products() {
      Swal.fire({
        title: 'Cargando, por favor espere...',
        didOpen: () => {
          Swal.showLoading();  // Mostrar el spinner de carga
        }
      });
      if(!nombre || !codigo || !codigo || !precio || !descripcion || !stock){
        notyf.error('Por favor complete los campos')
      }
      
      let fotoURL = '';
      const selectedFile = input_foto.current.files[0];
        if (selectedFile) {
            try {
                fotoURL = await uploadFoto(selectedFile); // Sube la foto y obtiene la URL
                console.log('URL de descarga:', fotoURL);
            } catch (error) {
                notyf.error('Error al subir la foto. Intente nuevamente.');
                return;
            }
        }
    
    const datos={
    nombre: nombre.toUpperCase(),
    foto: fotoURL || null,
    codigo:codigo,
    stock:stock,
    precio:precio,
    descripcion:descripcion.toUpperCase()
    }
    console.log(datos.foto);
    try {
    await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/products/create`, datos)
    notyf.success('El producto se creó con éxito, se recargará esta página en 1 segundos')
    setTimeout(async () => {
    window.location.reload();
    }, 1000);
    
    } catch (error) {
      
    }
    }
  return (
    <div className="w-full lg:h-screen absolute z-40 bg-[#d9d9d97b] flex lg:py-0 py-[2rem] justify-center items-center">
        <div className="bg-white rounded-[10px] w-[90%] lg:w-[45%] h-auto flex flex-col">
          <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid'>
            <p className='text-white font-semibold'>Crear productos</p>
            <button onClick={closeModal2}>
              <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
          </div>
          
    <div className='w-full flex justify-center items-center bg-[#EBEBEB] relative '>
          <div className='bg-[white] w-full items-center flex flex-col  px-[1.5rem] py-[2rem]'>
          <div class="mb-3 w-full">
            <label for="exampleInputPassword1" class="form-label">Nombre del producto</label>
            <input ref={input_nombre} onChange={captureNombre} type="text" class="form-control" id="exampleInputPassword1"/>
          </div>
          <div class="mb-3 w-full">
            <label for="exampleInputPassword1" class="form-label">Foto del producto</label>
            <input ref={input_foto}  type="file" class="form-control" id="exampleInputPassword1"/>
          </div>
          <div class="mb-3 w-full">
            <label for="exampleInputPassword1" class="form-label">Código del producto</label>
            <input ref={input_codigo} onChange={captureCodigo} type="text" class="form-control" id="exampleInputPassword1"/>
          </div>
          <div class="mb-3 w-full">
            <label for="exampleInputPassword1" class="form-label">Stock del producto</label>
            <input ref={input_sotck} placeholder='Escribelo en números' onChange={captureStock} type="number" class="form-control" id="exampleInputPassword1"/>
          </div>
          <div class="mb-3 w-full">
            <label for="exampleInputPassword1" class="form-label">Descripción del producto</label>
            <textarea ref={input_descripcion} onChange={captureDescripcion} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
          </div>
          <div class="mb-3 w-full">
  <label for="exampleInputPassword1" class="form-label">Precio de renta</label>
  <input 
    ref={input_precio} 
    onInput={handleChange} 
    value={precio} 
    placeholder='Colocar punto para separar los decimales de los centavos. Ejm: 1,203.50' 
    type="text" 
    class="form-control" 
    id="exampleInputPassword1"
  />
</div>
          <div className='w-full flex justify-center'>
                  <button onClick={crear_products} className='px-[2rem] text-white rounded-[5px] py-[0.5rem] font-semibold bg-primary'>Crear producto</button>
                </div>
        </div>
    </div>
    </div>
          </div>
         
  );
}
