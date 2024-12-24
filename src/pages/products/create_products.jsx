import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import { uploadFoto } from '../../firebase/images.js';
export default function create_products() {
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
  if(!nombre || !codigo || !codigo || !precio || !descripcion){
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
nombre: nombre,
foto: fotoURL || null,
codigo:codigo,
precio:precio,
descripcion:descripcion
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
    <>
    <Navbar/>
    
    <div className='w-full h-full flex'>
    <div className='w-full flex justify-center items-center bg-[#EBEBEB] relative  h-[100vh]'>
          <div className='bg-[white] w-[90%] lg:w-[60%] rounded-[10px] items-center flex flex-col  px-[1.5rem] py-[2rem]'>
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
    </>
  );
}
