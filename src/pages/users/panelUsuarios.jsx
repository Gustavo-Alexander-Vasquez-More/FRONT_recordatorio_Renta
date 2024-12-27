import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import axios from 'axios';
import pen from '../../images/pen.png';
import ModalEdit from '../../components/modalEdit';
import Swal from 'sweetalert2';

export default function panelUsuarios() {
      const [datas, setDatas] = useState([]);
      const [user_selected, setUserSelected]=useState()
      const [searchTerm, setSearchTerm] = useState('');
      const [filteredDatas, setFilteredDatas] = useState([]);
      const [loading, setLoading] = useState(true);
      const [modaEdit, setModalEdit]=useState(true)

      function openModal(){
        setModalEdit(true)
      }
      function closeModal(){
        setModalEdit(false)
        window.location.reload()
      }
    async function get() {
        try {
          const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/admins/');
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
        // Filtrar los usuarios cuando se haga clic en el botón de búsqueda
        const filtered = datas.filter((dat) =>
          dat.usuario.toLowerCase().includes(searchTerm.toLowerCase())
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
      async function deleteUser(user) {
        try {
          const datitos = {
            usuario: user, // El usuario que quieres eliminar
          };
    
          if (datitos.usuario) {
            const confirmation = await Swal.fire({
              title: `¿Estás seguro de eliminar este usuario?`,
              text:'Si lo eliminas, sus rentas permanecerán, pero ya no estarán vinculadas a ningún usuario, incluso si creas uno nuevo con el mismo nombre.',
              showDenyButton: true,
              confirmButtonText: 'Sí, eliminar',
              denyButtonText: 'No, cancelar',
              confirmButtonColor: '#d33',  // Cambia este color
              denyButtonColor: '#B0B0B0', 
            });
    
            if (confirmation.isConfirmed) {
              // Aquí es donde se debe enviar correctamente el cuerpo de la solicitud
              await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/admins/delete', {
                data: datitos, // Pasamos los datos de usuario dentro del campo 'data'
              });
    
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El usuario se ha eliminado correctamente.',
                showConfirmButton: false,
                timer: 1500,
              });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo eliminar este usuario',
              timer: 1500,
            });
          }
        } catch (error) {
          console.log('Error al eliminar usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al eliminar el usuario. Intenta nuevamente.',
            timer: 1500,
          });
        }
      }
return (
<>
 {modaEdit === true && (
        <ModalEdit closeModal={closeModal} usuario={user_selected}/>
    )}
<Navbar/>
<div className='flex flex-col bg-[#ececec] w-full h-[90vh]'>
    <div className='bg-[#ffffff] py-[1rem] items-center flex justify-between px-[2rem]'>
        <p className='text-[#2D76B5] font-bold text-[1.2rem]'>Panel de usuarios</p>
        <button className='text-white font-semibold bg-[#46af46] px-[1rem] py-[0.3rem] rounded-[15px]'>+ Crear usuarios</button>
    </div>
    <div className='w-full h-auto flex flex-col py-[1rem] gap-2 px-[2rem]'>
        <div className='flex flex-col'>
            <p className='font-semibold text-[1.5rem] text-[#4a4a4a]'>Usuarios</p>
            <div id="emailHelp" class="form-text">En este apartado podrás crear, editar o eliminar cualquier usuario creado.</div>
        </div>
    <div className="flex w-full bg-[white] py-[1.5rem] px-[1.5rem] rounded-[10px]">
        <div className="relative w-full items-center">
            <input type="text" placeholder="Buscar usuarios..." className="w-full py-2 px-[1rem] border bg-[#f1f1f1] border-gray-300 rounded-l-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
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
    <div className="flex flex-col bg-[white] py-[1.5rem] px-[1.5rem] gap-1 w-full overflow-y-auto min-h-[52vh] max-h-[52vh] ">
    <div className='flex justify-start border-b-[1px] border-solid '>
        <p className='font-semibold text-[1.1rem] pb-3'>Foto / Nombre de usuario</p>
    </div>
    {filteredDatas.map((dat) => (
        <div className="w-full border-b-[1px] border-solid flex justify-between items-center px-[1rem] h-auto py-[0.5rem]" key={dat._id}>
            <div className="flex gap-4 items-center">
                {dat.foto && <img className="w-[3rem] h-[3rem] border-solid border-1 rounded-full" src={dat.foto} alt="" />}
                {!dat.foto && (
                <div className="w-[3rem] h-auto rounded-full bg-gray-100 border-solid border-1 text-white" data-bs-toggle="tooltip" data-bs-title="Ver perfil">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                </div>
                )}
                <p>{dat.usuario}</p>
            </div>
            <div className='flex gap-3'>
            <button className='bg-primary text-white rounded-[5px] px-[1rem] py-[0.3rem] flex gap-1' onClick={()=>{openModal(),setUserSelected(dat.usuario)}}>
            <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
</svg>
Editar
            </button>
            <button  className='bg-[red] text-white rounded-[5px] px-[1rem] py-[0.3rem] flex gap-1' onClick={() => deleteUser(dat.usuario)}>
            <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
</svg>
 Eliminar
            </button>
            </div>
        </div>
    ))}
    </div>
    )}
    </div>
    
</div>
</>
);}
