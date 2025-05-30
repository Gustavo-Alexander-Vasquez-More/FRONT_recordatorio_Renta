import React, { useState, useRef } from 'react';
import TableListCatalogo from '../../components/modalNotasRemision/tableListCatalogo';
import TableListPersonalizado from '../../components/modalNotasRemision/tableListPersonalizado';
import { uploadFoto } from '../../firebase/images.js'; // Tu función de subida a Firebase
import Swal from 'sweetalert2';
import axios from 'axios';
import Navbar from '../../components/navbar.jsx';
export default function createNotas() {
  const [opcion, setOpcion] = useState('catalogo');
  const [fotos, setFotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [lista, setLista] = useState([]);
  const [aplicaIVA, setAplicaIVA] = useState(false);
  const [nombre, setNombre] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad_estado, setCiudadEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const input_nombre = useRef(null);
  const input_domicilio = useRef(null);
    const input_ciudad_estado = useRef(null);
    const input_observaciones = useRef(null);
    const input_telefono = useRef(null);

  // Maneja la selección de archivos
  const handleFiles = (files) => {
    setFotos(Array.from(files));
  };

  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Eliminar artículo de la lista
  const handleEliminar = (idx) => {
    setLista(lista.filter((_, i) => i !== idx));
  };

async function handleCrearNota(e) {
    // Mostrar loading con SweetAlert
    Swal.fire({
      title: 'Generando nota de remisión',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setLoading(true);
    let urlsFotos = [];
    try {
      if (fotos.length > 0) {
        urlsFotos = await Promise.all(fotos.map(file => uploadFoto(file)));
      }
      // Calcula fecha y hora actual automáticamente
      const now = new Date();
      const fechaActualStr = now.toLocaleDateString('es-MX');
      const horaActualStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

      const payload = {
        nombre: nombre.toUpperCase().trim(),
        domicilio: domicilio.trim(),
        ciudad_estado: ciudad_estado.trim(),
        fecha_actual: fechaActualStr,
        hora_actual: horaActualStr,
        fotos: urlsFotos,
        telefono: telefono.trim(),
        observaciones: observaciones.trim(),
        productos: lista.map(prod => ({
          nombre: prod.nombre,
          cantidad: prod.cantidad,
          dias_renta: prod.dias,
          precio_unitario: prod.precio,
          importe_total: prod.total,
        })),
        IVA: aplicaIVA,
        total_remision: lista.reduce((acc, item) => acc + (Number(item.total) || 0), 0)
      };

      const { data } = await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/create', payload);
      Swal.close(); // Cierra el loading
      Swal.fire('Nota de remisión creada', '', 'success');
      setLoading(false);
      window.location.reload(); // Recargar la página para ver la nueva nota
      return data.response;
    } catch (error) {
      Swal.close(); // Cierra el loading
      Swal.fire('Error al crear la nota', '', 'error');
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-gray-200">
      {/* Panel izquierdo */}
      <div className="flex flex-col w-full md:w-[40%] gap-6 min-h-screen px-8 py-10 bg-white/80 rounded-r-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Crear Nota de Remisión</h2>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-blue-700">Nombre</label>
          <input
            type="text"
            inputRef={input_nombre}
            value={nombre}
            onChange={(e) => setNombre(e.target.value.toUpperCase())}
            className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe el nombre del cliente (requerido)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-blue-700">Teléfono</label>
          <input
            ref={input_telefono}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            type="text"
            className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe el teléfono del cliente (opcional)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-blue-700">Domicilio</label>
          <input
            ref={input_domicilio}
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            type="text"
            className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe el domicilio del cliente (opcional)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-blue-700">Ciudad-Estado</label>
          <input
            ref={input_ciudad_estado}
            value={ciudad_estado}
            onChange={(e) => setCiudadEstado(e.target.value)}
            type="text"
            className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe la ciudad y estado (opcional)"
          />
        </div>
        {/* Observaciones */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-blue-700">Observaciones</label>
          <textarea
            ref={input_observaciones}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="Observaciones adicionales (opcional)"
            rows={2}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-blue-700">Fotos</label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
            }`}
            onClick={() => inputRef.current.click()}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            style={{ minHeight: 110 }}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChange}
            />
            <div className="text-center w-full">
              <span className="block text-blue-700 font-medium">
                {fotos.length === 0
                  ? "Arrastra aquí tus fotos o haz clic para seleccionar"
                  : `${fotos.length} archivo(s) seleccionado(s)`}
              </span>
              <span className="block text-xs text-gray-400 mt-1">
                (Formatos permitidos: imágenes jpg, png, jpeg)
              </span>
            </div>
            {fotos.length > 0 && (
              <ul className="mt-3 text-xs text-gray-700 list-disc pl-5 w-full text-left">
                {fotos.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Checkbox Aplica IVA */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-semibold text-blue-700 mb-1">¿Aplica IVA?</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-blue-700 font-medium">
              <input
                type="radio"
                name="aplicaIVA"
                value="true"
                checked={aplicaIVA === true}
                onChange={() => setAplicaIVA(true)}
                className="accent-blue-600"
              />
              Sí
            </label>
            <label className="flex items-center gap-2 text-blue-700 font-medium">
              <input
                type="radio"
                name="aplicaIVA"
                value="false"
                checked={aplicaIVA === false}
                onChange={() => setAplicaIVA(false)}
                className="accent-blue-600"
              />
              No
            </label>
          </div>
        </div>
        {/* Monto total y botón crear nota */}
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-700">Monto total:</span>
            <span className="font-bold text-2xl text-blue-900">
              ${lista.reduce((acc, item) => acc + (Number(item.total) || 0), 0).toFixed(2)}
            </span>
          </div>
          <button
            className={`mt-2 py-3 rounded-lg font-bold text-lg transition ${
              lista.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow'
            }`}
            disabled={lista.length === 0}
            onClick={handleCrearNota} // Aquí va tu función para crear la nota
          >
            Crear Nota de Remisión
          </button>
          <div className="block md:hidden text-center mb-2 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-blue-700 text-sm font-semibold animate-bounce">¡Tus productos se agregan aquí abajo!</span>
                <svg className="w-7 h-7 text-blue-500 mt-1 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
                <span className="text-xs text-blue-400 mt-1">Desliza la tabla hacia los lados para ver todo</span>
              </div>
            </div>
        </div>
      </div>
      {/* Panel derecho */}
      <div className="flex flex-col w-full md:w-[60%] min-h-screen bg-transparent">
        <div className="flex flex-col gap-6 px-6 py-8 rounded-xl w-full">
          <div className="flex flex-col gap-2 mt-2">
            <label className="font-semibold text-blue-700">
              *¿Qué deseas agregar a la lista? <span className="text-gray-500 font-normal">(Máximo 12 artículos por Nota de remisión)</span>
            </label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 text-blue-700 font-medium">
                <input
                  type="radio"
                  name="opcion"
                  value="catalogo"
                  checked={opcion === 'catalogo'}
                  onChange={() => setOpcion('catalogo')}
                  className="accent-blue-600"
                />
                Equipos del catálogo Rentame
              </label>
              <label className="flex items-center gap-2 text-blue-700 font-medium">
                <input
                  type="radio"
                  name="opcion"
                  value="personalizado"
                  checked={opcion === 'personalizado'}
                  onChange={() => setOpcion('personalizado')}
                  className="accent-blue-600"
                />
                Artículos personalizados
              </label>
            </div>
            <span className="font-semibold text-[0.95rem] text-blue-500 mt-1">
              Puedes ir alternando las opciones para ir combinando equipos y artículos en la lista.
            </span>
          </div>
          {opcion === 'catalogo' ? (
            <TableListCatalogo lista={lista} setLista={setLista} />
          ) : (
            <TableListPersonalizado lista={lista} setLista={setLista} />
          )}
          {/* Mensaje y flecha indicativa en móvil */}
          
          {lista.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden shadow">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-center font-semibold">#</th>
                    <th className="px-4 py-2 text-center font-semibold">Equipo</th>
                    <th className="px-4 py-2 text-center font-semibold">P/unidad</th>
                    <th className="px-4 py-2 text-center font-semibold">Cantidad</th>
                    <th className="px-4 py-2 text-center font-semibold">Días</th>
                    <th className="px-4 py-2 text-center font-semibold">Imp. total</th>
                    <th className="px-4 py-2 text-center font-semibold"><svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
</svg>
</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((item, idx) => (
                    <tr key={idx} className="even:bg-gray-100">
                      <td className="px-4 py-2 text-center font-bold">{idx + 1}</td>
                      <td className="px-4 py-2 text-center">{item.nombre}</td>
                      <td className="px-4 py-2 text-center">${item.precio}</td>
                      <td className="px-4 py-2 text-center">{item.cantidad}</td>
                      <td className="px-4 py-2 text-center">{item.dias}</td>
                      <td className="px-4 py-2 text-center font-semibold">${item.total}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded transition"
                          onClick={() => handleEliminar(idx)}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
