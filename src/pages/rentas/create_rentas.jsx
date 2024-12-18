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
const [datas, setDatas] = useState([]); //productos traidos por axios
const [filteredDatas, setFilteredDatas] = useState([]); // productos filtrados
const [selectedProducts, setSelectedProducts] = useState([]); //se almacenan los productos seleccionados
const [searchTerm, setSearchTerm] = useState(''); //Se almacenan los terminos de busqueda
const [loading, setLoading] = useState(true); //estado para spinner de carga
const [detalle_maquinaria, setDetalle_maquinaria]=useState()
const [files, setFiles]=useState([])
const [identificador, setIdentificador]=useState()
const [fecha_vencimiento, setFecha_Vencimiento]=useState(new Date())
const [detalle, setDetalle]=useState('')
const [nombre_cliente, setNombre_cliente]=useState()
const [celular, setCelular]=useState()
const [direccion, setDireccion]=useState()
const [selectedOption, setSelectedOption] = useState();
const [info_registro, setInfo_registro]=useState()
const [clients, setClients]=useState()
const [cliente_Selected, setCliente_selected]=useState()
const [foto_ine_delantero, setFoto_ine_delantero]=useState()
const [foto_ine_trasero, setIne_trasero]=useState()


//USEREF
const input_foto=useRef()
const input_detalle=useRef()
const input_nombre_cliente=useRef()
const input_celular=useRef()
const input_detalle_maquinaria=useRef()
const input_direccion=useRef()
const input_cliente_Selected=useRef()
const inputIne_delantero=useRef()
const inputIne_trasero=useRef()
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
function captureDetalle_maquinaria(){
  setDetalle_maquinaria(input_detalle_maquinaria.current.value)
  }
  function captureDireccion(){
    setDireccion(input_direccion.current.value)
    }
//FORMAT FECHA VENCIMIENTO
const formatear_vencimiento = fecha_vencimiento.toISOString().replace(/[-T]/g, ':').split(':');
const diaVencimiento=formatear_vencimiento[2]
const mesVencimiento=formatear_vencimiento[1]
const añoVencimiento=formatear_vencimiento[0]
const vencimientoFormateado=`${diaVencimiento}/${mesVencimiento}/${añoVencimiento}`


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

function generarIdentificador() {
  // Genera una cadena aleatoria de 11 números entre 1 y 9
  let identificador = '';
  for (let i = 0; i < 11; i++) {
    identificador += Math.floor(Math.random() * 9) + 1; // Genera números entre 1 y 9
  }

  // Configura el identificador con el prefijo "R-"
  const identificadorCompleto = `R-${identificador}`;
  setIdentificador(identificadorCompleto);
}

useEffect(() => {
generarIdentificador()
}, []);


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

//FUNCION PARA CREAR UNA RENTA
async function generar_rentas() {
  Swal.fire({
    title: 'Cargando, por favor espere...',
    didOpen: () => {
      Swal.showLoading();  // Mostrar el spinner de carga
    }
  });

  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const minuto = fecha.getMinutes().toString().padStart(2, '0');
  const hora = fecha.getHours().toString().padStart(2, '0');
  const segundos = fecha.getSeconds().toString().padStart(2, '0');
  const fecha_hoy = `${dia}/${mes}/${año}`;
  const hora_hoy = `${hora}:${minuto}:${segundos}`;

  if (!cliente_Selected || !localStorage.getItem('usuario') || !localStorage.getItem('nombre')) {
    return notyf.error('Datos incompletos, llene todos los campos excepto los que dicen opcional.');
  }

  // Subida de imágenes
  let fotosEstadoInicial = [];
  const selectedFiles = files; // Obtenemos todos los archivos seleccionados

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i].file;
    
    try {
      // Subir cada imagen y obtener la URL de Firebase
      const fotoURL = await uploadFoto(file);  // Asumiendo que uploadFoto devuelve la URL accesible
      fotosEstadoInicial.push(fotoURL);  // Guardar la URL en el array
    } catch (error) {
      notyf.error('Error al subir una o más fotos. Intente nuevamente.');
      return;  // Detener la ejecución si hay un error
    }
  }

  const datos = {
    productos: selectedProducts?.map((product) => ({
      nombre: product.nombre, // Nombre del producto
      cantidad: product.cantidad,
      codigo: product.codigo,
      precio_unitario: product.precio, // Precio por unidad
      precio_total_cantidad: (product.precio * product.cantidad).toFixed(2), // Precio total según cantidad
      _id: product._id
    })),
    importe_total: selectedProducts
      .reduce((total, product) => total + product.precio * product.cantidad, 0)
      .toFixed(2), // Importe total de todos los productos seleccionados
    fotos_estado_inicial: fotosEstadoInicial, // Las URLs de las fotos subidas
    usuario_retandor: localStorage.getItem('usuario'), // Usuario que está realizando la renta
    nombre_encargado:localStorage.getItem('nombre'),
    fecha_renta: fecha_hoy,
    hora_renta: hora_hoy,
    observacion_inicial: detalle,
    cliente:cliente_Selected,
    identificador: identificador,
    fecha_vencimiento: vencimientoFormateado,
    detalles_maquinaria:detalle_maquinaria,
    direccion:direccion
  };

  try {
    // Enviar la solicitud POST con los datos, incluyendo las URLs de las fotos
    await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/create`, datos);
    
    // Actualizar inventario de productos
    selectedProducts.forEach(async (product) => {
      const data_update = {
        stock: product.stock - product.cantidad,
      };
      console.log(data_update);
      await axios.put(`https://backrecordatoriorenta-production.up.railway.app/api/products/update/${product._id}`, data_update);
    });

    Swal.fire({
      icon: 'success',
      title: 'Renta generada',
      text: `El N° identificador para tu renta es ${identificador}, con este numero podrás identificar tus rentas en la sección historial de rentas.`,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false, // Evita que se cierre al hacer clic fuera
      allowEscapeKey: false, // Evita que se cierre al presionar la tecla Escape
      confirmButtonColor: '#0D6EFD'
    }).then(() => {
      // Recargar la página después de que se haga clic en "Aceptar"
      localStorage.removeItem('selectedProducts');
      window.location.reload();
    });
  } catch (error) {
    console.error('Error al generar la renta:', error);
  }
}
  return (
    <>
      <Navbar />
      
      <div className="w-full h-full flex">
        
        <div className="w-full flex lg:flex-row flex-col-reverse justify-center items-center bg-[#EBEBEB] relative h-[89.3vh]">
          <div className="lg:w-[50%] w-full items-center py-[1rem] overflow-y-auto h-full bg-[white] flex flex-col px-[1rem] gap-4">
            <p className="text-[1.2rem] font-semibold">Pedido de renta en curso</p>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'center',
                fontSize: '0.8rem',
                tableLayout: 'fixed',
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Producto</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Clave</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Importe</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-[0.5rem]">
                      No se han seleccionado productos
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
                        {product.codigo}
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        ${(product.precio * product.cantidad).toFixed(2)}
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
          <td colSpan="3" className="text-end py-[0.5rem] px-[1rem]">
            Importe total de la renta: 
          </td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
            ${selectedProducts.reduce((total, product) => total + (product.precio * product.cantidad), 0).toFixed(2)}
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
          <label  for="exampleInputPassword1" class="form-label font-bold">Seleccionar cliente registrado:</label>
            <select ref={input_cliente_Selected} onChange={captureCliente} class="form-select" aria-label="Default select example">
              <option selected>Selecciona un cliente</option>
              {clients.map(dat=>(
                <option value={dat._id}>{dat.nombre}</option>
              ))}
            </select>
        </div>
        {cliente_Selected && (
          <>
            <div class="mb-3 flex flex-col">
          <label  for="exampleInputPassword1" class="form-label font-bold">Fecha de vencimiento de la renta:</label>
          <DatePicker showMonthDropdown  yearDropdownItemNumber={15} scrollableYearDropdown showYearDropdown locale={es} selected={fecha_vencimiento} dateFormat='dd/MM/yyyy' onChange={(date) => setFecha_Vencimiento(date)}   className=' w-full border-solid border-[1px] border-[gray] rounded-[5px] py-[0.2rem] px-[0.5rem]' showIcon/>
        </div>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Dirección donde se usará lo rentado: (para el contrato) *obligatorio</label>
          <input ref={input_direccion} onChange={captureDireccion} type="text" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div className="mb-3">
    <label
      htmlFor="photoInput"
      className="block font-bold text-gray-700 mb-2"
    >
      Foto como se entrega el producto:
    </label>
    <input
      type="file"
      id="photoInput"
      accept="image/*"
      ref={input_foto}
      multiple
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <div className="flex overflow-x-auto  gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 mt-3">
      {files.map((image, index) => (
        <div key={image.id}  className="relative">
          <img
            src={image.src}
            alt={image.name}
            className="h-24 w-24 object-cover rounded shadow"
          />
          <button
            onClick={() => handleRemoveImage(image.id, index)}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1 px-2 rounded-full transform -translate-y-1 -translate-x-0"
          >
            X
          </button>
        </div>
      ))}
    </div>
  </div>
  <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Detalles de la maquinaria (para el contrato) *obligatorio:</label>
          <textarea ref={input_detalle_maquinaria} onChange={captureDetalle_maquinaria} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Observación inicial (opcional):</label>
          <textarea ref={input_detalle} onChange={captureDetalle} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
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
          <label  for="exampleInputPassword1" class="form-label font-bold">Fecha de vencimiento de la renta:</label>
          <DatePicker showMonthDropdown  yearDropdownItemNumber={15} scrollableYearDropdown showYearDropdown locale={es} selected={fecha_vencimiento} dateFormat='dd/MM/yyyy' onChange={(date) => setFecha_Vencimiento(date)}   className=' w-full border-solid border-[1px] border-[gray] rounded-[5px] py-[0.2rem] px-[0.5rem]' showIcon/>
        </div>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Dirección donde se usará lo rentado: (para el contrato) *obligatorio</label>
          <input ref={input_direccion} onChange={captureDireccion} type="text" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div className="mb-3">
    <label
      htmlFor="photoInput"
      className="block font-bold text-gray-700 mb-2"
    >
      Fotos de cómo recibe el cliente los productos:
    </label>
    <input
      type="file"
      id="photoInput"
      accept="image/*"
      ref={input_foto}
      multiple
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <div className="flex overflow-x-auto  gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 mt-3">
      {files.map((image, index) => (
        <div key={image.id}  className="relative">
          <img
            src={image.src}
            alt={image.name}
            className="h-24 w-24 object-cover rounded shadow"
          />
          <button
            onClick={() => handleRemoveImage(image.id, index)}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1 px-2 rounded-full transform -translate-y-1 -translate-x-0"
          >
            X
          </button>
        </div>
      ))}
    </div>
  </div>
  <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Detalles de la maquinaria (para el contrato) *obligatorio:</label>
          <textarea ref={input_detalle_maquinaria} onChange={captureDetalle_maquinaria} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label  for="exampleInputPassword1" class="form-label font-bold">Observación inicial (opcional):</label>
          <textarea ref={input_detalle} onChange={captureDetalle} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
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
          <div className="lg:w-[50%] w-full  flex flex-col gap-3 h-full bg-[#3B5A75] px-[1rem] py-[1rem]">
            <p className="text-white text-[1.2rem] font-semibold">Selecciona los productos a rentar</p>
            <div className="flex w-full">
              <div className="relative w-full items-center">
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código de producto..."
                  className="w-full py-2 px-[1rem] border border-gray-300 rounded-l-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {searchTerm && (
                  <button onClick={clear} className="absolute right-2 top-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-x"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                className="px-[2rem] bg-primary text-white font-semibold rounded-r-[10px]"
                onClick={handleSearch}
              >
                Buscar
              </button>
            </div>
            {loading && (
               <div className="flex flex-col gap-2 text-center items-center">
               <div className="spinner-border text-primary" role="status">
                 <span className="visually-hidden">Loading...</span>
               </div>
               </div>
            )}
            <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[40vh]">
  {filteredDatas.map((dat) => (
    <div
      className="w-full bg-[white] rounded-[10px] flex justify-between items-center px-[1rem] h-auto py-[0.5rem]"
      key={dat.codigo}
    >
      <div className="flex gap-4 items-center">
        {dat.foto && <img className="w-[3rem] h-[3rem]" src={dat.foto} alt={dat.nombre} />}
        <p>
          {dat.nombre}
        </p>
        
      </div>

      {dat.stock > 0 ? (
        selectedProducts.some((p) => p.codigo === dat.codigo) ? (
          <div className="flex gap-2">
            <button
              className="bg-primary rounded-[5px] text-white font-semibold px-[0.5rem]"
              onClick={() => handleQuantityChange(dat.codigo, -1)}
            >
              -
            </button>
            <span className="mx-2">
              {selectedProducts.find((p) => p.codigo === dat.codigo)?.cantidad}
            </span>
            <button
              className={`bg-primary rounded-[5px] text-white font-semibold px-[0.5rem] ${selectedProducts.find((p) => p.codigo === dat.codigo)?.cantidad >= dat.stock ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() => handleQuantityChange(dat.codigo, 1)}
              disabled={selectedProducts.find((p) => p.codigo === dat.codigo)?.cantidad >= dat.stock}
            >
              +
            </button>
            <button
              className="rounded-[5px] text-white font-semibold px-[0.5rem]"
              onClick={() => handleRemoveProduct(dat.codigo)}
            >
              <img className="w-[1rem]" src={trash} alt="" />
            </button>
          </div>
        ) : (
          <button
            className="px-[1rem] bg-primary py-[0.3rem] text-white rounded-[5px]"
            onClick={() => handleAddProduct(dat)}
          >
            Agregar
          </button>
        )
      ) : (
        <button
          className="px-[1rem] py-[0.3rem] text-white rounded-[5px] bg-gray-400 cursor-not-allowed"
          disabled
        >
          Agotado
        </button>
      )}
    </div>
  ))}
</div>

          </div>
        </div>
      </div>
    </>
  );
}
