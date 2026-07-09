'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import CotizadorPdf from './CotizadorPdf';
import type { Cotizacion, Bank } from '@/lib/cotizador-data';

interface Props {
  proyecto: string;
  asesor: string;
  broker: string;
  cliente: string;
  unidadLabel: string;
  m2: number;
  esquemaTxt: string;
  fechaCotizacion: string;
  cot: Cotizacion;
  bank: Bank;
  observaciones: string;
  fileName: string;
}

export default function DownloadPdfButton(props: Props) {
  const { fileName, ...pdfProps } = props;
  return (
    <PDFDownloadLink
      document={<CotizadorPdf {...pdfProps} />}
      fileName={fileName}
      className="inline-flex items-center gap-2 rounded-lg border border-[#FAB413] bg-[#FAB413]/10 px-4 py-2 text-[12px] font-bold text-[#FAB413] transition hover:bg-[#FAB413] hover:text-ink"
    >
      {({ loading }) => (
        <>
          <Download size={14} />
          {loading ? 'Generando…' : 'Descargar PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}
