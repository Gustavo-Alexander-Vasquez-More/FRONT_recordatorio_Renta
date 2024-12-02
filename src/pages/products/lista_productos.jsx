import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import Detalle_productos from '../../components/detalle_productos';
import Swal from 'sweetalert2';
export default function lista_productos() {
    const [datas, setDatas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDatas, setFilteredDatas] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [modal, setModal]=useState(false)
    const [id, setId]=useState(null)
function openModal(){
    setModal(true)
}
function closeModal(){
    setModal(false)
}

    async function get() {
      try {
        const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/products/');
        setDatas(data.response);
        setFilteredDatas(data.response); // Al principio mostramos todos los datos
        setLoading(false); // Datos cargados, actualizamos el estado de carga
      } catch (error) {
        console.error('Error fetching image data:', error);
        setLoading(false); // Si hay un error, dejamos de mostrar el estado de carga
      }
    }
  
    useEffect(() => {
      get();
    }, []);
  
    function handleSearch() {
      // Filtra_ids según el término de búsqueda
      const filtered = datas.filter((dat) =>
        dat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dat.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDatas(filtered);
    }
  
    // Limpiar el término de búsqueda
    function clear() {
      setSearchTerm('');
    }
  
    // Ejecutar handleSearch cuando searchTerm se vacíe
    useEffect(() => {
      if (searchTerm === '') {
        handleSearch();
      }
    }, [searchTerm]);
  
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSearch(); // Ejecutar la búsqueda al presionar Enter
      }
    };
  return (
    <>
      {modal === true && (
        <Detalle_productos closeModal={closeModal} id={id}/>
      )}
      <Navbar />
      
      <div className="w-full h-full flex">
        
        <div className="w-full flex justify-center items-center bg-[#EBEBEB] relative h-[89vh]">
          <div className="bg-[white] w-[90%] rounded-[10px] items-center flex flex-col gap-4 px-[1.5rem] py-[2rem]">
            <p className="text-[1.5rem] font-semibold font-serif">Lista de todos los equipos</p>
            <div className="flex w-full">
              <div className="relative w-full items-center">
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código de producto..."
                  className="w-full py-2 px-[1rem] border border-gray-300 rounded-l-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
                  onKeyDown={handleKeyDown} // Detectar presionar Enter
                />
                {searchTerm && (
                  <button onClick={clear} className="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                className="px-[2rem] bg-primary text-white font-semibold rounded-r-[10px]"
                onClick={handleSearch} // Ejecutar la búsqueda al hacer clic
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </div>
            {loading && (
               <div className="flex flex-col gap-2 text-center items-center">
               <div className="spinner-border text-primary" role="status">
                 <span className="visually-hidden">Loading...</span>
               </div>
               </div>
            )}
            {!loading && filteredDatas.length === 0 ? (
              <div className="text-center text-lg">
                <p>No se encontraron productos relacionados a tu búsqueda</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-white font-semibold px-4 py-2 rounded mt-4"
                >
                  Refrescar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full overflow-y-auto max-h-[40vh]">
                {filteredDatas.slice(0, 4).map((dat) => (
                  <div className="w-full bg-[#EBEBEB] rounded-[10px] flex justify-between items-center px-[1rem] h-auto py-[1rem]" key={dat._id}>
                    <div className="flex gap-4 items-center">
                      {dat.foto && <img className="w-[3rem] rounded-full h-[3rem]" src={dat.foto} alt="" />}
                      <p className='font-semibold underline'>{dat.nombre}</p>
                      <div className='gap-2 flex'>
                      <p className='font-bold'>Precio:</p>
                      <p>${dat.precio}</p>
                      </div>
                    </div>
                    <button className='flex flex-col items-center' onClick={() => {openModal(), setId(dat._id)}}>
                        <p className='font-semibold'>Detalles</p>
                    <svg class="w-7 h-7 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
  <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
</svg>

                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
