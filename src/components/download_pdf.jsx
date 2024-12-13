import React, { useEffect, useState } from 'react';
import {PDFDownloadLink} from '@react-pdf/renderer';
import Contrato from '../pages/PDF/contrato';
import axios from 'axios';
export default function download_pdf({close_modal2, id}) {

return (
    <div className='lg:w-[35%] w-[95%]  rounded-[10px] py-[2rem] flex flex-col gap-4 bg-white'>
      <div className='flex justify-end items-end  pr-[1rem]'>
        <button onClick={close_modal2}>
        <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>

        </button>
        
      </div>
      <div className='font-semibold flex justify-center items-center text-center'>
        <p>ESPERA A QUE SE GENERE EL PDF</p>
      </div>
      <PDFDownloadLink
            className='w-full '
             document={<Contrato _id={id} />}
             fileName={`NOTA DE REMISION & CONTRATO.pdf`}
             >
             {({ loading}) =>
          loading ?
              <div className='w-full  flex justify-center items-center'>
                 <div className='flex flex-col gap-2 items-center'>
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p>Generando PDF</p>
                 </div>
              </div> 
              :
              <>
              {id  && (
                <div className='w-full  flex justify-center items-center'>
                <button  className='bg-primary px-[1rem] py-[0.3rem] text-white font-semibold rounded-[5px]'>Descargar PDF</button>
              </div>
              )}
              </>
        }
      </PDFDownloadLink>
    </div>
  );
}