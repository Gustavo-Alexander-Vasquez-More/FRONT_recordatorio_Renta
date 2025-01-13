import React, { useEffect, useRef, useState } from 'react';
import { Page, Document, Image, StyleSheet, View, Text } from '@react-pdf/renderer';
import plantilla from '../../images/ficha_tecnica.jpg'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ficha_tecnica= ({_id}) => {
const [loading, setLoading]=useState(null)
const [datas, setDatas] = useState([]);


async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${_id}`);
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
nombre:{
position:'absolute',
top:116,
left:'6.8%',
height:47,
width:'85.2%',
flexDirection:'row',
justifyContent:'center',
alignItems:'center',
fontSize:13
},
foto:{
  position:'absolute',
  top:186.2,
  left:'48.7%',
  height:178.7,
  width:'43.5%',
},
datos:{
  position:'absolute',
  top:240.2,
  left:40,
  width:'38.7%',
  height:125,
  fontSize:13,
  flexDirection:'column',
  justifyContent:'center',
  gap:10,
  paddingLeft:6
},
detalles:{
  position:'absolute',
  top:451,
  left:40,
  width:'85.2%',
  height:332,
  fontSize:13,
  paddingVertical:6,
  paddingHorizontal:6
},
});

return (
<>
{datas.map(dat=>{

return(
<Document  title={`Ficha tecnica.pdf`}>
<Page size='A4'>
  <View style={styles.page}>
<Image style={styles.plantilla} src={{ uri:`${plantilla}` , method: 'GET'}}/>
<View style={styles.nombre}>
<Text >{dat.nombre.toUpperCase()}</Text>
</View>
<View style={styles.foto}>
<Image  src={{ uri:`${dat.foto}` , method: 'GET'}}/>
</View>
<View style={styles.datos}>
<Text>CODIGO DEL PRODUCTO</Text>
<Text>{dat.codigo}</Text>
<Text>PRECIO DEL PRODUCTO</Text>
<Text>${dat.precio} MXN</Text>
</View>
<View style={styles.detalles}>
<Text>{dat.descripcion.toUpperCase()}</Text>
</View>
</View>
</Page>
</Document>
)
})}
</>
);
};

export default ficha_tecnica;