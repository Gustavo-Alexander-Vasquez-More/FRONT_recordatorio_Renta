import React, { useEffect, useRef, useState } from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  View,
  Text,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import page0 from "../../images/imagenes_pdf_contrato/rm-remision_page-0001.jpg";
import axios from "axios";
import { useParams } from "react-router-dom";
const nota_remision_manual = () => {
  const [loading, setLoading] = useState(null);
  const [datas, setDatas] = useState([]);
  const [qr, setQr]=useState()
  const { _id } = useParams();
  async function get() {
    try {
      const { data } = await axios.get(
        `https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/read_especific?_id=${_id}`
      );
      setDatas(data.response);
      setLoading(false); // Datos cargados, actualizamos el estado de carga
    } catch (error) {
      console.error("Error fetching image data:", error);
      setLoading(false); // Si hay un error, dejamos de mostrar el estado de carga
    }
  }
const generateQR = async () => {
    const link = `https://rentas.rentamecarmen.com.mx/collection/${_id}`;
    const qrDataURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}`;
  try {
    const response = await fetch(qrDataURL);
    const blob = await response.blob();
    const qrImageFile = new File([blob], 'qr.png', { type: 'image/png'});
    setQr(URL.createObjectURL(qrImageFile))
    } catch (error) {
    }
  };
  useEffect(() => {
   generateQR()
  }, [_id]);
  useEffect(() => {
    get();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document title={`NOTA DE REMISION`}>
        {datas.map((dat) => {
          return (
            <>
              <Page size="LETTER">
                <View style={{ position: "relative", width: "100%" }}>
                  <Image
                    onLoad={() => setImageLoaded(true)}
                    style={{ position: "absolute", width: "100%" }}
                    src={`${page0}`}
                  />
                </View>
                <Text style={{ position: "absolute", top: "6.3%", fontSize: 5, left: "93.15%" }}>
                  .mx 
                </Text>
                <Text style={{ position: "absolute", top: "12%", fontSize: 13, left: "81%", color:"red", fontFamily: "Helvetica-Bold" }}>
                  {dat.folio_remision} 
                </Text>
                <Text style={{ position: "absolute", top: "19.4%", fontSize: 9, left: "11.5%" }}>
                  {dat.nombre} 
                </Text>
                <Text style={{ position: "absolute", top: "22.4%", fontSize: 9, left: "12%" }}>
                  {dat.domicilio}
                </Text>
                <View
  style={{
    position: "absolute",
    top: "24.6%",
    left: "3.2%",
    backgroundColor: "white",
    paddingHorizontal: 4,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 300,
  }}
>
  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginRight: 4 }}>
    Teléfono:
  </Text>
  <Text style={{ fontSize: 9 }}>
    {dat.telefono}
  </Text>
</View>
                <Text style={{ position: "absolute", top: "19.6%", fontSize: 9, left: "74%" }}>
                  {dat.ciudad_estado}
                </Text>
                <Text style={{ position: "absolute", top: "22.5%", fontSize: 9, left: "69%" }}>
                  {dat.fecha_actual}
                </Text>
                <Text style={{ position: "absolute", top: "25.4%", fontSize: 9, left: "68%" }}>
                  {dat.hora_actual}
                </Text>
                {/* aca van los datos de la tabla */}
                {dat.productos &&
                  dat.productos.map((prod, idx) => (
                    <React.Fragment key={idx}>
                      <Text
                        style={{
                          position: "absolute",
                          top: `${31.7 + idx * 3}%`, // Ajusta el valor para espaciar filas verticalmente
                          left: "3.2%",
                          fontSize: 10,
                          width: "9%",
                          textAlign: "center",
                          paddingVertical: 5.5,
                        }}
                      >
                        {prod.cantidad}
                      </Text>
                      <Text
                        style={{
                          position: "absolute",
                          top: `${31.7 + idx * 3}%`,
                          left: "12.5%",
                          fontSize: 10,
                          width: "57%",
                          textAlign: "left",
                          paddingVertical: 5.5,
                          paddingLeft: 5,
                        }}
                      >
                        {prod.nombre} ({prod.dias_renta} {prod.dias_renta === 1 ? 'día' : 'días'})
                      </Text>
                      <Text
                        style={{
                          position: "absolute",
                          top: `${31.7 + idx * 3}%`,
                          left: "70%",
                          fontSize: 10,
                          width: "12%",
                          textAlign: "center",
                          paddingVertical: 5.5,
                        }}
                      >
                        {prod.precio_unitario.toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          position: "absolute",
                          top: `${31.7 + idx * 3}%`,
                          left: "82.5%",
                          fontSize: 10,
                          width: "13.4%",
                          textAlign: "center",
                          paddingVertical: 5.5,
                        }}
                      >
                        {prod.importe_total.toFixed(2)}
                      </Text>
                    </React.Fragment>
                  ))}
                 {dat.fotos.length > 0 && (
                   <View
  style={{
    position: 'absolute',
    top: '71%',
    left: '52%',
    width: '15.5%',
    alignItems: 'center',
    gap: 4, // Si gap no funciona en PDF, usa marginBottom en el QR o marginTop en el texto
  }}
>
  <Image
    style={{ width: '70%' }}
    src={qr}
  />
  <Text
    style={{
      width: '100%',
      fontSize: 9,
      textAlign: 'center',
      color: '#222',
      marginTop:0, // Espacio entre QR y texto
    }}
  >
    Escanea para ver las fotos de los equipos
  </Text>
</View>
                 )}
                <View
                  style={{
                    position: "absolute",
                    top: "87.7%",
                    left: "3.3%",
                    width: "66.1%",
                    fontSize: 10,
                    height: 46,
                    padding: 3,
                  }}
                >
                    
                  <Text>{dat.observaciones}</Text>
                </View>
                <Text style={{ position: "absolute", top: "85.5%", fontSize: 10, left: "84%" }}>
                  ${dat.total_remision.toFixed(2)}
                </Text>
                {dat.IVA && (
                  <Text style={{ position: "absolute", top: "88.3%", fontSize: 10, left: "84%" }}>
                    ${ (dat.total_remision * 0.16).toFixed(2) }
                  </Text>
                )}
                {dat.IVA ? (
                  <Text style={{ position: "absolute", top: "91.5%", fontSize: 10, left: "84%" }}>
                    ${ (dat.total_remision + (dat.total_remision * 0.16)).toFixed(2) }
                  </Text>
                ) : (
                  <Text style={{ position: "absolute", top: "91.5%", fontSize: 10, left: "84%" }}>
                    ${ (dat.total_remision).toFixed(2) }
                  </Text>
                )}
              </Page>
            </>
          );
        })}
      </Document>
    </PDFViewer>
  );
};

export default nota_remision_manual;
