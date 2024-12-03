import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import axios from 'axios';
import Lightbox from './ligthbox';
export default function ModalDetalle({ closeModal, _id }) {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const openLightbox = (imageSrc) => {
    setCurrentImage(imageSrc);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };
  async function get() {
    try {
      const { data } = await axios.get(
        `https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`
      );
      setDatas(data.response);
      setLoading(false); // Desactivar el loader cuando los datos se han cargado
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Desactivar el loader también en caso de error
    }
  }

  useEffect(() => {
    get();
  }, []);

  return (
    <>
    {isOpen && (
       <Lightbox
       isOpen={isOpen}
       closeLightbox={closeLightbox}
       currentImage={currentImage}
     />
    )}
      <div className="w-full h-screen absolute z-40 bg-[#d9d9d97b] flex justify-center items-center">
        <div className="bg-white rounded-[10px] w-[90%] lg:w-[80%] overflow-y-auto h-[90vh] flex flex-col gap-2 py-[1rem] px-[1rem]">
          <div className="flex justify-between">
            <img className="w-[5rem]" src={logo} alt="" />
            <button onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </svg>
            </button>
          </div>

          {/* Mostrar loader mientras se cargan los datos */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center font-semibold text-[1.2rem] underline">Detalles de la renta</p>
              {datas.map((dat) => (
                <div className="flex flex-col text-[0.9rem] pt-[1rem]" key={dat.identificador}>
                  <div className='flex gap-2'>
                  <p className='font-bold'>Folio:</p>
                  <p>{dat.identificador}</p>
                  </div>
                  <div className='flex gap-2'>
                  <p className='font-bold'>Arrendatario:</p>
                  <p>{dat.nombre_cliente}</p>
                  </div>
                  <div className='flex gap-2'>
                  <p className='font-bold'>Celular:</p>
                  <p>{dat.celular_cliente}</p>
                  </div>
                  <div className='flex gap-2'>
                  <p className='font-bold'>Encargado:</p>
                  <p>{dat.usuario_retandor}</p>
                  </div>
                  <div className='flex gap-2'>
                  <p className='font-bold'>Fecha y hora de renta:</p>
                  <p>{dat.fecha_renta} {dat.hora_renta}</p>
                  </div>
                  <div className='flex gap-2'>
                  <p className='font-bold'>Fecha de retorno de arrendo:</p>
                  <p>{dat.fecha_vencimiento}</p>
                  </div>
                  <p className="underline font-bold pt-[1rem]">Productos rentados:</p>
                  <div className="w-full overflow-x-auto">
  <table
    className="min-w-max"
    style={{
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'center',
      fontSize: '0.8rem',
    }}
  >
    <thead>
      <tr>
        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Producto</th>
        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Código de producto</th>
        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Cantidad</th>
        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Precio x unidad</th>
        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Precio x cantidad</th>
      </tr>
    </thead>
    <tbody>
      {dat.productos?.map((producto) => (
        <tr key={producto.codigo}>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{producto.nombre}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{producto.codigo}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{producto.cantidad}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>${producto.precio_unitario}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>${producto.precio_total_cantidad}</td>
        </tr>
      ))}
      <tr>
        <td colSpan="4" className="text-end py-[0.5rem] px-[1rem] whitespace-nowrap">
          Importe total de la renta:
        </td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>${dat.importe_total}</td>
      </tr>
    </tbody>
  </table>
</div>


                  <p className="font-bold underline">Imágenes del estado inicial del producto (Como lo recibe el cliente)</p>
                  <div className="flex w-full gap-2 py-[1rem]">
                  {dat?.fotos_estado_inicial?.map((foto, index) => (
          <div
            key={index}
            className="w-[5rem] h-[5rem] bg-gray-200 cursor-pointer transition-all duration-200 hover:brightness-50 "
            onClick={() => openLightbox(foto)}
          >
            <img className="w-full h-full object-cover" src={foto} alt={`Imagen ${index}`} />
          </div>
        ))}
                  </div>

                  <p className="font-bold underline">Observación inicial del responsable a cargo:</p>
                  {!dat.observacion_inicial ? (
                    <p>Sin observaciones</p>
                  ) : (
                    <p>{dat.observacion_inicial}</p>
                  )}

                  {/* Datos de devolución */}
                  {dat.observacion_devolucion && (
                    <>
                      <p className="text-center font-semibold text-[1.2rem] underline">Datos de devolución</p>
                      <div className='flex gap-2'>
                  <p className='font-bold'>Responsable que recibe los equipos:</p>
                  <p>{dat.usuario_recibidor}</p>
                  </div>
                  <div className='flex gap-2'>
                  <p className='font-bold'>Fecha y hora de devolución:</p>
                  <p>{dat.fecha_devolucion} {dat.hora_devolucion}</p>
                  </div>
                      
                      <p className="font-bold underline">Pruebas de devolución (Como recibe el responsable los equipos devueltos por el cliente)</p>
                      <div className="flex w-full gap-2 py-[1rem]">
                  {dat?.fotos_estado_inicial?.map((foto, index) => (
          <div
            key={index}
            className="w-[5rem] h-[5rem] bg-gray-200 transition-all duration-200 hover:brightness-50 cursor-pointer"
            onClick={() => openLightbox(foto)}
          >
            <img className="w-full h-full object-cover" src={foto} alt={`Imagen ${index}`} />
          </div>
        ))}
                  </div>
                      <p className="font-bold underline">Observación de la devolución de los equipos:</p>
                      <p>{dat.observacion_devolucion}</p>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
