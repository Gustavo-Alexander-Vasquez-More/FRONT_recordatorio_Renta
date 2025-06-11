import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import { uploadFoto } from '../../firebase/images.js';
import Select from 'react-select';

export default function modal_create_products({ closeModal2 }) {
  const notyf = new Notyf({
    position: { x: 'center', y: 'top' },
    duration: 3500
  });

  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio_venta, setPrecio_venta] = useState('');
  const [tags, setTags] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [precios_visibles, setPrecios_visibles] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [fotoTemporal, setFotoTemporal] = useState(null);
  const [saving, setSaving] = useState(false);

  const input_nombre = useRef();
  const input_codigo = useRef();
  const input_precio = useRef();
  const input_precio_venta = useRef();
  const input_stock = useRef();
  const input_foto = useRef();
  const input_descripcion = useRef();
  const input_tag = useRef();

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
    setTags(event.target.value.split("\n").filter(tag => tag.trim() !== ""));
  }
  function captureNombre() { setNombre(input_nombre.current.value); }
  function captureCodigo() { setCodigo(input_codigo.current.value); }
  function captureDescripcion() { setDescripcion(input_descripcion.current.value); }
  function captureStock() { setStock(input_stock.current.value); }
  function capturePrecio(event) {
    let value = event.target.value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
      let [entero, decimales] = value.split('.');
      entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio(`${entero}.${decimales}`);
    } else {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio(value);
    }
  }
  function capturePrecio_venta(event) {
    let value = event.target.value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
      let [entero, decimales] = value.split('.');
      entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio_venta(`${entero}.${decimales}`);
    } else {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio_venta(value);
    }
  }
  const handleChange = (e) => { capturePrecio(e); };
  const handleChange2 = (e) => { capturePrecio_venta(e); };

  async function crear_products() {
    if (saving) return;
    Swal.fire({
      title: 'Cargando, por favor espere...',
      didOpen: () => { Swal.showLoading(); },
    });

    if (!nombre || !codigo || !precio || !descripcion || !stock) {
      Swal.close();
      notyf.error('Por favor complete los campos obligatorios');
      return;
    }

    let fotoURL = '';
    const selectedFile = input_foto.current.files[0];
    if (selectedFile) {
      try {
        fotoURL = await uploadFoto(selectedFile);
      } catch (error) {
        notyf.error('Error al subir la foto. Intente nuevamente.');
        return;
      }
    }

    setSaving(true);
    const datos = {
      nombre: nombre.toUpperCase(),
      foto: fotoURL || null,
      codigo: codigo.toUpperCase(),
      stock: stock,
      categoria: categoriasSeleccionadas.map(opt => opt.value),
      precio_renta: precio,
      precio_venta: precio_venta,
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
      notyf.success('El equipo se creó con éxito');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      notyf.error('Error al crear el equipo');
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#d9d9d97b] flex justify-center items-center">
      <div className="bg-white rounded-lg w-[95vw] max-w-lg max-h-[95vh] overflow-y-auto flex flex-col p-6 shadow-lg">
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-primary'>Crear equipo</h2>
          <button onClick={closeModal2} className="text-gray-600 hover:text-red-600 text-2xl font-bold">&times;</button>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='text-[0.9rem] text-center font-semibold text-gray-600'>
            Todos los campos que contengan <span className="text-red-500">*</span> son obligatorios
          </div>
          {/* Foto */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={fotoTemporal ? URL.createObjectURL(fotoTemporal) : undefined}
              className="w-24 h-24 rounded-full object-cover border bg-gray-100"
              alt="Foto"
              style={{ display: fotoTemporal ? 'block' : 'none' }}
            />
            <input
              ref={input_foto}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => setFotoTemporal(e.target.files[0])}
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              onClick={() => input_foto.current.click()}
              type="button"
            >
              {fotoTemporal ? "Cambiar foto" : "Subir foto *"}
            </button>
          </div>
          {/* Nombre y descripción */}
          <div>
            <label className="font-semibold">Nombre <span className="text-red-500">*</span></label>
            <input ref={input_nombre} onChange={captureNombre} type="text" className="w-full border rounded px-3 py-2 mt-1 mb-2" />
            <label className="font-semibold">Descripción <span className="text-red-500">*</span></label>
            <textarea ref={input_descripcion} onChange={captureDescripcion} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </div>
          {/* Categorías */}
          <div>
            <label className="font-semibold">Categorías</label>
            <Select
              isMulti
              value={categoriasSeleccionadas}
              onChange={setCategoriasSeleccionadas}
              options={categorias.map(cat => ({
                value: cat._id,
                label: cat.nombre
              }))}
              placeholder="Selecciona una o varias categorías..."
              menuPortalTarget={document.body}
              menuPlacement="top"
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          {/* Código y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="font-semibold">Código <span className="text-red-500">*</span></label>
              <input ref={input_codigo} onChange={captureCodigo} type="text" className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="font-semibold">Stock <span className="text-red-500">*</span></label>
              <input ref={input_stock} placeholder='Solo números' onChange={captureStock} type="number" className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>
          {/* Precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="font-semibold">Precio renta x día <span className="text-red-500">*</span></label>
              <input
                ref={input_precio}
                onInput={handleChange}
                value={precio}
                placeholder='Ej: 1,203.50'
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Precio de venta <span className="text-red-500">*</span></label>
              <input
                ref={input_precio_venta}
                onInput={handleChange2}
                value={precio_venta}
                placeholder="Ej: 1,203.50"
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>
          {/* Disponibilidad */}
          <div>
            <label className="font-semibold">¿En qué catálogos estará disponible?</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="renta"
                  checked={disponibilidad.includes("renta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setDisponibilidad(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Catálogo de Renta
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="venta"
                  checked={disponibilidad.includes("venta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setDisponibilidad(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Catálogo de Venta
              </label>
            </div>
            <span className="text-[0.85rem] text-gray-500 mt-1 block">
              Si no seleccionas ninguno, por defecto se agregará solo al catálogo de renta.
            </span>
          </div>
          {/* Precios visibles */}
          <div>
            <label className="font-semibold">¿Qué precios estarán visibles?</label>
            <div className="flex gap-4 mt-1 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="renta"
                  checked={precios_visibles.includes("renta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setPrecios_visibles(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Precio renta por día
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="venta"
                  checked={precios_visibles.includes("venta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setPrecios_visibles(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Precio venta
              </label>
            </div>
            <span className="text-[0.85rem] text-gray-500 mt-1 block">
              Si no seleccionas ninguno, no estará disponible ningún precio en el catálogo.
            </span>
          </div>
          {/* Tags */}
          <div>
            <label className="font-semibold">Tags del equipo</label>
            <textarea
              ref={input_tag}
              onChange={captureTags}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Escribe un tag por línea"
            />
            <div className="mt-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded m-1 inline-block">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[0.85rem] text-gray-500 mt-1 block">
              Escribe un tag por línea.
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal2} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancelar</button>
          <button
            onClick={crear_products}
            className={`px-4 py-2 rounded transition ${saving ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-800 text-white"}`}
            disabled={saving}
          >
            {saving ? "Creando..." : "Crear equipo"}
          </button>
        </div>
      </div>
    </div>
  );
}
