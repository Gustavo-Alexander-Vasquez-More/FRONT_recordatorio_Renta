import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { uploadFoto } from "../../firebase/images.js";

export default function modal_edit_product({ _id, closeModal, gett }) {
  const [datas, setDatas] = useState([]);
  const [foto, setFoto] = useState();
  const [foto_temporal, setFoto_temporal] = useState();
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState();
  const [stock, setStock] = useState();
 const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(""); // "" si no tiene
  const [descripcion, setDescripcion] = useState();
  const [precio_renta, setPrecio_renta] = useState();
  const [precio_venta, setPrecio_venta] = useState();
  const [visibilidad_precio_venta, setVisibilidad_precio_venta] = useState();
  const [visibilidad_precio_renta, setVisibilidad_precio_renta] = useState();
  const [codigo, setCodigo] = useState();
  const [disponibilidad, setDisponibilidad] = useState([]); // Cambiado de tipo_uso a disponibilidad
  const [modal_change_foto, setModal_change_foto] = useState(false);
  const [editField, setEditField] = useState(null); // Campo actualmente en edición
  const input_foto = useRef();

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto_temporal(file); // Actualiza la previsualización de la foto
    }
  };

  function openModal_change_foto() {
    setModal_change_foto(true);
  }

  function closeModal_change_foto() {
    setModal_change_foto(false);
  }

  async function get() {
    try {
      const { data } = await axios.get(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${_id}`
      );
      setDatas(data.response);
      setNombre(data.response[0].nombre);
      setStock(data.response[0].stock);
      setPrecio_renta(data.response[0].precio_renta); // Cambiado de precio a precio_renta
      setPrecio_venta(data.response[0].precio_venta);
      setDisponibilidad(data.response[0].disponibilidad || []); // Cargar disponibilidad
      setVisibilidad_precio_renta(data.response[0].visibilidad_precio_renta);
      setVisibilidad_precio_venta(data.response[0].visibilidad_precio_venta);
      setCategoriaSeleccionada(data.response[0].categoria || "");
      setCodigo(data.response[0].codigo);
      setDescripcion(data.response[0].descripcion);
      setFoto(data.response[0].foto);
      setLoading(false); // Desactivar el loader cuando los datos se han cargado
    } catch (error) {
      console.error("Error fetching product data:", error);
      setLoading(false); // También desactivar el loader en caso de error
    }
  }

async function getCategorias() {
  try {
    const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/categorias/`);
    setCategoriasDisponibles(data.response);
  } catch (error) {
    console.log(error);
  }
}
  async function editarFoto_perfil(e) {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
    const file = foto_temporal
    console.log(file);
    const foto_url=await uploadFoto(file)
console.log(foto_url);
  try {
      
        const datos={
          foto:foto_url || ''
        }
        console.log(datos.foto);
        await axios.put(
          `https://backrecordatoriorenta-production.up.railway.app/api/products/update/${_id}`, datos,
          { headers: { 'Content-Type': 'application/json' } }
        );
      setFoto(foto_url)
        await gett()
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
      closeModal_change_foto()

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }


  async function editarProducto(tipo_dato, valor) {
    Swal.fire({
      title: "Guardando cambios...",
      text: "Por favor espere...",
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      },
    });

    try {
      const datos = {
        [tipo_dato]: valor,
      };
      await axios.put(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/update/${_id}`,
        datos,
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.close();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cambios guardados",
        showConfirmButton: false,
        timer: 1500,
      });
      await gett();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al guardar los cambios!",
      });
    }
  }

  const formatPrice = (value) => {
    // Permitir números y un solo punto decimal
    value = value.replace(/[^0-9.]/g, ''); // Mantener números y el punto
    if (value.split('.').length > 2) {
      value = value.replace(/\.+$/, ''); // Eliminar puntos adicionales
    }
  
    const parts = value.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Formatear miles
  
    // Si hay una parte decimal, limitar a dos dígitos
    const decimalPart = parts[1] !== undefined ? `.${parts[1].slice(0, 2)}` : '';
  
    return integerPart + decimalPart;
  };
  const formatPrice2 = (value) => {
    // Permitir números y un solo punto decimal
    value = value.replace(/[^0-9.]/g, ''); // Mantener números y el punto
    if (value.split('.').length > 2) {
      value = value.replace(/\.+$/, ''); // Eliminar puntos adicionales
    }
  
    const parts = value.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Formatear miles
  
    // Si hay una parte decimal, limitar a dos dígitos
    const decimalPart = parts[1] !== undefined ? `.${parts[1].slice(0, 2)}` : '';
  
    return integerPart + decimalPart;
  };
  // Manejar el cambio del input
  const handleChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatPrice(value);
    setPrecio_renta(formattedValue); // Cambiado de setPrecio a setPrecio_renta
  };
  const handleChange2 = (e) => {
    const value = e.target.value;
    const formattedValue = formatPrice2(value);
    setPrecio_venta(formattedValue);
  };
  const handleChange3 = (e) => {
    const value = e.target.value;
    setVisibilidad_precio_renta(value);
  };
  const handleChange4 = (e) => {
    const value = e.target.value;
    setVisibilidad_precio_venta(value);
  };
  useEffect(() => {
    get();
    getCategorias()
  }, []);
  function handleEnterPress(event, valor, dato) {
    if (event.key === 'Enter') {
      editarProducto(valor, dato)
      setEditField(null); // Salir del modo edición
    }
  }

  const handleDisponibilidadChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      // Agregar el valor seleccionado al array
      setDisponibilidad((prev) => [...prev, value]);
    } else {
      // Remover el valor deseleccionado del array
      setDisponibilidad((prev) => prev.filter((item) => item !== value));
    }
  };

  return (
    <>
    {modal_change_foto === true && (
        <div className="w-full h-full absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
          <div className='flex flex-col items-center w-[90%] lg:w-[35%] gap-3 bg-white py-[1rem] px-[1rem]'>
            <p className=' font-semibold'>Selecciona una nueva foto</p>
            <input ref={input_foto} onChange={handleFotoChange}  class="form-control" type="file" id="formFile"/>
            <div className='flex w-full justify-between'>
            <button  onClick={editarFoto_perfil} className='bg-success text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Guardar</button>
            <button  onClick={closeModal_change_foto} className='bg-[#808080] text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full lg:h-screen absolute z-40 bg-[#d9d9d97b] flex lg:py-0 py-[2rem] justify-center items-center">
        <div className="bg-white rounded-[10px] w-[90%] lg:w-[45%] h-[90vh] overflow-y-auto flex flex-col">
          <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid'>
            <p className='text-white font-semibold'>Editar productos</p>
            <button onClick={closeModal}>
              <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
          </div>
          
            <div className='w-full flex py-[1rem] gap-4 lg:flex-row flex-col '>
            {/* //PARTE DE LA foto */}
            <div className='lg:w-[30%] w-full flex justify-center'>
              <div className='w-full items-center gap-2 flex flex-col'>
                <img src={foto} className="w-[7rem] h-[7rem] rounded-full" />
                <button onClick={openModal_change_foto} className='flex gap-1 items-center bg-[#808080]  px-[1rem] rounded-[5px] py-[0.3rem] justify-center text-white'><svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
  </svg> Cambiar foto
  </button>
              </div>
            </div>
            <div className='w-full lg:w-[70%] px-[1.5rem]'>
              <p className='font-semibold text-[1.3rem] underline pb-3'>Datos del producto</p>
              <div className='flex flex-col'>
        
    <div className="mb-2">
    <label htmlFor="exampleInputEmail1" className="form-label">
      Nombre del producto
    </label>
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-1">
        {/* Input deshabilitado dinámicamente */}
        <input
          placeholder="Escribe el nuevo nombre"
          value={nombre}
          onKeyPress={(event)=>{handleEnterPress(event,'nombre',nombre)}}
          onChange={(e) => setNombre(e.target.value)}
          type="text"
          className={`form-control ${editField !== "nombre" ? 'bg-gray-200 cursor-not-allowed' : ''}`}
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          disabled={editField !== "nombre"} // Deshabilitado si no se está editando
        />
        {/* Botón para habilitar la edición */}
        <button
          className="flex gap-1 items-center underline"
          onClick={() => {setEditField("nombre")}}
        >
          <svg
            className="w-6 h-6 text-[#808080]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
            />
          </svg>
        </button>
      </div>
      {/* Botones de guardar/cancelar */}
      {editField === "nombre" && (
        <div className="flex gap-2 text-[0.8rem]">
          <button
            onClick={() => {setEditField(null)}} // Cancelar y deshabilitar
            className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  </div>
  <div className="mb-2">
  <label htmlFor="disponibilidad" className="form-label">
    Disponibilidad del producto
  </label>
  <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-1">
      {/* Checkbox para "renta" */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          value="renta"
          checked={disponibilidad.includes("renta")}
          onChange={(e) => {
            handleDisponibilidadChange(e);
            setEditField("disponibilidad"); // Activar el botón de guardar cambios
          }}
        />
        Renta
      </label>

      {/* Checkbox para "venta" */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          value="venta"
          checked={disponibilidad.includes("venta")}
          onChange={(e) => {
            handleDisponibilidadChange(e);
            setEditField("disponibilidad"); // Activar el botón de guardar cambios
          }}
        />
        Venta
      </label>
    </div>

    {/* Botón para guardar cambios */}
    {editField === "disponibilidad" && (
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
        onClick={() => {
          editarProducto("disponibilidad", disponibilidad);
          setEditField(null); // Desactivar el botón después de guardar
        }}
      >
        Guardar cambios
      </button>
    )}
  </div>
</div>

  <div className="mb-2">
      <label htmlFor="exampleInputEmail1" className="form-label">
        Precio de renta del producto
      </label>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex gap-1">
          {/* Input deshabilitado dinámicamente */}
          <input
            placeholder="Escribe el nuevo precio de renta"
            onKeyPress={(event)=>{handleEnterPress(event,'precio_renta',precio_renta)}}
            value={precio_renta}
            onChange={handleChange}
            type="text"
            className={`form-control ${
              editField !== "precio_renta" ? 'bg-gray-200 cursor-not-allowed' : ''
            }`}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            disabled={editField !== "precio_renta"} // Deshabilitado si no se está editando
          />
          {/* Botón para habilitar la edición */}
          <button
            className="flex gap-1 items-center underline"
            onClick={() => setEditField("precio_renta")}
          >
            <svg
              className="w-6 h-6 text-[#808080]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
          </button>
        </div>
        {/* Botones de guardar/cancelar */}
        {editField === "precio_renta" && (
          <div className="flex gap-2 text-[0.8rem]">
            <button
              onClick={() => {
                setEditField(null) // Restaurar precio original
              }}
              className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="mb-2">
  <label htmlFor="visibilidad_precio_renta" className="form-label">
    Visibilidad actual del precio de renta
  </label>
  <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-1">
      {/* Select deshabilitado dinámicamente */}
      <select
        id="visibilidad_precio_renta"
        value={visibilidad_precio_renta}
        onKeyPress={(event) => {
          handleEnterPress(event, 'visibilidad_precio_renta', visibilidad_precio_renta);
        }}
        onChange={handleChange3}
        className={`form-control ${
          editField !== "visibilidad_precio_renta" ? 'bg-gray-200 cursor-not-allowed' : ''
        }`}
        disabled={editField !== "visibilidad_precio_renta"}
      >
        <option value="VISIBLE">VISIBLE</option>
        <option value="NO VISIBLE">NO VISIBLE</option>
      </select>
      <button
        className="flex gap-1 items-center underline"
        onClick={() => setEditField("visibilidad_precio_renta")}
      >
        <svg
          className="w-6 h-6 text-[#808080]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
    </div>
    {editField === "visibilidad_precio_renta" && (
      <div className="flex gap-2 text-[0.8rem]">
        <button
          onClick={() => {
            setEditField(null);
          }}
          className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
        >
          Cancelar
        </button>
      </div>
    )}
  </div>
</div>


    <div className="mb-2">
      <label htmlFor="exampleInputEmail1" className="form-label">
        Precio de venta del producto
      </label>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex gap-1">
          {/* Input deshabilitado dinámicamente */}
          <input
            placeholder="Escribe el nuevo precio de venta"
            onKeyPress={(event)=>{handleEnterPress(event,'precio_venta',precio_venta)}}
            value={precio_venta}
            onChange={handleChange2}
            type="text"
            className={`form-control ${
              editField !== "precio_venta" ? 'bg-gray-200 cursor-not-allowed' : ''
            }`}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            disabled={editField !== "precio_venta"} // Deshabilitado si no se está editando
          />
          {/* Botón para habilitar la edición */}
          <button
            className="flex gap-1 items-center underline"
            onClick={() => setEditField("precio_venta")}
          >
            <svg
              className="w-6 h-6 text-[#808080]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
          </button>
        </div>
        {/* Botones de guardar/cancelar */}
        {editField === "precio_venta" && (
          <div className="flex gap-2 text-[0.8rem]">
            <button
              onClick={() => {
                setEditField(null) // Restaurar precio original
              }}
              className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="mb-2">
  <label htmlFor="visibilidad_precio_venta" className="form-label">
    Visibilidad actual del precio de venta
  </label>
  <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-1">
      {/* Select deshabilitado dinámicamente */}
      <select
        id="visibilidad_precio_venta"
        value={visibilidad_precio_venta}
        onChange={handleChange4}
        onKeyPress={(event)=>{handleEnterPress(event,'visibilidad_precio_venta',visibilidad_precio_venta)}}
        className={`form-control ${
          editField !== "visibilidad_precio_venta" ? 'bg-gray-200 cursor-not-allowed' : ''
        }`}
        disabled={editField !== "visibilidad_precio_venta"} // Deshabilitado si no se está editando
      >
        <option value="VISIBLE">VISIBLE</option>
        <option value="NO VISIBLE">NO VISIBLE</option>
      </select>

      {/* Botón para habilitar la edición */}
      <button
        className="flex gap-1 items-center underline"
        onClick={() => setEditField("visibilidad_precio_venta")}
      >
        <svg
          className="w-6 h-6 text-[#808080]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
    </div>

    {/* Botones de guardar/cancelar */}
    {editField === "visibilidad_precio_venta" && (
      <div className="flex gap-2 text-[0.8rem]">
        <button
          onClick={() => {
            setEditField(null) // Cancelar edición
          }}
          className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
        >
          Cancelar
        </button>
      </div>
    )}
  </div>
</div>


  <div className="mb-2">
    <label htmlFor="exampleInputEmail1" className="form-label">
      Código del producto
    </label>
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-1">
        {/* Input deshabilitado dinámicamente */}
        <input
          placeholder="Escribe el nuevo código"
          value={codigo}
          onKeyPress={(event)=>{handleEnterPress(event,'codigo',codigo)}}
          onChange={(e) => setCodigo(e.target.value)}
          type="text"
          className={`form-control ${editField !== "codigo" ? 'bg-gray-200 cursor-not-allowed' : ''}`}
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          disabled={editField !== "codigo"} // Deshabilitado si no se está editando
        />
        {/* Botón para habilitar la edición */}
        <button
          className="flex gap-1 items-center underline"
          onClick={() => setEditField("codigo")}
        >
          <svg
            className="w-6 h-6 text-[#808080]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
        </button>
      </div>
      {/* Botones de guardar/cancelar */}
      {editField === "codigo" && (
        <div className="flex gap-2 text-[0.8rem]">
          <button
            onClick={() => {setEditField(null)}} // Cancelar y deshabilitar
            className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  </div>

  <div className="mb-2">
    <label htmlFor="exampleInputRol" className="form-label">
      Stock
    </label>
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-1">
        {/* Input deshabilitado dinámicamente */}
        <input
          placeholder="Escribe el nuevo rol"
          value={stock}
          onKeyPress={(event)=>{handleEnterPress(event,'stock',stock)}}
          onChange={(e) => setStock(e.target.value)}
          type="number"
          className={`w-full border rounded p-2 ${editField !== "stock" ? 'bg-gray-200 cursor-not-allowed' : ''}`}
          id="exampleInputRol"
          aria-describedby="emailHelp"
          disabled={editField !== "stock"} // Deshabilitado si no se está editando
        />
        {/* Botón para habilitar la edición */}
        <button
          className="flex gap-1 items-center underline"
          onClick={() => setEditField("stock")} // Habilitar la edición
        >
          <svg
            className="w-6 h-6 text-[#808080]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
            />
          </svg>
        </button>
      </div>
      {/* Botones de guardar/cancelar */}
      {editField === "stock" && (
        <div className="flex gap-2 text-[0.8rem]">
          <button
            onClick={() => {setEditField(null)}} // Cancelar y deshabilitar
            className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  </div>
  
  <div className="mb-2">
    <label htmlFor="exampleInputEmail1" className="form-label">
      Descripcion del producto
    </label>
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-1">
        {/* Input deshabilitado dinámicamente */}
        <textarea
          placeholder="Escribe el nuevo nombre"
          value={descripcion}
          onKeyPress={(event)=>{handleEnterPress(event,'descripcion',descripcion)}}
          onChange={(e) => setDescripcion(e.target.value)}
          type="text"
          className={`form-control ${editField !== "descripcion" ? 'bg-gray-200 cursor-not-allowed' : ''}`}
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          disabled={editField !== "descripcion"} // Deshabilitado si no se está editando
        />
        {/* Botón para habilitar la edición */}
        <button
          className="flex gap-1 items-center underline"
          onClick={() => setEditField("descripcion")}
        >
          <svg
            className="w-6 h-6 text-[#808080]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
            />
          </svg>
        </button>
      </div>
      {/* Botones de guardar/cancelar */}
      {editField === "descripcion" && (
        <div className="flex gap-2 text-[0.8rem]">
          <button
            onClick={() => {setEditField(null)}} // Cancelar y deshabilitar
            className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  </div>

  <div className="mb-2">
  <label htmlFor="categoriaSelect" className="form-label">
    Categoría del producto
  </label>
  <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-1">
      {/* Select deshabilitado dinámicamente */}
     <select
  id="categoriaSelect"
  value={categoriaSeleccionada}
  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
  onKeyPress={(event) => handleEnterPress(event, 'categoria', categoriaSeleccionada)}
  className={`form-control ${editField !== "categoria" ? 'bg-gray-200 cursor-not-allowed' : ''}`}
  disabled={editField !== "categoria"}
>
  <option value="" disabled>Añadir categoría</option>
  {categoriasDisponibles.map((cat) => (
    <option key={cat._id || cat.id || cat.nombre} value={cat.nombre}>
      {cat.nombre}
    </option>
  ))}
</select>
      {/* Botón para habilitar la edición */}
      <button
        className="flex gap-1 items-center underline"
        onClick={() => setEditField("categoria")}
      >
        <svg
          className="w-6 h-6 text-[#808080]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
    </div>
    {/* Botones de guardar/cancelar */}
    {editField === "categoria" && (
      <div className="flex gap-2 text-[0.8rem]">
        <button
          onClick={() => setEditField(null)}
          className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
        >
          Cancelar
        </button>
      </div>
    )}
  </div>
</div>

    <div class="pb-4 pt-[1rem] flex justify-between">
    <button onClick={closeModal} className='bg-[#808080] px-[1rem] py-[0.3rem] text-white font-semibold rounded-[5px]'>Cerrar</button>
    </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      </>
  );
}
