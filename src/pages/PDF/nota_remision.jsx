import React, { useEffect, useRef, useState } from 'react';
import { Page, Document, Image, StyleSheet, View, Text, Font , PDFViewer } from '@react-pdf/renderer';
import page1 from '../../images/imagenes_pdf_contrato/rm remision_page-0001.jpg'
import axios from 'axios';

const Nota_remision= ({_id}) => {
const [loading, setLoading]=useState(null)
const [datas, setDatas] = useState([]);
console.log(datas);
console.log(datas);

async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`);
      setDatas(data.response);
      setLoading(false); // Datos cargados, actualizamos el estado de carga
    } catch (error) {
      console.error('Error fetching image data:', error);
      setLoading(false); // Si hay un error, dejamos de mostrar el estado de carga
    }
  }

  useEffect(() => {
    get();
  }, []);
const styles = StyleSheet.create({
page:{
    position:'relative',
    width:'100%'
},
plantilla:{
    position:'absolute',
    width:'100%',
    
},
box_products:{
  
  width:'93%',
  height:400,
  position:'absolute',
  top:247,
  left:18,
  flexDirection:'column'
},
box_datas:{
  
  width:'100%',
  height:22.5,
  fontSize:11,
  flexDirection:'row',
  alignItems:'center',
 
},
box_1:{
  
  height:20,
  flexDirection:'row',
  alignItems:'center',
  width:'9.7%',
  justifyContent:'center',
  
},
box_2:{
  
  height:20,
  flexDirection:'row',
  alignItems:'center',
  width:'62%',
  justifyContent:'flex-start',
  paddingLeft:10
  },
  box_3:{
    
    height:20,
    flexDirection:'row',
    alignItems:'center',
    width:'14%',
    justifyContent:'center',
    
    },
    box_4:{
      
      height:20,
      flexDirection:'row',
      alignItems:'center',
      width:'14.5%',
      justifyContent:'center',
      
      },
      total:{
        position:'absolute',
        top:713,
        fontSize:11,
        left:495
      },
      nombre:{
        position:'absolute',
        fontSize:9,
        top:151,
        left:67
      },
      telefono:{
        position:'absolute',
        fontSize:9,
        top:173,
        left:67
      },
      estado:{
        position:'absolute',
        fontSize:9,
        top:151,
        left:443
      },
      fecha:{
        position:'absolute',
        fontSize:10,
        top:174,
        left:405,
      },
      hora:{
        position:'absolute',
        fontSize:10,
        top:197,
        left:405,
      },
      observacion:{
        position:'absolute',
        fontSize:9,
        top:685,
        left:20,
        width:'66%',
        height:43,
        paddingLeft:2
      },
      encargado:{
        position:'absolute',
        fontSize:9,
        top:750,
        left:20,
        
      }
});

return (
<>
{datas.map(dat=>{

const fecha_renta=dat.fecha_renta

return(
    <Document  title={`NOTA DE REMISION`}>


</Document>
)
})}
</>
);
};

export default Nota_remision;