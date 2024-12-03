import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import {uploadFoto} from "../firebase/images.js"
export default function modal_recibido({closeModal_recibido, _id}) {

const [observacion, setObservacion]=useState()
const [files, setFiles]=useState([])
console.log(files);
const [datas, setDatas]=useState()
const [loading, setLoading]=useState()
console.log(datas);
const notyf = new Notyf({
  position: {
    x: 'center',
    y: 'top',
  },
  duration:3500
});
async function get() {
  try {
    const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`);
    setDatas(data.response);
    ; // Al principio mostramos todos los datos
    setLoading(false); // Datos cargados, actualizamos el estado de carga
  } catch (error) {
    console.error('Error fetching image data:', error);
    setLoading(false); // Si hay un error, dejamos de mostrar el estado de carga
  }
}

useEffect(() => {
  get();
}, []);


const input_detalle=useRef()
function captureDetalle(){
setObservacion(input_detalle.current.value)
}
const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files); // Convertir los archivos seleccionados a un array

  // Subir los archivos directamente a setFiles con una URL temporal para cada imagen
  setFiles((prevFiles) => [
    ...prevFiles,
    ...selectedFiles.map((file) => ({
      id: file.name + Date.now(), // Un identificador único para cada imagen
      file: file,
      src: URL.createObjectURL(file), // Crear una URL temporal para la vista previa
      name: file.name,
    })),
  ]);
};

  //FUNCION PARA ELIMINAR CADA IMAGEN SUBIDA
  const handleRemoveImage = (id, index) => {
    // Eliminar la imagen seleccionada del estado
    setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
  };
  async function marcarEntrega() {
    Swal.fire({
      title: 'Cargando, por favor espere...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      // Subir imágenes a Firebase y obtener las URLs
      const urls = await Promise.all(
        files.map(async (image) => {
          return await uploadFoto(image.file); // Subir cada archivo y devolver la URL
        })
      );
  
      // Validación: Si no hay observaciones o las URLs están vacías, no continuar
      if (!observacion || urls.length === 0) {
        Swal.close();
        return Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Debe agregar observaciones y al menos una imagen.'
        });
      }
  
      // Preparar los datos
      const fecha_constructor = new Date();
      const dia = fecha_constructor.getDate().toString().padStart(2, '0');
      const mes = (fecha_constructor.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha_constructor.getFullYear();
      const hora = fecha_constructor.getHours().toString().padStart(2, '0');
      const minutos = fecha_constructor.getMinutes().toString().padStart(2, '0');
  
      const datos = {
        usuario_recibidor: localStorage.getItem('usuario'),
        estado_renta: 'Entregado',
        fecha_devolucion: `${dia}/${mes}/${año}`,
        hora_devolucion: `${hora}:${minutos}`,
        fotos_estado_devolucion: urls, // URLs subidas
        observacion_devolucion: observacion
      };
  
      // Enviar los datos a la API
      await axios.put(
        `https://backrecordatoriorenta-production.up.railway.app/api/rentas/update/${_id}`,
        datos,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Actualización del stock (mantiene tu lógica actual)
      const datis = datas?.[0];
      const productos = datis?.productos;
      for (const product of productos) {
        try {
          const productResponse = await axios.get(
            `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${product._id}`
          );
          const currentStock = productResponse?.data?.response[0]?.stock;
          if (currentStock !== undefined) {
            const newStock = currentStock + product.cantidad;
            await axios.put(
              `https://backrecordatoriorenta-production.up.railway.app/api/products/update/${product._id}`,
              { stock: newStock }
            );
          }
        } catch (error) {
          console.error(`Error al actualizar el stock del producto ${product._id}:`, error);
        }
      }
  
      // Notificación y recarga de la página
      notyf.success('Se ha marcado la entrega de la renta.');
      setTimeout(() => window.location.reload(), 1000);
  
    } catch (error) {
      Swal.close();
      console.error('Error al marcar la entrega:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al procesar la entrega!'
      });
    }
  }
  
  
  return (
 <>
 <div className="w-full h-screen absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
    <div className="bg-white rounded-[10px] w-[90%] lg:w-[80%] h-auto flex flex-col gap-4 py-[1rem] px-[1rem]">
        <div className="flex justify-end">
            <button onClick={closeModal_recibido}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </button>
        </div>
        <p className='text-center underline text-[1.2rem] font-semibold'>Formulario para marcar la devolución de una renta</p>
        <div className='flex flex-col w-full py-[2rem]'>
        <div className="mb-3">
    <label
      htmlFor="photoInput"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Fotos de cómo devolvió el cliente los equipos
    </label>
    <input
      type="file"
      id="photoInput"
      accept="image/*"
      multiple
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <div className="flex overflow-x-auto  gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 mt-3">
      {files.map((image, index) => (
        <div key={image.id}  className="relative">
          <img
            src={image.src}
            alt={image.name}
            className="h-24 w-24 object-cover rounded shadow"
          />
          <button
            onClick={() => handleRemoveImage(image.id, index)}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1 px-2 rounded-full transform -translate-y-1 -translate-x-0"
          >
            X
          </button>
        </div>
      ))}
    </div>
  </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label text-[0.8rem] font-semibold">Observaciones de la devolución (detalle como entregó el cliente los equipos)</label>
                <textarea ref={input_detalle} onChange={captureDetalle} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            <div className='w-full flex items-center justify-center'>
                <button onClick={marcarEntrega} className='bg-primary text-white px-[1rem] py-[0.3rem] rounded-[5px]'>Enviar</button>
            </div>
        </div>
    </div>
</div>
 </>
  );
}
