import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import axios from 'axios';
import pen from '../../images/pen.png';
import ModalEdit from '../../components/modal products/modal_edit_product';
import Modal_create_users from '../../components/modal products/modal_create_products';
import Swal from 'sweetalert2';

export default function panelProductos() {
      const [datas, setDatas] = useState([]);
      const [select, setSelect]=useState()
        const [searchTerm, setSearchTerm] = useState('');
        const [filteredDatas, setFilteredDatas] = useState([]);
      const [loading, setLoading] = useState(true);
      const [modaEdit, setModalEdit]=useState(false)
      const [modal_create, setModal_create]=useState(false)
      function openModal(){
        setModalEdit(true)
      }
      function closeModal(){
        setModalEdit(false)
        window.location.reload()
      }
      function openModal2(){
        setModal_create(true)
      }
      function closeModal2(){
        setModal_create(false)
        window.location.reload()
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
      async function deleteProduct(_id) {
        console.log(_id);
        try {
          
          const datitos = { _id: _id };
          if (datitos._id) {
            const confirmation = await Swal.fire({
              title: `¿Estás seguro de eliminar este producto?`,
              showDenyButton: true,
              confirmButtonText: 'Sí',
              denyButtonText: 'No',
              confirmButtonColor: '#3085d6',  // Cambia este color
              denyButtonColor: '#d33', 
            });
    
            if (confirmation.isConfirmed) {
              Swal.fire({
                title: 'Cargando, por favor espere...',
                didOpen: () => {
                  Swal.showLoading();  // Mostrar el spinner de carga
                }
              });
              await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/products/delete', {
                data: datitos,
              });
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El producto se ha eliminado',
                showConfirmButton: false,
                timer: 1500,
              });
              window.location.reload();
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo eliminar este producto',
              timer: 1500,
            });
          }
        } catch (error) {
          console.log('Error al eliminar el producto:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al eliminar el producto. Intenta nuevamente.',
            timer: 1500,
          });
        }
      }
return (
<>
 {modaEdit === true && (
        <ModalEdit closeModal={closeModal} _id={select} gett={get}/>
    )}
    {modal_create === true && (
        <Modal_create_users closeModal2={closeModal2}  gett={get}/>
    )}
<Navbar/>
<div className='flex flex-col bg-[#ececec] w-full'>
    <div className='bg-[#ffffff] py-[1rem] items-center flex justify-between px-[0.5rem] lg:px-[2rem]'>
        <p className='text-[#2D76B5] font-bold text-[0.9rem] lg:text-[1.2rem]'>Panel de Productos</p>
        <button onClick={openModal2} className='text-white font-semibold bg-[#46af46] text-[0.8rem] lg:text-[1rem] px-[1rem] py-[0.3rem] rounded-[15px]'>+ Crear productos</button>
    </div>
    <div className='w-full h-auto flex flex-col py-[1rem] gap-2 px-[0.5rem] lg:px-[2rem]'>
        <div className='flex flex-col'>
            <p className='font-semibold text-[1.5rem] text-[#4a4a4a]'>Productos</p>
            <div id="emailHelp" class="form-text">En este apartado podrás crear, editar o eliminar cualquier producto creado.</div>
        </div>
    <div className="flex w-full bg-[white] py-[1.5rem] px-[1.5rem] rounded-[10px]">
        <div className="relative w-full items-center">
            <input type="text" placeholder="Buscar productos..." className="w-full py-2 px-[1rem] border bg-[#f1f1f1] border-gray-300 rounded-l-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
            {searchTerm && (
                <button onClick={clear} className="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </button>
            )}
        </div>
        <button className="px-[2rem] bg-primary text-white font-semibold rounded-r-[10px]" onClick={handleSearch}>
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
        <p>No se encontraron usuarios relacionados a tu búsqueda</p>
        <button onClick={() => window.location.reload()} className="bg-primary text-white font-semibold px-4 py-2 rounded mt-4">Refrescar</button>
    </div>
    ) : (
    <div className="flex flex-col bg-[white] py-[1.5rem] px-[1.5rem] gap-2 w-full overflow-x-hidden overflow-y-auto">
    <div className='flex justify-start border-b-[1px] border-solid '>
        <p className='font-semibold text-[1.1rem] pb-3'>Foto / Nombre de usuario</p>
    </div>
    
    <div className="w-full flex flex-col gap-[1rem] overflow-x-hidden overflow-y-auto max-h-[45vh]">
  {filteredDatas.map((dat) => (
    <div
      key={dat.id}
      className="flex flex-wrap w-full gap-2 justify-between border-b-[1px] border-gray-300 py-[1rem] px-[1rem] bg-white rounded-lg shadow-md"
    >
      {/* Contenedor de foto y nombre */}
      <div className="flex gap-2 items-center min-w-[200px] max-w-[400px] flex-shrink-0">
        {dat.foto ? (
          <img
            className="w-[3rem] h-[3rem] border-solid border-[1px] border-gray-300 rounded-full"
            src={dat.foto}
            alt="Foto"
          />
        ) : (
          <div
            className="w-[3rem] h-[3rem] rounded-full bg-gray-100 border-solid border-[1px] border-gray-300 text-gray-600 flex justify-center items-center"
            data-bs-toggle="tooltip"
            data-bs-title="Ver perfil"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-person-circle w-[1.5rem] h-[1.5rem]"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </div>
        )}
        {/* Ajuste de texto para nombres largos */}
        <p className="text-sm lg:text-base break-words break-all lg:w-full w-[52%]">
          {dat.nombre}
        </p>
      </div>

      {/* Contenedor de botones */}
      <div className="flex gap-3 flex-shrink-0">
        <button
          className="bg-primary text-white rounded-[5px] px-[0.5rem] lg:px-[1rem] py-[0.3rem] flex gap-1 items-center shadow-md"
          onClick={() => {
            openModal();
            setSelect(dat._id);
          }}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white rounded-[5px] px-[0.5rem] lg:px-[1rem] py-[0.3rem] flex gap-1 items-center shadow-md"
          onClick={() => deleteProduct(dat._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  ))}
</div>



    </div>
    )}
    </div>
    
</div>
</>
);}
