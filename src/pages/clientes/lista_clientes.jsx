import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import Modal_estado_renta from '../../components/modal_estado_renta';
import Modal_recibido from '../../components/modal_recibido';
import axios from 'axios';
import  Modal_detalle from '../../components/edit_clientes_modal'

import Swal from 'sweetalert2';
export default function lista_clientes() {
  const [datas, setDatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal_detalle, setModalDetalle]=useState(false)
  const [modal_estado, setModalEstado]=useState(false)
  const [modal_recibido, setModalRecibido]=useState(false)
  const [estado, setEstado]=useState()
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [client_selected, setClient_selected]=useState()
  const [_id, setId]=useState()
  const [loading, setLoading] = useState(true); // Estado de carga

function openModal(){
  setModalDetalle(true)
}
function closeModal(){
  window.location.reload()
  setModalDetalle(false)
}
function openModal_estado(){
  setModalEstado(true)
}
function closeModal_estado(){
  setModalEstado(false)
}
function openModal_recibido(){
  setModalRecibido(true)
}
function closeModal_recibido(){
  setModalRecibido(false)
}

  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [datas]);

  async function get() {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients/');
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
  async function deleteClient(_id) {
    try {
      const datitos = { _id: _id };
      if (datitos._id) {
        const confirmation = await Swal.fire({
          title: `¿Estás seguro de eliminar este cliente, no se podrá recuperar?`,
          showDenyButton: true,
          confirmButtonText: 'Sí',
          denyButtonText: 'No',
          confirmButtonColor: '#3085d6',
          denyButtonColor: '#d33',
        });
  
        if (confirmation.isConfirmed) {
          Swal.fire({
            title: 'Cargando, por favor espere...',
            didOpen: () => {
              Swal.showLoading();
            }
          });
  
          await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/clients/delete', {
            data: datitos,
          });
  
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'se ha eliminado',
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo eliminar',
          timer: 1500,
        });
      }
    } catch (error) {
      console.log('Error al eliminar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al eliminar',
        timer: 1500,
      });
    }
  }
  


  return (
<>
  {modal_detalle === true && (
    <Modal_detalle closeModal={closeModal} _id={_id} nombre={client_selected}/>
  )}
  
  <Navbar/>
  
  <div className='flex w-full'>
  <div className='w-full h-full overflow-y-auto overflow-x-auto bg-[white] flex flex-col'>
  <table className="table-auto w-full border-separate  text-[0.7rem]">
  <thead>
    <tr className="bg-[#9B8767] text-white text-center">
      <th className="px-2 py-1  whitespace-nowrap">Nombre</th>
      <th className="px-2 py-1 whitespace-nowrap">Celular del arrendador</th>
      <th className="px-2 py-1 whitespace-nowrap">INE DELANTERO</th>
      <th className="px-2 py-1 whitespace-nowrap">INE TRASERO</th>
      <th className="px-2 py-1  whitespace-nowrap">Editar/Eliminar</th>
    </tr>
  </thead>
  <tbody>
    {datas.map((dat) => (
      <tr key={dat._id} className="text-center  ">
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">{dat.nombre}</td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">{dat.telefono}</td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]"><a href={dat.foto_ine_delantero} className='bg-primary px-[1rem] py-[0.3rem] text-white rounded-[5px]' target='_blank'>Ver</a></td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]"><a href={dat.foto_ine_trasero} className='bg-primary px-[1rem] py-[0.3rem] text-white rounded-[5px]' target='_blank'>Ver</a></td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">
          <button className='px-2' onClick={() => { openModal(); setId(dat._id); setClient_selected(dat.nombre) }} 
                  data-bs-toggle="tooltip" 
                  data-bs-title="Editar">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-wide" viewBox="0 0 16 16">
  <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"/>
</svg>
          </button>
          <button className='px-2' onClick={() => deleteClient(dat._id)} 
                  data-bs-toggle="tooltip" 
                  data-bs-title="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


 </div>

  </div>
</>
  );
}
