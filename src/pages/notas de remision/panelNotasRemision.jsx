import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import ModalEdit from '../../components/modalEdit';
import Modal_create_users from '../../components/modalNotasRemision/crearNotasRemision';
import foto_user from '../../images/foto_user_empty.jpg'
import Swal from 'sweetalert2';
import { FaFilePdf, FaEdit, FaTrash } from 'react-icons/fa';

export default function panelNotasRemision() {
  const [datas, setDatas] = useState([]);
  const [user_selected, setUserSelected] = useState();
  const [current_page, setCurrent_page] = useState(parseInt(localStorage.getItem('usuarios_current_page')) || 1);
  const [itemsPerPage] = useState(4);
  const [loading, setLoading] = useState(true);
  const [modaEdit, setModalEdit] = useState(false);
  const [modal_create, setModal_create] = useState(false);

  function openModal() {
    window.scrollTo(0, 0);
    setModalEdit(true);
  }
  function closeModal() {
    setModalEdit(false);
    window.location.reload();
  }
  function openModal2() {
    setModal_create(true);
  }
  function closeModal2() {
    setModal_create(false);
    window.location.reload();
  }

  async function get() {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/');
      setDatas(data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching image data:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    get();
  }, []);

  async function deleteNota(_id) {
    const confirmation = await Swal.fire({
      title: `¿Estás seguro de eliminar esta nota de remisión?`,
      text: 'Si la eliminas, la información de la nota se perderá permanentemente.',
      showDenyButton: true,
      confirmButtonText: 'Sí, eliminar',
      denyButtonText: 'No, cancelar',
      confirmButtonColor: '#d33',
      denyButtonColor: '#B0B0B0',
    });
    try {
      if (confirmation.isConfirmed === true) {
        // Enviar _id por el body usando método POST (o DELETE con body si el backend lo permite)
        const { data } = await axios.delete(
          'https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/delete',
          { data: { _id } }
        );
        await get();
        Swal.fire({
          icon: 'success',
          text: 'La nota de remisión ha sido eliminada con éxito',
          timer: 1500,
        });
        window.location.reload()
        return data.response
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al eliminar la nota de remisión. Intenta nuevamente.',
        timer: 1500,
      });
    }
  }

  const indexOfLastItem = current_page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = datas?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(datas.length / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrent_page(page);
    }
  };

  const generatePaginationButtons = () => {
    let buttons = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      const startPage = Math.max(2, current_page - 1);
      const endPage = Math.min(totalPages - 1, current_page + 1);
      buttons.push(1);
      if (startPage > 2) {
        buttons.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }
      if (endPage < totalPages - 1) {
        buttons.push("...");
      }
      buttons.push(totalPages);
    }
    return buttons;
  };

  useEffect(() => {
    if (current_page) {
      localStorage.setItem('usuarios_current_page', current_page);
    }
  }, [current_page]);

  return (
    <>
      {modaEdit && (
        <ModalEdit closeModal={closeModal} usuario={user_selected} gett={get} />
      )}
      {modal_create && (
        <Modal_create_users closeModal2={closeModal2} gett={get} />
      )}
      <Navbar />
      <div className="flex flex-col bg-[#ececec] w-full min-h-screen">
        <div className="bg-white py-4 flex justify-between items-center px-4 lg:px-8 shadow-sm">
          <p className="text-[#2D76B5] font-bold text-lg lg:text-2xl">Panel de Notas de Remisión</p>
          <a
            href='/create_notas'
            className="bg-[#46af46] text-white font-semibold px-4 py-2 rounded-[15px] hover:bg-green-700 transition"
          >
            + Generar nota de Remisión
          </a>
        </div>
        <div className="w-full flex flex-col py-6 gap-2 px-2 lg:px-8">
          <div className="mb-4">
            <p className="font-semibold text-xl text-[#4a4a4a]">Notas de Remisión Manuales</p>
            <div className="form-text">En este apartado podrás buscar, eliminar o descargar tus PDF de notas de remisión.</div>
          </div>
          {loading ? (
            <div className="flex flex-col gap-2 text-center items-center py-10">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : datas.length === 0 ? (
            <div className="text-center text-lg py-10">
              <p>No se encontraron notas de remisión</p>
              <button onClick={() => window.location.reload()} className="bg-primary text-white font-semibold px-4 py-2 rounded mt-4">Refrescar</button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              {/* TABLA DESKTOP MEJORADA */}
              <table className="min-w-full lg:table hidden bg-white rounded-lg overflow-hidden shadow border">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-300 text-[#2D76B5]">
                    <th className="py-4 px-6 text-left font-bold border-b border-blue-200">Cliente</th>
                    <th className="py-4 px-6 text-center font-bold border-b border-blue-200">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((dat, idx) => (
                    <tr
                      key={dat._id}
                      className={`transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
                    >
                      <td className="py-3 px-6 border-b border-blue-100 text-gray-800 text-base">{dat.nombre || '-'}</td>
                      <td className="py-3 px-6 border-b border-blue-100 flex gap-4 justify-center items-center">
                        {/*
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
                          title="Editar"
                          onClick={() => { openModal(); setUserSelected(dat._id); }}
                        >
                          <FaEdit size={18} />
                        </button>
                        */}
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                          title="Eliminar"
                          onClick={() => deleteNota(dat._id)}
                        >
                          <FaTrash size={18} />
                        </button>
                        <a
                          href={`/pdf_nota/${dat._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                          title="Descargar PDF"
                        >
                          <FaFilePdf size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* MOBILE CARDS */}
              <div className="flex flex-col gap-4 lg:hidden">
                {currentItems.map((dat, idx) => (
                  <div
                    key={dat._id || idx}
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-base text-[#2D76B5] mb-1">{dat.nombre || '-'}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end mt-2">
                      {/*
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
                        title="Editar"
                        onClick={() => { openModal(); setUserSelected(dat._id); }}
                      >
                        <FaEdit size={18} />
                      </button>
                      */}
                      <button
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                        title="Eliminar"
                        onClick={() => deleteNota(dat._id)}
                      >
                        <FaTrash size={18} />
                      </button>
                      <a
                        href={dat.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                        title="Descargar PDF"
                      >
                        <FaFilePdf size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {/* PAGINACIÓN */}
              <div className="flex justify-center gap-2 mt-4 pb-4">
                {generatePaginationButtons().map((button, index) =>
                  button === "..." ? (
                    <span key={index} className="px-3 py-1 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded ${current_page === button ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                      onClick={() => changePage(button)}
                    >
                      {button}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
