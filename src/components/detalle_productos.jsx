import axios from 'axios';
import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import Lightbox from './ligthbox';
export default function detalle_productos({closeModal, id}) {
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    async function get() {
        try {
          const { data } = await axios.get(
            `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${id}`
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
      const openLightbox = (imageSrc) => {
        setCurrentImage(imageSrc);
        setIsOpen(true);
      };
    
      const closeLightbox = () => {
        setIsOpen(false);
      };
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
        <div className="bg-white rounded-[10px] w-[90%] lg:w-[40%] overflow-y-auto h-[90vh] flex flex-col gap-2 py-[1rem] px-[1rem]">
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
              <p className="text-center font-semibold text-[1.2rem] underline">Detalles del producto</p>
              {datas.map((dat) => (
                <div className="flex flex-col gap-3  text-[0.9rem] pt-[1rem]" >
                    <div className='w-full flex flex-col gap-2'>
                    <p className='font-bold underline'>Foto del producto:</p>
                    <img
  className="w-[12rem] transition-all duration-200 hover:brightness-50 cursor-pointer"
  src={dat.foto}
  alt=""
  onClick={() => openLightbox(dat.foto)}
/>
                    </div>
                    <div className='flex gap-2'>
                        <p className='font-bold'>Nombre del producto:</p>
                        <p>{dat.nombre}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='font-bold'>Codigo del producto:</p>
                        <p>{dat.codigo}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='font-bold'>Precio unitario:</p>
                        <p>$ {dat.precio} MXN</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='font-bold'>Stock disponible:</p>
                        <p>{dat.stock} unidades</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='font-bold'>Descripcion del producto:</p>
                        <p>{dat.nombre}</p>
                    </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
