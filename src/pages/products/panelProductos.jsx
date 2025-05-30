import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import ModalEdit from '../../components/modal products/modal_edit_product';
import Modal_create_users from '../../components/modal products/modal_create_products';
import AgregarMetatags from '../../components/modal products/agregar_metatags';
import Swal from 'sweetalert2';
import Modal_ficha from '../../components/detalle_productos'
import CreateCategoriesModal from '../../components/modal categorias/createCategories';
import DeleteCategoriesModal from '../../components/modal categorias/deleteCategories';
export default function panelProductos() {
  const [productos_paginados, setProductos_paginados] = useState([]);
  const [all_products, setAll_products] = useState([]);
  const [show_paginados, setShow_paginados]=useState(true)
  const [visibleCount, setVisibleCount] = useState(8);
  const [show_filter_products,setShow_filter_products]=useState(false)
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [paginacion, setPaginacion]=useState()
  const [total_pages, setTotal_pages]=useState()
  const [modal_ficha, setModal_ficha]=useState()
  const [isOpen, setIsOpen] = useState(false);
const [select, setSelect]=useState()
  const [current_page, setCurrent_page] = useState(() => {
  const savedPage = parseInt(localStorage.getItem('products_current_page'), 10);
  // Si no es un número válido o es menor a 1, lo corregimos
  if (!savedPage || isNaN(savedPage) || savedPage < 1) {
    localStorage.setItem('products_current_page', 1);
    return 1;
  }
  return savedPage;
});
  const [searchTerm, setSearchTerm] = useState();
      const [loading, setLoading] = useState(true);
      const [modaEdit, setModalEdit]=useState(false)
      const [modal_create, setModal_create]=useState(false)
      const [modal_tags, setModal_tags]=useState(false)
      const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
      const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
      function openModal(){
        window.scrollTo(0,0)
        setModalEdit(true)
        document.body.style.overflow = 'hidden';
      }
      function closeModal(){
        setModalEdit(false)
        window.location.reload()
       
      }
      function openModal2(){
        setModal_create(true)
        document.body.style.overflow = 'hidden';
      }
      function closeModal2(){
        setModal_create(false)
        window.location.reload()
      }

      function openModal3(){
        window.scrollTo(0,0)
        setModal_tags(true)
        document.body.style.overflow = 'hidden';
      }
      function closeModal3(){
        setModal_tags(false)
        window.location.reload()
      }
      function openModal_ficha(){
        window.scrollTo(0,0)
        setModal_ficha(true)

        document.body.style.overflow = 'hidden';
      }
      function closeModal_ficha(){
        document.body.style.overflow = 'auto';
        setModal_ficha(false)
      }
      function openCreateCategoryModal() {
        setShowCreateCategoryModal(true);
        document.body.style.overflow = 'hidden';
      }
      function closeCreateCategoryModal() {
        setShowCreateCategoryModal(false);
        document.body.style.overflow = 'auto';
      }
      function openDeleteCategoryModal() {
        setShowDeleteCategoryModal(true);
        document.body.style.overflow = 'hidden';
      }
      function closeDeleteCategoryModal() {
        setShowDeleteCategoryModal(false);
        document.body.style.overflow = 'auto';
      }
      const handleImageLoad = () => {
        setLoadingImages(false);  // Una vez que la imagen se haya cargado
      };
      async function get_all_products() {
        try {
          const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/products/');
          setAll_products(data.response)
          setLoading(false); // Datos cargados, actualizamos el estado de carga
        } catch (error) {
          console.error('Error fetching image data:', error);
          setLoading(false); // Si hay un error, dejamos de mostrar el estado de carga
        }
      }
      async function get_products_paginates(page = current_page) {
        try {
          const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/products/read_pag?page=${page}`);
          setPaginacion(data)
          setTotal_pages(data?.totalPages)
          setProductos_paginados(data.response);
          setLoading(false);
        } catch (error) {
          if (error.response?.data?.message === 'Página fuera de rango. Por favor, selecciona una página válida.') {
            localStorage.setItem('products_current_page', 1);
            setCurrent_page(1); // Corrige el estado
            // Vuelve a pedir los productos de la página 1
            get_products_paginates(1);
            return;
          }
          setLoading(false);
        }
      }
    
      useEffect(() => {
        get_all_products();
        get_products_paginates()
      }, []);
      function buscar(){
        const filtered = all_products.filter((dat) =>
          dat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDatas(filtered)
      }
      const handleShowMore = () => {
        setVisibleCount((prev) => prev + 6); // Incrementa la cantidad visible en 6
      };
      function nextPage(){
        if(current_page < total_pages){
          window.scrollTo(0,0)
          setLoadingImages(true)
          setCurrent_page(current_page + 1)
          get_products_paginates(current_page + 1);
          localStorage.setItem('products_current_page', current_page + 1)
        }
      }
      function prevPage(){
        if(current_page > 1){
          window.scrollTo(0,0)
          setLoadingImages(true)
          setCurrent_page(current_page - 1)
          get_products_paginates(current_page - 1);
          localStorage.setItem('products_current_page', current_page - 1)
        }
      }
      function buscar_boton(){
      if(searchTerm){
        setShow_paginados(false)
        setShow_filter_products(true)
      
      const filtered = all_products.filter((dat) =>
      dat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDatas(filtered)
      }
      else{
        
        setShow_paginados(true)
            setShow_filter_products(false)
      }
      }
      
      //FUNCION CUANDO LIMPIAS EL BUSCADOR CON LA X
      function clear() {
        setSearchTerm('');
        setShow_paginados(true)
        setShow_filter_products(false)
      }
      //FUNCION CUANDO DAS ENTER EN EL BUSCADOR
        const handleKeyDown = (e) => {
          if (e.key === 'Enter' && searchTerm) {
            setShow_paginados(false)
            setShow_filter_products(true)
            buscar()
          }
          if (e.key === 'Enter' && !searchTerm) {
            setShow_paginados(true)
            setShow_filter_products(false)
          }
        };
       
      async function deleteProduct(_id) {
        console.log(_id);
        try {
          
          const datitos = { _id: _id };
          if (datitos._id) {
            const confirmation = await Swal.fire({
              title: `¿Estás seguro de eliminar este equipo?`,
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
                title: 'El equipo se ha eliminado',
                showConfirmButton: false,
                timer: 1500,
              });
              window.location.reload();
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo eliminar este equipo',
              timer: 1500,
            });
          }
        } catch (error) {
          console.log('Error al eliminar el equipo:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al eliminar el equipo. Intenta nuevamente.',
            timer: 1500,
          });
        }
      }
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip_name"]')
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

      function generatePageNumbers(currentPage, totalPages, maxPagesToShow = 7) {
        const pages = [];
        const halfRange = Math.floor(maxPagesToShow / 2);
      
        // Determinar inicio y fin del rango
        let start = Math.max(currentPage - halfRange, 1);
        let end = Math.min(start + maxPagesToShow - 1, totalPages);
      
        // Ajustar el rango si está al final
        if (end - start + 1 < maxPagesToShow) {
          start = Math.max(end - maxPagesToShow + 1, 1);
        }
      
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      
        return pages;
      }
      function goToPage(page) {
        if (page >= 1 && page <= total_pages) {
          window.scrollTo(0, 0);
          setLoadingImages(true);
          setCurrent_page(page);
          get_products_paginates(page);
          localStorage.setItem('products_current_page', page);
        }
      }
      
return (
<>
 {modaEdit && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div className="w-[95vw]  max-w-3xl max-h-[95vh] overflow-y-auto rounded-lg shadow-lg bg-white relative">
      <ModalEdit closeModal={closeModal} _id={select} gett={get_products_paginates}/>
    </div>
  </div>
)}
    {modal_create === true && (
        <Modal_create_users closeModal2={closeModal2}  gett={get_products_paginates}/>
    )}
    {modal_tags === true && (
        <AgregarMetatags closeModal3={closeModal3} _id={select} />
    )}
{modal_ficha === true && (
        <Modal_ficha closeModal={closeModal_ficha}  id={select}/>
    )}
<Navbar/>
<div className='flex flex-col bg-[#ececec] w-full'>
    <div className='bg-[#ffffff] py-[1rem] items-center flex lg:flex-row flex-col gap-2  justify-between px-[0.5rem] lg:px-[2rem]'>
    <p className='text-[#2D76B5] font-bold text-[0.9rem] lg:text-[1.2rem]'>Panel de Equipos</p>
    <div className="flex gap-2">
        <button
            onClick={openModal2}
            className='text-white font-semibold bg-[#46af46] text-[0.8rem] lg:text-[1rem] px-[1rem] py-[0.3rem] rounded-[15px]'
        >
            + Crear equipos
        </button>
        <button
            onClick={openCreateCategoryModal}
            className='text-white font-semibold bg-[#2D76B5] text-[0.8rem] lg:text-[1rem] px-[1rem] py-[0.3rem] rounded-[15px]'
        >
            + Crear categoría
        </button>
        <button
            onClick={openDeleteCategoryModal}
            className='text-white font-semibold bg-[#d9534f] text-[0.8rem] lg:text-[1rem] px-[1rem] py-[0.3rem] rounded-[15px]'
        >
            Eliminar categoría
        </button>
    </div>
</div>
    <div className='w-full h-auto flex flex-col py-[1rem] gap-2 px-[0.5rem] lg:px-[2rem] min-h-[81vh]'>
        <div className='flex flex-col'>
            <p className='font-semibold text-[1.5rem] text-[#4a4a4a]'>Equipos</p>
            <div id="emailHelp" class="form-text">En este apartado podrás crear, editar o eliminar cualquier equipo creado.</div>
        </div>
    <div className="flex w-full bg-[white] py-[1.5rem] px-[1.5rem] rounded-[10px]">
        <div className="relative w-full items-center">
            <input type="text" placeholder="Buscar equipos..." className="w-full py-2 px-[1rem] border bg-[#f1f1f1] border-gray-300 rounded-l-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
            {searchTerm && (
                <button onClick={clear} className="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </button>
            )}
        </div>
        <button className="px-[2rem] bg-primary text-white font-semibold rounded-r-[10px]" onClick={buscar_boton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
        </button>
    </div>
    <div className="flex flex-col w-full lg:w-[100%]">
        {loadingImages && productos_paginados.length > 0 && (
     <div className=" w-full text-center  h-[50vh] gap-3 flex-col flex items-center justify-center"> {/* Aquí iría el loader, por ejemplo un spinner */}
       <div class="spinner-border text-primary w-[3rem] h-[3rem]" role="status">
   <span class="visually-hidden">Loading...</span>
 </div>
 <p className='text-primary font-semibold'>Cargando equipos</p>
     </div>)}
     { show_filter_products === false && show_paginados === true && loadingImages === false && productos_paginados.length === 0 && (
      <div className=" w-full text-center h-[50vh] gap-3 flex-col flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>

        <p>En este momento no estan disponibles equipos para la renta</p>
      </div>
     )}
     { show_filter_products === true && searchTerm && filteredDatas.length === 0 && (
      <div className=" w-full text-center h-[50vh] gap-3 flex-col flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>

        <p>No se han encontrado resultados relacionados con su busqueda,por favor intentelo nuevamente</p>
      </div>
     )}
      {!loadingImages && productos_paginados.length > 0 && (
  <p className='py-[1rem] text-secondary font-semibold text-[1rem] lg:text-[1.3rem]'>Mostrando página {current_page} de {total_pages}</p>
      )}
  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 w-full justify-items-center ">
    {show_filter_products === true && filteredDatas.map((dat, index) => (
       <div key={index} className="bg-white w-full text-center px-2 py-2 rounded-lg items-center flex flex-col gap-2">
       <img className='w-full h-[10vh] lg:h-[35vh]  object-contain' src={dat.foto} alt="" />
       <p  data-bs-toggle="tooltip_name" data-bs-title={dat.nombre} className='truncate max-w-[100%] lg:text-[1rem] text-[0.8rem] text-danger font-semibold'>{dat.nombre.toUpperCase()}</p>
       <div className='flex flex-col '> 
          <p className='text-danger lg:text-[0.8rem] text-[0.6rem] font-semibold'>Precio renta x día</p>
            <p className='text-secondary font-semibold'>${dat.precio_renta} MXN</p>
        </div>
         <div className='flex flex-col '> 
          <p className='text-danger lg:text-[0.8rem] text-[0.6rem] font-semibold'>Precio renta x semana</p>
            <p className='text-secondary font-semibold'>${dat.precio_x_semana || 0} MXN</p>
        </div>
        <div className='flex flex-col '> 
          <p className='text-danger lg:text-[0.8rem] text-[0.6rem] font-semibold'>Precio de Venta</p>
            <p className='text-secondary font-semibold'>${dat.precio_venta} MXN</p>
        </div>
       <button className='bg-warning w-full text-white py-[0.3rem] rounded-[5px] lg:text-[1rem] text-[0.8rem]' onClick={()=>{openModal(), setSelect(dat._id)}}>Editar</button>
       <button className='bg-primary w-full text-white py-[0.3rem] rounded-[5px] lg:text-[1rem] text-[0.8rem]' onClick={()=>{openModal3(), setSelect(dat._id)}}>Actualizar Tags</button>
       <button className='bg-danger w-full text-white py-[0.3rem] rounded-[5px] lg:text-[1rem] text-[0.8rem]' onClick={()=>{deleteProduct(dat._id)}}>Eliminar</button>
     </div>
    ))}
    
    {productos_paginados.map((dat, index) => (
       <img className='w-full h-[35vh] object-contain hidden' src={dat.foto} alt="" onLoad={()=>{setLoadingImages(false)}}/>
    ))}
    
    {show_paginados === true && loadingImages === false  && productos_paginados.map((dat, index) => (
      <>
      <div key={index} className="bg-white w-full text-center px-2 py-2 rounded-lg items-center flex flex-col gap-2">
        <img className='w-full h-[10vh] lg:h-[35vh]  object-contain' src={dat.foto} alt="" />
        <a data-bs-toggle="tooltip_name" data-bs-title={dat.nombre} className='truncate max-w-[100%] lg:text-[1rem] text-[0.8rem] text-danger font-semibold'>{dat.nombre.toUpperCase()}</a>
        <div className='flex flex-col '> 
          <p className='text-danger lg:text-[0.8rem] text-[0.6rem] font-semibold'>Precio renta x día</p>
            <p className='text-secondary font-semibold'>${dat.precio_renta} MXN</p>
        </div>
         <div className='flex flex-col '> 
          <p className='text-danger lg:text-[0.8rem] text-[0.6rem] font-semibold'>Precio renta x semana</p>
            <p className='text-secondary font-semibold'>${dat.precio_x_semana || 0} MXN</p>
        </div>
        <div className='flex flex-col '> 
          <p className='text-danger lg:text-[0.8rem] text-[0.6rem] font-semibold'>Precio de Venta</p>
            <p className='text-secondary font-semibold'>${dat.precio_venta} MXN</p>
        </div>
        <button className='bg-warning w-full text-white py-[0.3rem] rounded-[5px] lg:text-[1rem] text-[0.8rem]' onClick={()=>{openModal(), setSelect(dat._id)}}>Editar</button>
        <button className='bg-primary w-full text-white py-[0.3rem] rounded-[5px] lg:text-[1rem] text-[0.8rem]' onClick={()=>{openModal3(), setSelect(dat._id)}}>Actualizar Tags</button>
        <button className='bg-danger w-full text-white py-[0.3rem] rounded-[5px] lg:text-[1rem] text-[0.8rem]' onClick={()=>{deleteProduct(dat._id)}}>Eliminar</button>
      </div>
      </>
    ))}
  </div>
  {show_paginados === true && loadingImages === false && (
  <div className="w-full py-[2rem] flex items-center justify-center gap-2">
    <div className="flex gap-3 items-center">
      {/* Botón "Anterior" */}
      <button
        onClick={prevPage}
        disabled={current_page === 1}
        className="bg-[#0D6EFD] disabled:bg-[gray] text-white px-[1rem] py-[0.3rem] lg:text-[1rem] text-[0.8rem] rounded-[5px]"
      >
        Anterior
      </button>

      {/* Números de página dinámicos */}
      <div className="flex gap-2">
        {generatePageNumbers(current_page, total_pages).map((page) => (
          <button
            key={page}
            disabled={current_page === page} 
            onClick={() => goToPage(page)}
            className={`lg:px-3 lg:text-[1rem] text-[0.8rem]  py-1 rounded-lg ${
              current_page === page
                ? "lg:bg-[#0D6EFD] text-[blue] lg:text-[white]"
                : "lg:bg-white text-black lg:border lg:border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Botón "Siguiente" */}
      <button
        onClick={nextPage}
        disabled={current_page >= total_pages}
        className="bg-[#0D6EFD] disabled:bg-[gray] text-white px-[1rem] py-[0.3rem] lg:text-[1rem] text-[0.8rem] rounded-[5px]"
      >
        Siguiente
      </button>
    </div>
  </div>
)}
</div>
    </div>
    
</div>
{showCreateCategoryModal && (
  <CreateCategoriesModal closeModal={closeCreateCategoryModal} />
)}
{showDeleteCategoryModal && (
  <DeleteCategoriesModal closeModal={closeDeleteCategoryModal} />
)}
</>
);}
