import React, { Children, useEffect, useRef, useState } from 'react';
import Navbar from '../../components/navbar';
import { uploadFoto } from '../../firebase/images';
import { uploadFoto_INE } from '../../firebase/foto_ines';
import axios from 'axios';
import trash from '../../images/trash.png';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
import Swal from 'sweetalert2';

export default function CreateRentas() {
//NOTIFICACIONES
const notyf = new Notyf({
    position: {
      x: 'center',
      y: 'top',
    },
    duration: 3500,
    dismissible:true
});
//ESTADOS
const [filteredClients, setFilteredClients] = useState([]);

const [datas, setDatas] = useState([]); //productos traidos por axios
const [filteredDatas, setFilteredDatas] = useState([]); // productos filtrados
const [selectedProducts, setSelectedProducts] = useState([]); //se almacenan los productos seleccionados
console.log(selectedProducts);
const [searchTerm, setSearchTerm] = useState(''); //Se almacenan los terminos de busqueda
const [loading, setLoading] = useState(true); //estado para spinner de carga
const [files, setFiles]=useState([])
const [folio, setFolio]=useState()
const [selectedIVA, setSelectedIVA]=useState()
console.log(selectedIVA);
const [hora_renta, setHora_renta]=useState()
const [hora_vencimiento, setHora_vencimiento]=useState()
const [fecha_renta, setFecha_renta]=useState(new Date())
const [fecha_vencimiento, setFecha_Vencimiento]=useState(new Date())
const [dias_contados, setDias_contados]=useState()
const [detalle, setDetalle]=useState('')
const [nombre_cliente, setNombre_cliente]=useState()
console.log(nombre_cliente);
const [celular, setCelular]=useState()
const [direccion, setDireccion]=useState()
const [selectedOption, setSelectedOption] = useState();
const [info_registro, setInfo_registro]=useState()
const [clients, setClients]=useState()
const [cliente_Selected, setCliente_selected]=useState()
console.log(cliente_Selected);
const [foto_ine_delantero, setFoto_ine_delantero]=useState()
const [foto_ine_trasero, setIne_trasero]=useState()
useEffect(() => {
  // Calcula la diferencia de días cuando cambian las fechas
  if (fecha_renta && fecha_vencimiento) {
    const diferenciaTiempo = new Date(fecha_vencimiento) - new Date(fecha_renta); // Diferencia en milisegundos
    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertir a días
    setDias_contados(diferenciaDias);
  }
}, [fecha_renta, fecha_vencimiento]); 
//USEREF
const input_foto=useRef()
const input_detalle=useRef()
const input_nombre_cliente=useRef()
const input_celular=useRef()
const input_direccion=useRef()
const input_cliente_Selected=useRef()
const input_iva_Selected=useRef()
const inputIne_delantero=useRef()
const inputIne_trasero=useRef()
const input_hora_renta=useRef()
const input_hora_vencimiento=useRef()

//FUNCIONES PARA CAPTURAR
function captureFoto_delantera(event){
  setFoto_ine_delantero(event.target.files)
}
function captureFoto_trasera(event){
  setIne_trasero(event.target.files)
}
const capturarSelect = (event) => {
  setSelectedOption(event.target.value);
};

const capturarSelectIVA = (event) => {
  setSelectedIVA(event.target.value);
};
function captureNombre(){
setNombre_cliente(input_nombre_cliente.current.value)
}
function captureCliente(){
  setCliente_selected(input_cliente_Selected.current.value)
  }
function captureCelular(){
setCelular(input_celular.current.value)
}
function captureDetalle(){
setDetalle(input_detalle.current.value)
}
function captureDireccion(){
  setDireccion(input_direccion.current.value)
}
function captureHora_renta(){
  setHora_renta(input_hora_renta.current.value)
}
function captureHora_vencimiento(){
  setHora_vencimiento(input_hora_vencimiento.current.value)
}
//FORMAT FECHA VENCIMIENTO
const formatear_vencimiento = fecha_vencimiento.toISOString().replace(/[-T]/g, ':').split(':');
const diaVencimiento=formatear_vencimiento[2]
const mesVencimiento=formatear_vencimiento[1]
const añoVencimiento=formatear_vencimiento[0]
const vencimientoFormateado=`${diaVencimiento}/${mesVencimiento}/${añoVencimiento}`

//FORMAT FECHA RENTA
const formatear_fecha_renta = fecha_renta.toISOString().replace(/[-T]/g, ':').split(':');
const diaRenta=formatear_fecha_renta[2]
const mesRenta=formatear_fecha_renta[1]
const añoRenta=formatear_fecha_renta[0]
const fecha_renta_formateada=`${diaRenta}/${mesRenta}/${añoRenta}`


async function getClients() {
try {
  const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients/');
  setClients(data.response)
} catch (error) {
  console.log(error);
}
  
}
useEffect(() => {
  getClients()
}, []);

//FUNCION GET PARA TRAER TODOS LOS PRODUCTOS
async function get() {
try {
const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/products/');
setDatas(data.response);
setFilteredDatas(data.response);
setLoading(false);
} catch (error) {
console.error('Error fetching image data:', error);
setLoading(false);
}}

useEffect(() => { 
  get();//EJECUCION DEL GET
  const storedProducts = JSON.parse(localStorage.getItem('selectedProducts')); // Cargar los productos seleccionados desde el localStorage
    if (storedProducts) {
      setSelectedProducts(storedProducts);
    }
    const handleStorageChange = (e) => { // Sincronización con el localStorage
      if (e.key === 'selectedProducts') {
        const storedProducts = JSON.parse(localStorage.getItem('selectedProducts'));
        setSelectedProducts(storedProducts || []);
      }
    };
    window.addEventListener('storage', handleStorageChange); // Agregar un listener para cambios en el localStorage
    return () => { window.removeEventListener('storage', handleStorageChange);}; // Limpiar el listener cuando el componente se desmonte
    
}, []); 

useEffect(() => { // Guardar los productos seleccionados en el localStorage cada vez que cambien
    if (selectedProducts.length > 0) {
      localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    } else {
      localStorage.removeItem('selectedProducts'); // Eliminar del localStorage si no hay productos
    }
  }, [selectedProducts]);

  const handleSearchClient = (e) => {
    const value = e.target.value;
    setNombre_cliente(value); // Actualiza el estado del nombre del cliente
  
    if (value.length > 0) {
      const filtered = clients.filter(client =>
        client.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]); // Si no hay texto, limpiar sugerencias
    }
  };
  const selectClient = (client) => {
    console.log(client);
    setNombre_cliente(client.nombre);
    setCliente_selected(client._id) 
     // Llena el campo con el nombre seleccionado
    setCelular(client.telefono);       // Puedes llenar otros campos como el teléfono
    setFilteredClients([]);            // Limpia las sugerencias
  };

const handleSearch = () => { //PARA REALIZARLA BUSQUEDA POR TERMINOS ESPECIFICOS 
  const filtered = datas.filter(
    (dat) => dat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || dat.codigo.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredDatas(filtered);
};
//FUNCION PARA BUSCAR CUANDO PRESIONAS ENTER
const handleKeyDown = (e) => {
  if (e.key === 'Enter') { handleSearch();}
};
//FUNCION PARA limpiar la busqueda
const clear = () => { setSearchTerm('');}; 
useEffect(() => {
    if (searchTerm === '') { handleSearch();}
}, [searchTerm]);
//FUNCION PARA AÑADIR PRODUCTOS A LA LISTA
const handleAddProduct = (product) => {
  const existingProduct = selectedProducts.find((p) => p.codigo === product.codigo);
  if (!existingProduct) {
    setSelectedProducts((prev) => [...prev, { ...product, cantidad: 1 }]);
}};
//FUNCION PARA REMOVER PRODUCTOS DE LA LISTA
const handleRemoveProduct = (codigo) => {
  const updatedProducts = selectedProducts.filter((p) => p.codigo !== codigo);
    setSelectedProducts(updatedProducts);
};
//FUNCION PARA AÑADIR CANTIDAD DE PRODUCTOS A LA LISTA
const handleQuantityChange = (codigo, delta) => {
  setSelectedProducts((prev) => {
  const updatedProducts = prev
  .map((p) => p.codigo === codigo ? { ...p, cantidad: p.cantidad + delta } : p)
  .filter((p) => p.cantidad > 0); // Filtra los productos con cantidad mayor a 0
  return updatedProducts;
});};
//FUNCION PARA ESCUCHAR LAS FOTOS QUE SE SUBEN Y PASARLAS A UN ARRAY DE FOTOS Y BASE64
const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files); // Convertir los archivos seleccionados a un array

  // Subir los archivos directamente a setFiles con una URL temporal para cada imagen
  setFiles((prevFiles) => [
    ...prevFiles,
    ...selectedFiles.map((file) => ({
      id: file.name + Date.now(), // Un identificador único para cada imagen
      file: file,
      src: URL.createObjectURL(file), // Crear una URL temporal para la vista previa
      name: file.name,
    })),
  ]);
};

const handleRemoveImage = (id, index) => {
  // Eliminar la imagen seleccionada del estado
  setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
};




async function create_clientes() {
  Swal.fire({
    title: 'Cargando, por favor espere...',
    didOpen: () => {
      Swal.showLoading();  // Mostrar el spinner de carga
    }
  });
  const fotoURL_1 = await uploadFoto(foto_ine_delantero[0]);
  const fotoURL_2 = await uploadFoto(foto_ine_trasero[0]);
  const datos={
    nombre:nombre_cliente,
    telefono:celular,
    foto_ine_delantero:fotoURL_1 || '',
    foto_ine_trasero:fotoURL_2 || '',
  }

  try {
    const {data}=await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/clients/create`, datos);
    await setInfo_registro('confirm')
    const response=data.response
    await setCliente_selected(response._id)
    Swal.close()
    notyf.success('El cliente se ha registrado en la base de datos');
  } catch (error) {
    Swal.close()
    notyf.error('Este cliente ya existe en la base de datos, genera uno nuevo o selecciona uno ya existente');
    setInfo_registro('error')
  }
}
async function obtenerNuevoFolio() {
  try {
    
    setFolio(nuevoFolio);
    } catch (error) {
    console.log(error);
  }
}
async function folioactual() {
  
  try {
    
   await obtenerNuevoFolio();

  } catch (error) {
    console.log(error);
  }
}

//FUNCION PARA CREAR UNA RENTA
async function generar_rentas() {
  if (!nombre_cliente || !localStorage.getItem('usuario') || !localStorage.getItem('nombre') || !hora_renta) {
    return notyf.error('Datos incompletos, llene todos los campos excepto los que dicen opcional.');
  }

  Swal.fire({
    title: 'Cargando, por favor espere...',
    didOpen: () => {
      Swal.showLoading(); // Mostrar el spinner de carga
    },
  });

  try {
    // Obtener el último folio
    const response = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/`);
    const permisosData = response.data.response;
    const ultimoPermiso = permisosData[permisosData.length - 1];
    const ultimoFolio = ultimoPermiso ? parseInt(ultimoPermiso.folio) : 0;
    const nuevoFolio = (ultimoFolio + 1).toString().padStart(7, '0');

    // Subida de imágenes
    let fotosEstadoInicial = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i].file;
      try {
        const fotoURL = await uploadFoto(file); // Subir cada imagen y obtener la URL
        fotosEstadoInicial.push(fotoURL); // Guardar la URL en el array
      } catch (error) {
        notyf.error('Error al subir una o más fotos. Intente nuevamente.');
        return; // Detener la ejecución si hay un error
      }
    }

    // Cálculo del importe total
    const importe_total = selectedProducts.reduce((total, product) => {
      const precioNumerico = typeof product.precio_renta === 'string'
        ? parseFloat(product.precio_renta.replace(/,/g, ''))
        : product.precio_renta || 0; // Asegúrate de que sea un número válido
      const cantidad = product.cantidad || 0; // Asegúrate de que cantidad tenga un valor válido
      const dias = dias_contados || 1; // Usa 1 como valor predeterminado para días
      return total + (precioNumerico * cantidad * dias);
    }, 0).toFixed(2); // Redondea a 2 decimales

    // Preparar los datos para enviar al backend
    const datos = {
      productos: selectedProducts.map((product) => ({
        nombre: product.nombre,
        cantidad: product.cantidad,
        codigo: product.codigo,
        descripcion: product.descripcion || '',
        precio_unitario: parseFloat(product.precio_renta).toFixed(2), // Asegúrate de que esté formateado como número
        _id: product._id,
      })),
      importe_total: parseFloat(importe_total), // Asegúrate de que sea un número
      fotos_estado_inicial: fotosEstadoInicial,
      usuario_retandor: localStorage.getItem('usuario'),
      nombre_encargado: localStorage.getItem('nombre'),
      fecha_renta: fecha_renta_formateada,
      hora_renta: hora_renta,
      hora_vencimiento: hora_renta,
      observacion_inicial: detalle || '',
      cliente: cliente_Selected,
      folio: nuevoFolio,
      fecha_vencimiento: vencimientoFormateado,
      detalles_maquinaria: selectedProducts.map((product) => product.descripcion || ''),
      direccion: direccion || '',
      dias_contados: dias_contados || 1,
      IVA: selectedIVA || 'NO',
    };

    console.log(datos); // Verificar los datos antes de enviarlos

    // Enviar la solicitud POST con los datos
    await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/create`, datos);

    // Actualizar el stock de los productos
    for (const product of selectedProducts) {
      const data_update = {
        stock: product.stock - product.cantidad,
      };
      await axios.put(`https://backrecordatoriorenta-production.up.railway.app/api/products/update/${product._id}`, data_update);
    }

    Swal.fire({
      icon: 'success',
      title: 'Renta generada',
      text: 'Para ver la renta generada ve a la sección de historial de rentas.',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false, // Evita que se cierre al hacer clic fuera
      allowEscapeKey: false, // Evita que se cierre al presionar la tecla Escape
      confirmButtonColor: '#0D6EFD',
    }).then(() => {
      // Recargar la página después de que se haga clic en "Aceptar"
      localStorage.removeItem('selectedProducts');
      window.location.reload();
    });
  } catch (error) {
    console.error('Error al generar la renta:', error.response?.data || error.message);
    notyf.error('Error al generar la renta. Verifique los datos e intente nuevamente.');
    Swal.close();
  }
}
const importe_total = selectedProducts.reduce((total, product) => {
  const precioNumerico = typeof product.precio_renta === 'string'
    ? parseFloat(product.precio_renta.replace(/,/g, ''))
    : product.precio_renta || 0; // Asegúrate de que sea un número válido
  const cantidad = product.cantidad || 0; // Asegúrate de que cantidad tenga un valor válido
  const dias = dias_contados || 1; // Usa 1 como valor predeterminado para días
  return total + (precioNumerico * cantidad * dias);
}, 0).toFixed(2); // Redondea a 2 decimales
return (
  <>
    <Navbar/>
      <div className="w-full  lg:h-[90vh] flex">
        <div className="w-full flex lg:flex-row flex-col-reverse justify-center items-center bg-[#EBEBEB] relative h-full">
          <div className="lg:w-[50%] w-full  items-center py-[1rem] overflow-y-auto h-full bg-[white] flex flex-col px-[1rem] gap-4">
            <p className="text-[1.2rem] font-semibold">Pedido de renta en curso</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem', tableLayout: 'fixed'}}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Equipo</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Importe</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-[0.5rem]">
                      No se han seleccionado equipos
                    </td>
                  </tr>
                ) : (
                  selectedProducts.map((product) => (
                    <>
                    <tr key={product.codigo}>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        {product.nombre}
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
    (typeof product.precio_renta === 'string'
      ? parseFloat(product.precio_renta.replace(/,/g, ''))
      : product.precio_renta || 0) * (product.cantidad || 0)
  )}
</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        <span className="mx-2">{product.cantidad}</span>
                      </td>
                    </tr>
                    </>
                  ))
                )}
                {selectedProducts.length > 0 && (
                  <tr>
          <td colSpan="2" className="text-end py-[0.5rem] px-[1rem]">
            Importe total por {dias_contados} días: 
          </td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
  ${selectedProducts
    .reduce((total, product) => {
      const precioNumerico = parseFloat(product.precio_renta.replace(/,/g, '')); // Limpia las comas y convierte a número
      return total + (precioNumerico * product.cantidad * dias_contados);
    }, 0) // Valor inicial
    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</td>
        </tr>
                )}
              </tbody>
            </table>
      {selectedProducts.length > 0 && (
        <div className='w-full flex flex-col text-[0.8rem]'>
           <div className='flex flex-col gap-2 py-[1rem]'>
      <h3 className='font-bold text-[1.1rem]'>Rellenar Datos del cliente:</h3>
      <label className='flex gap-2'>
        <input
          type="radio"
          name="options"
          value="registrado"
          checked={selectedOption === 'registrado'}
          onChange={capturarSelect}
        />
        Usar datos de cliente registrado
      </label>
      <label className='flex gap-2'>
        <input
          type="radio"
          name="options"
          value="no registrado"
          checked={selectedOption === 'no registrado'}
          onChange={capturarSelect}
        />
        Registrar datos de cliente nuevo
      </label>
      
    </div>
    {selectedOption === 'registrado' && (
      <>
      <div class="mb-3">
        <label htmlFor="" className='font-bold lg:text-[1.1rem] pb-3'>Buscar cliente registrado</label>
      <div className="relative w-full">
  <div className="flex items-center space-x-2">
    <input
      type="text"
      ref={input_nombre_cliente}
      value={nombre_cliente}
      onChange={handleSearchClient}  // Busca mientras escribes
      placeholder="Nombre del cliente"
      className="w-full p-2 border rounded-md"
    />
    {cliente_Selected && (
      <button
      onClick={() => {
        setNombre_cliente("");           // Limpia el estado del input
        setCliente_selected(null);       // Limpia la selección del cliente
        input_nombre_cliente.current.focus(); // Vuelve a enfocar el input después de limpiar
      }}
      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Limpiar
    </button>
    )}
  </div>

  {filteredClients.length > 0 && (
    <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto shadow-md mt-1">
      {filteredClients.slice(0, 5).map((client, index) => (
        <li
          key={index}
          className="p-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => {
            selectClient(client);        // Selecciona el cliente
            setNombre_cliente(client.nombre); // Muestra el nombre en el input
          }}
        >
          {client.nombre}
        </li>
      ))}
    </ul>
  )}
</div>
        </div>
        {cliente_Selected && (
          <>
          <div class="mb-3 flex flex-col">
            <label  for="exampleInputPassword1" class="form-label font-bold">Fecha de Renta:</label>
            <DatePicker showMonthDropdown  yearDropdownItemNumber={15} scrollableYearDropdown showYearDropdown locale={es} selected={fecha_renta} dateFormat='dd/MM/yyyy' onChange={(date) => setFecha_renta(date)}   className=' w-full border-solid border-[1px] border-[gray] rounded-[5px] py-[0.2rem] px-[0.5rem]' showIcon/>
          </div>
          <div class="mb-3">
            <label  for="exampleInputPassword1" class="form-label font-bold">Hora de la renta</label>
            <input ref={input_hora_renta} onChange={captureHora_renta}  placeholder='HORA:MINUTOS' type="text" class="form-control" id="exampleInputPassword1"/>
         </div>
          <div class="mb-3 flex flex-col">
            <label  for="exampleInputPassword1" class="form-label font-bold">Fecha de vencimiento:</label>
            <DatePicker showMonthDropdown  yearDropdownItemNumber={15} scrollableYearDropdown showYearDropdown locale={es} selected={fecha_vencimiento} dateFormat='dd/MM/yyyy' onChange={(date) => setFecha_Vencimiento(date)}   className=' w-full border-solid border-[1px] border-[gray] rounded-[5px] py-[0.2rem] px-[0.5rem]' showIcon/>
          </div>
          
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Dirección de uso: (Donde ser usarán los equipos) *obligatorio</label>
          <input ref={input_direccion} onChange={captureDireccion} type="text" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div className="mb-3">
          <label htmlFor="photoInput" className="block font-bold text-gray-700 mb-2">Foto como se entrega el equipo:</label>
          <input type="file" id="photoInput" accept="image/*" ref={input_foto} multiple onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <div className="flex overflow-x-auto  gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 mt-3">
            {files.map((image, index) => (
            <div key={image.id}  className="relative">
              <img src={image.src} alt={image.name} className="h-24 w-24 object-cover rounded shadow"/>
              <button onClick={() => handleRemoveImage(image.id, index)} className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1 px-2 rounded-full transform -translate-y-1 -translate-x-0">X</button>
            </div>
            ))}
          </div>
          </div>
          <div class="mb-3">
            <label  for="exampleInputPassword1" class="form-label font-bold">Observación del encargado (opcional):</label>
            <textarea ref={input_detalle} onChange={captureDetalle} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
          </div>
          <div className='flex flex-col gap-2 py-[1rem]'>
      <h3 className='font-bold text-[1.1rem]'>Aplica IVA?</h3>
      <label className='flex gap-2'>
        <input
          type="radio"
          name="options3"
          value="SI"
          checked={selectedIVA === 'SI'}
          onChange={capturarSelectIVA}
        />
        SI
      </label>
      <label className='flex gap-2'>
        <input
          type="radio"
          name="options3"
          value="NO"
          checked={selectedIVA === 'NO'}
          onChange={capturarSelectIVA}
        />
        NO
      </label>
      
    </div>
          <div class="mb-1 w-full flex justify-center items-center">
            <button onClick={generar_rentas} className='bg-primary px-[1rem] py-[0.5rem] text-white rounded-[5px]'>Generar renta</button>
          </div>
          </>
        )}
      </>
    )}
    {selectedOption === 'no registrado' && (
      <>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Nombre del cliente:</label>
          <input ref={input_nombre_cliente} onChange={captureNombre} type="text" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">WhatsApp:</label>
          <input ref={input_celular} onChange={captureCelular} type="text" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Foto INE Delantero:</label>
          <input  ref={inputIne_delantero} onChange={captureFoto_delantera} type="file" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Foto INE Trasero:</label>
          <input  ref={inputIne_trasero} onChange={captureFoto_trasera} type="file" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div className='pb-[1rem]'>
          <button onClick={create_clientes} disabled={info_registro === 'confirm'} className='bg-[#006aff] disabled:bg-[gray] text-white py-[0.5rem] px-[1rem] text-[1.05rem] rounded-[10px]'>Registrar Usuario</button>
        </div>
        {info_registro === 'confirm' && (
          <>
            <div class="mb-3 flex flex-col">
              <label  for="exampleInputPassword1" class="form-label font-bold">Fecha de Renta:</label>
              <DatePicker showMonthDropdown  yearDropdownItemNumber={15} scrollableYearDropdown showYearDropdown locale={es} selected={fecha_renta} dateFormat='dd/MM/yyyy' onChange={(date) => setFecha_renta(date)}   className=' w-full border-solid border-[1px] border-[gray] rounded-[5px] py-[0.2rem] px-[0.5rem]' showIcon/>
            </div>
            <div class="mb-3">
              <label  for="exampleInputPassword1" class="form-label font-bold">Hora de la renta</label>
              <input ref={input_hora_renta} onChange={captureHora_renta}  placeholder='HORA:MINUTOS' type="text" class="form-control" id="exampleInputPassword1"/>
            </div>
            <div class="mb-3 flex flex-col">
              <label  for="exampleInputPassword1" class="form-label font-bold">Fecha de vencimiento:</label>
              <DatePicker showMonthDropdown  yearDropdownItemNumber={15} scrollableYearDropdown showYearDropdown locale={es} selected={fecha_vencimiento} dateFormat='dd/MM/yyyy' onChange={(date) => setFecha_Vencimiento(date)}   className=' w-full border-solid border-[1px] border-[gray] rounded-[5px] py-[0.2rem] px-[0.5rem]' showIcon/>
            </div>
            <div class="mb-3">
              <label  for="exampleInputPassword1" class="form-label font-bold">Dirección de uso: (Donde ser usarán los equipos) *obligatorio</label>
              <input ref={input_direccion} onChange={captureDireccion} type="text" class="form-control" id="exampleInputPassword1"/>
            </div>
            <div className="mb-3">
              <label htmlFor="photoInput" className="block font-bold text-gray-700 mb-2">Fotos como se entrega el equipo:</label>
              <input type="file" id="photoInput" accept="image/*" ref={input_foto} multiple onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              <div className="flex overflow-x-auto  gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 mt-3">
              {files.map((image, index) => (
                <div key={image.id}  className="relative">
                  <img src={image.src} alt={image.name} className="h-24 w-24 object-cover rounded shadow"/>
                  <button onClick={() => handleRemoveImage(image.id, index)} className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1 px-2 rounded-full transform -translate-y-1 -translate-x-0">X</button>
                </div>
              ))}
              </div>
            </div>
            <div class="mb-3">
              <label  for="exampleInputPassword1" class="form-label font-bold">Observación del encargado (opcional):</label>
              <textarea ref={input_detalle} onChange={captureDetalle} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            <div className='flex flex-col gap-2 py-[1rem]'>
      <h3 className='font-bold text-[1.1rem]'>Aplica IVA?</h3>
      <label className='flex gap-2'>
        <input
          type="radio"
          name="options2"
          value="SI"
          checked={selectedIVA === 'SI'}
          onChange={capturarSelectIVA}
        />
        SI
      </label>
      <label className='flex gap-2'>
        <input
          type="radio"
          name="options2"
          value="NO"
          checked={selectedIVA === 'NO'}
          onChange={capturarSelectIVA}
        />
        NO
      </label>
      
    </div>
            <div class="mb-1 w-full flex justify-center items-center">
              <button onClick={generar_rentas} className='bg-primary px-[1rem] py-[0.5rem] text-white rounded-[5px]'>Generar renta</button>
            </div>
          </>
          )}
        </>
        )}
        </div>
        )}
        </div>
          <div className="lg:w-[50%] w-full flex flex-col gap-3 h-full bg-[#323B75] px-[1rem] py-[1rem]">
            <p className="text-white text-[1.2rem] font-semibold">Selecciona los equipos a rentar</p>
            <div className="flex w-full">
              <div className="relative w-full items-center">
                <input type="text" placeholder="Buscar equipo por nombre o código..." className="w-full py-2 px-[1rem] border border-gray-300 rounded-l-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
                {searchTerm && (
                  <button onClick={clear} className="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </button>
                )}
              </div>
              <button className="px-[2rem] bg-primary text-white font-semibold rounded-r-[10px]" onClick={handleSearch}>Buscar</button>
            </div>
            {loading && (
              <div className="flex flex-col gap-2 text-center items-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 w-full overflow-y-auto  max-h-[75vh]">
            {filteredDatas.map((dat) => (
              <div className="w-full bg-[white] rounded-[10px] gap-3  flex justify-between items-center px-[1rem] lg:h-auto py-[0.5rem]"key={dat.codigo}>
                <div className="flex gap-4 items-center  overflow-x-auto">
                {dat.foto && <img className="w-[3rem] h-[3rem]" src={dat.foto} alt={dat.nombre} />}
                <p>{dat.nombre}</p>
              </div>
                {dat.stock > 0 ? ( selectedProducts.some((p) => p.codigo === dat.codigo) ? (
                <div className="flex gap-2">
            <button className="bg-primary rounded-[5px] lg:flex hidden text-white font-semibold px-[0.5rem]" onClick={() => handleQuantityChange(dat.codigo, -1)}>-</button>
              <span className="mx-2 lg:flex hidden">
                {selectedProducts.find((p) => p.codigo === dat.codigo)?.cantidad}
              </span>
              <button className={`bg-primary rounded-[5px] lg:flex hidden text-white font-semibold px-[0.5rem] ${selectedProducts.find((p) => p.codigo === dat.codigo)?.cantidad >= dat.stock ? 'cursor-not-allowed opacity-50' : ''}`} onClick={() => handleQuantityChange(dat.codigo, 1)} disabled={selectedProducts.find((p) => p.codigo === dat.codigo)?.cantidad >= dat.stock}>+</button>
              <button className="rounded-[5px] text-white font-semibold px-[0.5rem]" onClick={() => handleRemoveProduct(dat.codigo)}>
                <img className="w-[2.5rem] lg:w-[1rem]" src={trash} alt="" />
              </button>
              </div>
            ) : (
            <button className="px-[1rem] bg-primary py-[0.3rem] text-white rounded-[5px]" onClick={() => handleAddProduct(dat)} >Agregar</button>
            )) : (
            <button className="px-[1rem] py-[0.3rem] text-danger font-semibold rounded-[5px] bg-[#d2d1d15e] cursor-not-allowed" disabled>Rentado</button>
            )}
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);}
