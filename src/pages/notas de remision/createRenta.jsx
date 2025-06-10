import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);
import TableListCatalogo from '../../components/modalNotasRemision/tableListCatalogo';
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de tener uuid instalado
import Download_pdf from '../../components/download_pdf'; // Asegúrate de importar el componente

export default function createRenta() {
      const [fotos, setFotos] = useState([]);
      const [dragActive, setDragActive] = useState(false);
      const [lista, setLista] = useState([]);
      console.log(lista);
      const [clientesRegistrados, setClientesRegistrados] = useState([]);
      const [aplicaIVA, setAplicaIVA] = useState(false);
      const [nombre, setNombre] = useState('');
      const [domicilio, setDomicilio] = useState('');
      const [telefono, setTelefono] = useState('');
      const [observaciones, setObservaciones] = useState('');
      const [loading, setLoading] = useState(false);
      const [clienteTipo, setClienteTipo] = useState('nuevo'); // 'nuevo' o 'registrado'
      const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
      const [fotoIneDelantera, setFotoIneDelantera] = useState(null);
      const [fotoIneTrasera, setFotoIneTrasera] = useState(null);
      const [fechaRenta, setFechaRenta] = useState(null);
      const [fechaVencimiento, setFechaVencimiento] = useState(null);
      const [horaRenta, setHoraRenta] = useState('');
      const [hora12, setHora12] = useState('12');
      const [minuto, setMinuto] = useState('00');
      const [ampm, setAmpm] = useState('AM');
      const [showDownloadModal, setShowDownloadModal] = useState(false);
      const [idGenerado, setIdGenerado] = useState(null);

      // Función para mostrar la hora en formato 12 horas con AM/PM
      function formatHora12(hora24) {
        if (!hora24) return '';
        const [h, m] = hora24.split(':');
        let hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${m} ${ampm}`;
      }

      const inputRef = useRef(null);
      const input_nombre = useRef(null);
      const input_domicilio = useRef(null);
      const input_observaciones = useRef(null);
      const input_telefono = useRef(null);
      const ineDelanteraInputRef = useRef(null);
      const ineTraseraInputRef = useRef(null);
    
      // Maneja la selección de archivos
      const handleFiles = (files) => {
        setFotos(Array.from(files));
      };
    
      async function fetchClientesRegistrados() {
        try {
          const {data}=await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/clients/`);
          setClientesRegistrados(data.response);
          return data.response;
        } catch (error) {
          console.log(error);
        }
      }
    
      async function createClients(nombre, telefono) {
        let ine_delantero_url = "";
        let ine_trasero_url = "";
    
        // Mostrar solo un Swal para todo el proceso de cliente nuevo
        Swal.fire({
          title: 'Cargando nuevo cliente en la base de datos...',
          text: 'Por favor espere.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading()
        });
    
        // Subir foto INE delantero
        if (fotoIneDelantera) {
          try {
            const extension = fotoIneDelantera.name.split(".").pop();
            const newFileName = `${uuidv4()}.${extension}`;
            const renamedFile = new File([fotoIneDelantera], newFileName, { type: fotoIneDelantera.type });
            const formData = new FormData();
            formData.append("image", renamedFile);
    
            await axios.post(
              "https://verificaciongob.site/upload.php",
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            ine_delantero_url = `https://verificaciongob.site/uploads/${newFileName}`;
          } catch (error) {
            Swal.close();
            Swal.fire('Error', 'Error al subir la foto de INE delantero. Intente nuevamente.', 'error');
            console.log('Error INE delantero:', error);
            return null;
          }
        }
    
        // Subir foto INE trasero
        if (fotoIneTrasera) {
          try {
            const extension = fotoIneTrasera.name.split(".").pop();
            const newFileName = `${uuidv4()}.${extension}`;
            const renamedFile = new File([fotoIneTrasera], newFileName, { type: fotoIneTrasera.type });
            const formData = new FormData();
            formData.append("image", renamedFile);
    
            await axios.post(
              "https://verificaciongob.site/upload.php",
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            ine_trasero_url = `https://verificaciongob.site/uploads/${newFileName}`;
          } catch (error) {
            Swal.close();
            Swal.fire('Error', 'Error al subir la foto de INE trasero. Intente nuevamente.', 'error');
            console.log('Error INE trasero:', error);
            return null;
          }
        }
    
        // Crear cliente con URLs de las fotos
        try {
          const datos = {
            nombre: nombre.toUpperCase().trim(),
            telefono: telefono.trim(),
            foto_ine_delantero: ine_delantero_url || '',
            foto_ine_trasero: ine_trasero_url || '',
          };
          const { data } = await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/clients/create', datos);
          Swal.close();
          return data.response;
        } catch (error) {
          Swal.close();
          Swal.fire('Error', 'No se pudo crear el cliente. Verifica los datos.', 'error');
          console.log('Error creando cliente:', error);
          return null;
        }
      }
    
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
    
    async function handleCrearNota() {
      setLoading(true);

      // 1. Subiendo fotos (si hay)
      if (fotos.length > 0) {
        Swal.fire({
          title: 'Subiendo fotos de evidencia...',
          text: 'Por favor espera mientras se suben las imágenes.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading()
        });
      }

      try {
        let urlsFotos = [];
        if (fotos.length > 0) {
          urlsFotos = await Promise.all(
            fotos.map(async (file) => {
              const extension = file.name.split('.').pop();
              const newFileName = `${uuidv4()}.${extension}`;
              const renamedFile = new File([file], newFileName, { type: file.type });
              const formData = new FormData();
              formData.append('image', renamedFile);

              await axios.post(
                "https://verificaciongob.site/upload.php",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              return `https://verificaciongob.site/uploads/${newFileName}`;
            })
          );
        }

        // 2. Guardando renta
        Swal.fire({
          title: 'Guardando la renta...',
          text: 'Por favor espera mientras se guarda la información.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading()
        });

        const payload = {
          nombre: nombre.toUpperCase().trim(),
          telefono: telefono.trim(),
          direccion: domicilio.trim(),
          fecha_renta: fechaRenta ? fechaRenta.toLocaleDateString('es-MX') : '',
          hora_renta: horaRenta || `${hora12}:${minuto} ${ampm}`,
          fecha_vencimiento: fechaVencimiento ? fechaVencimiento.toLocaleDateString('es-MX') : '',
          usuario_rentador: localStorage.getItem('usuario'),
          productos: lista.map(prod => ({
            nombre: prod.nombre,
            codigo: prod.codigo,
            cantidad: prod.cantidad,
            dias_renta: prod.dias,
            descripcion: prod.descripcion,
            precio_unitario: prod.precio,
            importe_total: prod.total,
          })),
          total_renta: lista.reduce((acc, item) => acc + (Number(item.total) || 0), 0),
          fotos_estado_inicial: urlsFotos,
          observacion_inicial: observaciones.trim(),
          IVA: aplicaIVA,
        };

        // 3. Generando PDF
        const { data } = await axios.post('http://localhost:8085/api/rentas/create', payload);

        Swal.fire({
          title: 'Generando PDF...',
          text: 'Por favor espera mientras se genera el documento.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading()
        });

        setLoading(false);
        setIdGenerado(data.response._id);
        setShowDownloadModal(true);
        Swal.close(); // Cierra cualquier Swal antes de mostrar el modal
        return data.response;
      } catch (error) {
        Swal.close();
        Swal.fire('Error al generar la renta', '', 'error');
        console.log(error);
        setLoading(false);
      }
    }
    
    
      // Solo carga clientes cuando seleccionas "registrado"
      useEffect(() => {
        if (clienteTipo === 'registrado') {
          fetchClientesRegistrados();
        } else {
          setClientesRegistrados([]);
          setClienteSeleccionado(null);
          setNombre('');
          setTelefono('');
        }
      }, [clienteTipo]);
    
      // Opciones para react-select
      const opcionesClientes = clientesRegistrados.map(cliente => ({
        value: cliente._id,
        label: `${cliente.nombre}${cliente.telefono ? ' - ' + cliente.telefono : ''}`,
        nombre: cliente.nombre,
        telefono: cliente.telefono
      }));
    
      // Cuando seleccionas un cliente del Select
      const handleSelectCliente = (opcion) => {
        setClienteSeleccionado(opcion);
        setNombre(opcion?.nombre || '');
        setTelefono(opcion?.telefono || '');
      };
  return (
    <>
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-gray-200">
        {/* Panel izquierdo */}
        <div className="flex flex-col w-full md:w-[40%] gap-6 min-h-screen px-8 py-10 bg-white/80 rounded-r-3xl shadow-2xl">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Generador de rentas</h2>
          {/* Checkboxes para tipo de cliente */}
          <div className="flex gap-6 mb-2">
            <label className="flex items-center gap-2 text-blue-700 font-medium">
              <input
                type="radio"
                name="clienteTipo"
                value="nuevo"
                checked={clienteTipo === 'nuevo'}
                onChange={() => setClienteTipo('nuevo')}
                className="accent-blue-600"
              />
              Cliente nuevo
            </label>
            <label className="flex items-center gap-2 text-blue-700 font-medium">
              <input
                type="radio"
                name="clienteTipo"
                value="registrado"
                checked={clienteTipo === 'registrado'}
                onChange={() => setClienteTipo('registrado')}
                className="accent-blue-600"
              />
              Cliente registrado
            </label>
          </div>

          {/* Select y datos para cliente registrado */}
          {clienteTipo === 'registrado' && (
            <>
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-semibold text-blue-700">Selecciona un cliente</label>
                <Select
                  options={opcionesClientes}
                  value={clienteSeleccionado}
                  onChange={handleSelectCliente}
                  placeholder="Buscar o seleccionar cliente..."
                  isClearable
                />
              </div>
              {clienteSeleccionado && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-blue-700">Nombre</label>
                    <input
                      type="text"
                      value={nombre}
                      readOnly
                      className="py-2 rounded-lg px-3 border border-blue-200 bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-blue-700">Teléfono</label>
                    <input
                      type="text"
                      value={telefono}
                      readOnly
                      className="py-2 rounded-lg px-3 border border-blue-200 bg-gray-100"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Inputs solo si es cliente nuevo */}
          {clienteTipo === 'nuevo' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Nombre</label>
                <input
                  type="text"
                  ref={input_nombre}
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
              {/* Inputs para fotos de INE con dropzone visual */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Foto de INE delantero</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                    fotoIneDelantera ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                  }`}
                  style={{ minHeight: 110 }}
                  onClick={() => ineDelanteraInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      setFotoIneDelantera(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <input
                    ref={ineDelanteraInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFotoIneDelantera(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="text-center w-full">
                    <span className="block text-blue-700 font-medium">
                      {fotoIneDelantera
                        ? fotoIneDelantera.name
                        : "Arrastra aquí la foto o haz clic para seleccionar"}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      (Solo una imagen, formato jpg, png, jpeg)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Foto de INE trasero</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                    fotoIneTrasera ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                  }`}
                  style={{ minHeight: 110 }}
                  onClick={() => ineTraseraInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      setFotoIneTrasera(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <input
                    ref={ineTraseraInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFotoIneTrasera(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="text-center w-full">
                    <span className="block text-blue-700 font-medium">
                      {fotoIneTrasera
                        ? fotoIneTrasera.name
                        : "Arrastra aquí la foto o haz clic para seleccionar"}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      (Solo una imagen, formato jpg, png, jpeg)
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Domicilio</label>
            <input
              ref={input_domicilio}
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              type="text"
              className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe el domicilio del cliente"
            />
          </div>
          {/* Fecha de renta y vencimiento */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Fecha de renta</label>
            <DatePicker
              selected={fechaRenta}
              onChange={date => setFechaRenta(date)}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="py-2 px-3 border w-full border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Selecciona la fecha de renta"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold text-blue-700">Fecha de vencimiento</label>
            <DatePicker
              selected={fechaVencimiento}
              onChange={date => setFechaVencimiento(date)}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="py-2 px-3 border w-full border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Selecciona la fecha de vencimiento"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Hora de la renta (hora de México)</label>
            <div className="flex gap-2 items-center">
              <select
                value={hora12}
                onChange={e => setHora12(e.target.value)}
                className="py-2 px-2 border border-blue-200 rounded-lg focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const val = (i + 1).toString().padStart(2, '0');
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
              <span>:</span>
              <select
                value={minuto}
                onChange={e => setMinuto(e.target.value)}
                className="py-2 px-2 border border-blue-200 rounded-lg focus:outline-none"
              >
                {Array.from({ length: 60 }, (_, i) => {
                  const val = i.toString().padStart(2, '0');
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
              <select
                value={ampm}
                onChange={e => setAmpm(e.target.value)}
                className="py-2 px-2 border border-blue-200 rounded-lg focus:outline-none"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <span className="text-blue-600 font-medium mt-1">
              Seleccionaste: {hora12}:{minuto} {ampm}
            </span>
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
            <label className="font-semibold text-blue-700">Evidencia de entrega de equipos</label>
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
              onClick={() => handleCrearNota(nombre, telefono)} // Aquí va tu función para crear la nota
            >
              Generar la renta
            </button>
            <div className="block md:hidden text-center mb-2 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-blue-700 text-sm font-semibold animate-bounce">¡Tus equipos se agregan aquí abajo!</span>
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
                *¿Qué deseas agregar a la lista? <span className="text-gray-500 font-normal">(Máximo 12 artículos por renta)</span>
              </label>
            </div>
              <TableListCatalogo lista={lista} setLista={setLista} />
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
                      <th className="px-4 py-2 text-center font-semibold">
                        <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
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
      {showDownloadModal && idGenerado && (
        <div className="fixed inset-0 z-50 bg-[#00000090] flex items-center justify-center">
          <Download_pdf
            id={idGenerado}
            close_modal2={() => {
              setShowDownloadModal(false);
              window.location.reload();
            }}
          />
        </div>
      )}
    </>
  );
}

