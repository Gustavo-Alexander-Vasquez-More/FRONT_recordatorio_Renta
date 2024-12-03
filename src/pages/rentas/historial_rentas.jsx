import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import Modal_estado_renta from '../../components/modal_estado_renta';
import Modal_recibido from '../../components/modal_recibido';
import axios from 'axios';
import  Modal_detalle from '../../components/modal_detalle'
import Swal from 'sweetalert2';
export default function historial_rentas() {
  const [datas, setDatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal_detalle, setModalDetalle]=useState(false)
  const [modal_estado, setModalEstado]=useState(false)
  const [modal_recibido, setModalRecibido]=useState(false)
  const [estado, setEstado]=useState()
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [_id, setId]=useState()
  const [loading, setLoading] = useState(true); // Estado de carga

function openModal(){
  setModalDetalle(true)
}
function closeModal(){
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
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/rentas/');
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
  async function deleteRenta(_id) {
    try {
      const datitos = { _id: _id };
      if (datitos._id) {
        const confirmation = await Swal.fire({
          title: `¿Estás seguro de eliminar este producto?`,
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
  
          const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`);
          const datis = data.response?.[0];
          const productos = datis?.productos;
  
          // Solo actualiza el stock si el estado de la renta es diferente de 'Entregado'
          if (datis.estado_renta !== 'Entregado') {
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
          }
  
          // Eliminar la renta
          await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/rentas/delete', {
            data: datitos,
          });
  
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'La renta se ha eliminado',
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo eliminar esta Renta',
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
  {modal_detalle === true && (
    <Modal_detalle closeModal={closeModal} _id={_id}/>
  )}
  {modal_estado === true && (
    <Modal_estado_renta closeModal_estado={closeModal_estado} estado={estado}/>
  )}
   {modal_recibido === true && (
    <Modal_recibido closeModal_recibido={closeModal_recibido} _id={_id}/>
  )}
  <Navbar/>
  
  <div className='flex w-full'>
  <div className='w-full h-full overflow-y-auto overflow-x-auto bg-[white] flex flex-col'>
  <table className="table-auto w-full border-separate  text-[0.7rem]">
  <thead>
    <tr className="bg-[#9B8767] text-white text-center">
      <th className="px-2 py-1 whitespace-nowrap">Celular del arrendador</th>
      <th className="px-2 py-1  whitespace-nowrap">Encargado</th>
      <th className="px-2 py-1  whitespace-nowrap">Fecha de alta</th>
      <th className="px-2 py-1  whitespace-nowrap">Vencimiento</th>
      <th className="px-2 py-1  whitespace-nowrap">Importe</th>
      <th className="px-2 py-1  whitespace-nowrap">Estado</th>
      <th className="px-2 py-1  whitespace-nowrap">Recibir/Detalles/Eliminar</th>
    </tr>
  </thead>
  <tbody>
    {datas.map((dat) => (
      <tr key={dat._id} className="text-center  ">
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">{dat.celular_cliente}</td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">{dat.usuario_retandor}</td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">{dat.fecha_renta} {dat.hora_renta}</td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">{dat.fecha_vencimiento}</td>
        <td className="px-2 py-1 border-[1px] whitespace-nowrap border-solid border-[black]">${dat.importe_total}</td>
        <td className="px-2 py-2 border-[1px] whitespace-nowrap border-solid border-[black] flex justify-center text-center">
          {dat.estado_renta === 'Activo' && (
            <button onClick={() => { openModal_estado(); setEstado(dat.estado_renta); }} 
                    className="underline flex text-center items-center justify-center gap-1">
              <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-[#22fd22]"></div>
              {dat.estado_renta}
            </button>
          )}
          {dat.estado_renta === 'Entregado' && (
            <button onClick={() => { openModal_estado(); setEstado(dat.estado_renta); }} 
                    className="underline flex text-center items-center justify-center gap-1">
              <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-[#3025ff]"></div>
              {dat.estado_renta}
            </button>
          )}
          {dat.estado_renta === 'Vencido' && (
            <button onClick={() => { openModal_estado(); setEstado(dat.estado_renta); }} 
                    className="underline flex text-center items-center justify-center gap-1">
              <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-[#ff2525]"></div>
              {dat.estado_renta}
            </button>
          )}
        </td>
        <td className="px-2 py-1 border-[1px]  whitespace-nowrap border-solid border-[black]">
          <button className='px-2' onClick={() => { openModal_recibido(); setId(dat._id); }} 
                  data-bs-toggle="tooltip" 
                  data-bs-title="Marcar como recibido">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-plus" viewBox="0 0 16 16">
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zM4 1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5V8a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
          <button className='px-2' onClick={() => { openModal(); setId(dat._id); }} 
                  data-bs-toggle="tooltip" 
                  data-bs-title="Mirar detalles de la renta">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-exclamation" viewBox="0 0 16 16">
              <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0m0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
            </svg>
          </button>
          <button className='px-2' onClick={() => deleteRenta(dat._id)} 
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
