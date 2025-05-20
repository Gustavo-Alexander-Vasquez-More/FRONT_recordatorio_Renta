import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import { uploadFoto } from '../../firebase/images.js';
import Select from 'react-select';

export default function modal_create_products({ closeModal2 }) {
  const notyf = new Notyf({
    position: {
      x: 'center',
      y: 'top',
    },
    duration: 3500
  });
  const [nombre, setNombre] = useState()
  const [codigo, setCodigo] = useState()
  const [precio, setPrecio] = useState()
  const [stock, setStock] = useState()
  const [descripcion, setDescripcion] = useState()
  const [precio_venta, setPrecio_venta] = useState()
  const [precio_x_semana, setPrecio_x_semana] = useState()
  const [tags, setTags] = useState([])
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [precios_visibles, setPrecios_visibles] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSeleccionada] = useState(null);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const input_nombre = useRef()
  const input_tag = useRef()
  const input_codigo = useRef()
  const input_precio = useRef()
  const input_precio_venta = useRef()
  const input_sotck = useRef()
  const input_foto = useRef()
  const input_descripcion = useRef()
  const input_precio_x_semana = useRef()
  const input_categoria_seleccionada = useRef()

useEffect(() => {
  async function fetchCategorias() {
    try {
      const { data } = await axios.get("https://backrecordatoriorenta-production.up.railway.app/api/categorias/");
      setCategorias(data.response || []);
    } catch (error) {
      notyf.error("No se pudieron cargar las categorías");
    }
  }
  fetchCategorias();
}, []);

  function captureTags(event) {
    // Captura el valor del textarea y lo convierte en array de tags
    setTags(event.target.value.split("\n").filter(tag => tag.trim() !== ""));
  }
  function capturePrecio_x_semana(event) {
    let value = event.target.value;

    // Eliminar caracteres no numéricos (excepto el punto decimal)
    value = value.replace(/[^0-9.]/g, '');

    // Si contiene un punto, lo separamos en parte entera y decimal
    if (value.includes('.')) {
      let [entero, decimales] = value.split('.');

      // Formateamos la parte entera con comas para los miles
      entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Actualizamos el estado con la parte entera y los decimales
      setPrecio_x_semana(`${entero}.${decimales}`);
    } else {
      // Si no contiene punto, solo formateamos la parte entera con comas
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio_x_semana(value);
    }
  }
  function captureCategoria() {
    setCategoriaSeleccionada(input_categoria_seleccionada.current.value)
  }
  function captureNombre() {
    setNombre(input_nombre.current.value)
  }
  function captureCodigo() {
    setCodigo(input_codigo.current.value)
  }
  function captureDescripcion() {
    setDescripcion(input_descripcion.current.value)
  }
  function capturePrecio(event) {
    let value = event.target.value;

    // Eliminar caracteres no numéricos (excepto el punto decimal)
    value = value.replace(/[^0-9.]/g, '');

    // Si contiene un punto, lo separamos en parte entera y decimal
    if (value.includes('.')) {
      let [entero, decimales] = value.split('.');

      // Formateamos la parte entera con comas para los miles
      entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Actualizamos el estado con la parte entera y los decimales
      setPrecio(`${entero}.${decimales}`);
    } else {
      // Si no contiene punto, solo formateamos la parte entera con comas
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio(value);
    }
  }
  function capturePrecio_venta(event) {
    let value = event.target.value;

    // Eliminar caracteres no numéricos (excepto el punto decimal)
    value = value.replace(/[^0-9.]/g, '');

    // Si contiene un punto, lo separamos en parte entera y decimal
    if (value.includes('.')) {
      let [entero, decimales] = value.split('.');

      // Formateamos la parte entera con comas para los miles
      entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Actualizamos el estado con la parte entera y los decimales
      setPrecio_venta(`${entero}.${decimales}`);
    } else {
      // Si no contiene punto, solo formateamos la parte entera con comas
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio_venta(value);
    }
  }

  const handleChange = (e) => {
    capturePrecio(e); // Aplicar el formateo en vivo
  };
  const handleChange2 = (e) => {
    capturePrecio_venta(e); // Aplicar el formateo en vivo
  };
  const handleChange3 = (e) => {
    capturePrecio_x_semana(e); // Aplicar el formateo en vivo
  };
  function captureStock() {
    setStock(input_sotck.current.value);
  }

  async function crear_products() {
    Swal.fire({
      title: 'Cargando, por favor espere...',
      didOpen: () => {
        Swal.showLoading(); // Mostrar el spinner de carga
      },
    });

    // Validación de campos obligatorios
    if (
      !nombre ||
      !codigo ||
      !precio ||
      !descripcion ||
      !stock 
      // !categoriaSelecionada 
    ) {
      Swal.close();
      notyf.error('Por favor complete los campos obligatorios');
      return; // Detener la ejecución
    }

    let fotoURL = '';
    const selectedFile = input_foto.current.files[0];
    if (selectedFile) {
      try {
        fotoURL = await uploadFoto(selectedFile); // Sube la foto y obtiene la URL
        console.log('URL de descarga:', fotoURL);
      } catch (error) {
        notyf.error('Error al subir la foto. Intente nuevamente.');
        return;
      }
    }

    const datos = {
      nombre: nombre.toUpperCase(),
      foto: fotoURL || null,
      codigo: codigo.toUpperCase(),
      stock: stock,
      categoria: categoriasSeleccionadas.map(opt => opt.value),
      precio_renta: precio,
      precio_venta: precio_venta,
      precio_x_semana: precio_x_semana,
      // Solo agrega disponibilidad si tiene algo seleccionado
      ...(disponibilidad.length > 0 && { disponibilidad }),
      precios_visibles: precios_visibles,
      tags: tags,
      descripcion: descripcion.toUpperCase(),
    };

    try {
      await axios.post(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/create`,
        datos
      );
      notyf.success(
        'El equipo se creó con éxito, se recargará esta página en 1 segundo'
      );
      setTimeout(async () => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-full lg:h-screen absolute z-40 bg-[#d9d9d97b] flex py-[2rem]  justify-center items-center">
      <div className="bg-white rounded-[10px] w-[90%] lg:w-[45%] h-[90vh] flex flex-col overflow-y-auto ">
        <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid'>
          <p className='text-white font-semibold'>Crear equipos</p>
          <button onClick={closeModal2}>
            <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </button>
        </div>

        <div className='w-full flex justify-center items-center bg-[#EBEBEB] relative '>
          <div className='bg-[white] w-full items-center flex flex-col  px-[1.5rem] py-[2rem]'>
            <div className='text-[0.8rem] flex justify-center items-center text-center font-semibold pt-1 pb-4'>
              <label htmlFor="">Todo los campos que contengan (*) son obligatorios</label>
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label">Nombre(*)</label>
              <input ref={input_nombre} onChange={captureNombre} type="text" class="form-control" id="exampleInputPassword1" />
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label">Foto(*)</label>
              <input ref={input_foto} type="file" class="form-control" id="exampleInputPassword1" />
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label">Código(*)</label>
              <input ref={input_codigo} onChange={captureCodigo} type="text" class="form-control" id="exampleInputPassword1" />
            </div>
            <div class="mb-3 w-full flex flex-col">
              <label className="form-label">Categorías (puedes seleccionar varias)</label>
              <Select
                isMulti
                value={categoriasSeleccionadas}
                onChange={setCategoriasSeleccionadas}
                options={categorias.map(cat => ({
                  value: cat.nombre,
                  label: cat.nombre
                }))}
                placeholder="Selecciona una o varias categorías..."
                menuPortalTarget={document.body}
                menuPlacement="top"
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
              />
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label">Stock(*)</label>
              <input ref={input_sotck} placeholder='Escribelo en números' onChange={captureStock} type="number" class="form-control" id="exampleInputPassword1" />
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label font-semibold">Precio de renta por día(*)</label>
              <input
                ref={input_precio}
                onInput={handleChange}
                value={precio}
                placeholder='Colocar punto para separar los decimales de los centavos. Ejm: 1,203.50'
                type="text"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label font-semibold">Precio de renta por semana(*)</label>
              <input
                ref={input_precio_x_semana}
                onInput={handleChange3}
                value={precio_x_semana}
                placeholder="Colocar punto para separar los decimales de los centavos. Ejm: 1,203.50"
                type="text"
                className="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label font-semibold">Precio de venta(*)</label>
              <input
                ref={input_precio_venta}
                onInput={handleChange2}
                value={precio_venta}
                placeholder="Colocar punto para separar los decimales de los centavos. Ejm: 1,203.50"
                type="text"
                className="form-control"
                id="exampleInputPassword1"
              />
            </div>

            <div className="mb-3 w-full">
              <label className="form-label font-semibold">
                ¿En qué catalogos quieres que esté disponible este equipo?
              </label>
              <div className="flex gap-4">
                {/* Checkbox para "renta" */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="renta"
                    checked={disponibilidad.includes("renta")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        setDisponibilidad((prev) => [...prev, value]); // Agregar "renta" al array
                      } else {
                        setDisponibilidad((prev) => prev.filter((item) => item !== value)); // Remover "renta" del array
                      }
                    }}
                  />
                  Catálogo de Renta
                </label>

                {/* Checkbox para "venta" */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="venta"
                    checked={disponibilidad.includes("venta")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        setDisponibilidad((prev) => [...prev, value]); // Agregar "venta" al array
                      } else {
                        setDisponibilidad((prev) => prev.filter((item) => item !== value)); // Remover "venta" del array
                      }
                    }}
                  />
                  Catálogo de Venta
                </label>
              </div>
              <label className="text-[0.85rem] text-gray-500 mt-1 block">
                Si no seleccionas ninguno, por defecto se agregará solo al catálogo de renta.
              </label>
            </div>
            <div className="mb-3 w-full">
              <label className="form-label font-semibold">
                ¿Qué precios estarán visibles en el catálogo de renta?
              </label>
              <div className="flex gap-4 flex-wrap">
                {/* Checkbox para "renta" */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="renta"
                    checked={precios_visibles.includes("renta")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        setPrecios_visibles((prev) => [...prev, value]);
                      } else {
                        setPrecios_visibles((prev) => prev.filter((item) => item !== value));
                      }
                    }}
                  />
                  Precio renta por día
                </label>

                {/* Checkbox para "semana" */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="semana"
                    checked={precios_visibles.includes("semana")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        setPrecios_visibles((prev) => [...prev, value]);
                      } else {
                        setPrecios_visibles((prev) => prev.filter((item) => item !== value));
                      }
                    }}
                  />
                  Precio renta por semana
                </label>

                {/* Checkbox para "venta" */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="venta"
                    checked={precios_visibles.includes("venta")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        setPrecios_visibles((prev) => [...prev, value]);
                      } else {
                        setPrecios_visibles((prev) => prev.filter((item) => item !== value));
                      }
                    }}
                  />
                  Precio venta
                </label>
              </div>
              <label className="text-[0.85rem] text-gray-500 mt-1 block">
                Si no seleccionas ninguno, no estará disponible ningún precio en el catálogo de RM.
              </label>
            </div>
            <div class="mb-3 w-full">
              <label for="exampleInputPassword1" class="form-label">Descripción del equipo (*)</label>
              <textarea ref={input_descripcion} onChange={captureDescripcion} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            <div className="mb-3 w-full flex flex-col">
              <label className="form-label">Tags del equipo</label>
              <textarea
                ref={input_tag}
                onChange={captureTags}
                className="form-control"
                placeholder="Escribe un tag y presiona Enter"
              />
              <div className="mt-2">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded m-1 inline-block">
                    {tag}
                  </span>
                ))}
              </div>
              <label className="text-[0.85rem] text-gray-500 mt-1 block">
                Cada vez que presiones Enter, se añadirá un tag por separado.
              </label>
            </div>
            <div className='text-[0.8rem] flex justify-center items-center text-center font-semibold pt-1 pb-4'>
              <label htmlFor="">Todo los campos que contengan (*) son obligatorios</label>
            </div>
            <div className='w-full flex justify-center'>
              <button onClick={crear_products} className='px-[2rem] text-white rounded-[5px] py-[0.5rem] font-semibold bg-primary'>Crear equipo</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
