import React, { useEffect, useRef, useState } from 'react';
import { Page, Document, Image, StyleSheet, View, Text, Font , PDFViewer } from '@react-pdf/renderer';
import page1 from '../../images/imagenes_pdf_contrato/CONTRATO-RENTA-PARA-IMPRIMIR_page-0001.jpg'
import page2 from '../../images/imagenes_pdf_contrato/CONTRATO-RENTA-PARA-IMPRIMIR_page-0002.jpg'
import page3 from '../../images/imagenes_pdf_contrato/CONTRATO-RENTA-PARA-IMPRIMIR_page-0003.jpg'
import page4 from '../../images/imagenes_pdf_contrato/CONTRATO-RENTA-PARA-IMPRIMIR_page-0004.jpg'
import page0 from '../../images/imagenes_pdf_contrato/rm remision_page-0001.jpg'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const contrato= ({_id}) => {
const [loading, setLoading]=useState(null)
const [datas, setDatas] = useState([]);
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
arrendador:{
    position:'absolute',
    top:171,
    fontSize:10.5,
    left:132
},
arrendatario:{
    position:'absolute',
    top:193,
    fontSize:10.5,
    left:95
},
dia_expedicion:{
    position:'absolute',
    top:484,
    fontSize:12,
    left:270
},
mes_expedicion:{
    position:'absolute',
    top:484,
    fontSize:12,
    left:310
},
año_expedicion:{
    position:'absolute',
    top:484,
    fontSize:12,
    left:343
},
dia_vencimiento:{
    position:'absolute',
    top:498,
    fontSize:12,
    left:75
},
mes_vencimiento:{
    position:'absolute',
    top:498,
    fontSize:12,
    left:115
},
año_vencimiento:{
    position:'absolute',
    top:498,
    fontSize:12,
    left:145
},
direccion:{
    position:'absolute',
    top:259.5,
    fontSize:10,
    left:70
},

box:{
    position:'absolute',
    top:259.5,
    fontSize:14,
    left:63,
    textDecoration:'underline',
    width:'80%',
    fontFamily:'Helvetica',
    lineHeight:2
},
arrendador2:{
    position:'absolute',
    top:315,
    fontSize:10,
    left:38,
    width:'33.3%',
    flexDirection:'row',
    justifyContent:'center'
},
arrendatario2:{
    position:'absolute',
    top:315,
    fontSize:10,
    left:294,
    width:'33.3%',
    flexDirection:'row',
    justifyContent:'center'
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

        const fecha_renta=dat.fecha_renta.split('/')
        const fecha_vencimiento=dat.fecha_vencimiento.split('/')
        
        const dia_expedicion=fecha_renta[0]
        const mes_expedicion=fecha_renta[1]
        const año_expedicion=fecha_renta[2]
        const dia_vencimiento=fecha_vencimiento[0]
        const mes_vencimiento=fecha_vencimiento[1]
        const año_vencimiento=fecha_vencimiento[2]

        return(
            <Document  title={`NOTA DE REMISION & CONTRATO`}>
                <Page size='A4'>
    <View style={styles.page}>
        <Image style={styles.plantilla} src={{ uri:`${page0}` , method: 'GET'}}/>
        <Text style={styles.nombre}>{dat.cliente.nombre}</Text>
        <Text style={styles.estado}>C. del carmen/CAMPECHE</Text>
        <Text style={styles.fecha}>{fecha_renta}</Text>
        <Text style={styles.hora}>{dat.hora_renta}</Text>
        <Text style={styles.total}>${dat.importe_total}</Text>
        <View style={styles.observacion}>
          <Text >{dat.observacion_inicial}</Text>
        </View>
        <View style={styles.box_products}>
        {dat.productos.map(dat2=>(
          <View style={styles.box_datas}>
            <View style={styles.box_1}>
              <Text >{dat2.cantidad}</Text>
            </View>
            <View style={styles.box_2}>
              <Text>{dat2.nombre}</Text>
            </View>
            <View style={styles.box_3}>
              <Text>${dat2.precio_unitario}</Text>
            </View>
            <View style={styles.box_4}>
              <Text>${dat2.precio_total_cantidad}</Text>
            </View>
            
          </View>
        ))}
          </View>
          <Text style={styles.telefono}>{dat.cliente.telefono}</Text>
          <Text style={styles.encargado}>Personal que atendió: {dat.nombre_encargado}</Text>
    </View>
</Page>
        <Page size='A4'>
            <View style={styles.page}>
                <Image style={styles.plantilla} src={{ uri:`${page1}` , method: 'GET'}}/>
                <Text style={styles.arrendador}>{dat.nombre_encargado.toUpperCase()}</Text>
                <Text style={styles.arrendatario}>{dat.cliente.nombre.toUpperCase()}</Text>
                <Text style={styles.dia_expedicion}>{dia_expedicion}</Text>
                <Text style={styles.mes_expedicion}>{mes_expedicion}</Text>
                <Text style={styles.año_expedicion}>{año_expedicion}</Text>
                <Text style={styles.dia_vencimiento}>{dia_vencimiento}</Text>
                <Text style={styles.mes_vencimiento}>{mes_vencimiento}</Text>
                <Text style={styles.año_vencimiento}>{año_vencimiento}</Text>
            </View>
        </Page>
        <Page size='A4'>
            <View style={styles.page}>
                <Image style={styles.plantilla} src={{ uri:`${page2}` , method: 'GET'}}/>
                <Text style={styles.direccion}>{dat.direccion}</Text>
            </View>
        </Page>
        <Page size='A4'>
            <View style={styles.page}>
                <Image style={styles.plantilla} src={{ uri:`${page3}` , method: 'GET'}}/>
                <View style={styles.box}>
                    <Text style={styles.detalles}>{dat.detalles_maquinaria}</Text>
                </View>
            </View>
        </Page>
        <Page size='A4'>
            <View style={styles.page}>
                <Image style={styles.plantilla} src={{ uri:`${page4}` , method: 'GET'}}/>
                <View style={styles.arrendador2}>
                    <Text >{dat.nombre_encargado.toUpperCase()}</Text>
                </View>
                <View style={styles.arrendatario2}>
                    <Text >{dat.cliente.nombre.toUpperCase()}</Text>
                </View>
            </View>
        </Page> 
    </Document>
        )
    })}


</>
);
};

export default contrato;