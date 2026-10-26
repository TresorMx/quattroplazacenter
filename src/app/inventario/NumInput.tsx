'use client';

import { useState } from 'react';

// Campo numérico que guarda lo que se está tecleando: con un input controlado
// por número, "2." se convertía en 2 y no se podían escribir decimales (2.5 %, 9.95 %).
export default function NumInput({ value, onChange, className, decimals = true }: {
  value: number | null;
  onChange: (v: number | null) => void;
  className: string;
  decimals?: boolean;
}) {
  const show = (v: number | null) => (v == null ? '' : String(v));
  const [txt, setTxt] = useState(show(value));
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    // Cambio desde fuera (Deshacer, otra fórmula): se refleja si no es lo que ya se tecleó.
    setPrev(value);
    if ((txt === '' ? null : Number(txt)) !== value) setTxt(show(value));
  }
  return (
    <input
      inputMode={decimals ? 'decimal' : 'numeric'}
      className={className}
      value={txt}
      onChange={(e) => {
        // Acepta coma o punto decimal: los teclados en español (iPhone, Mac) escriben coma.
        let raw = e.target.value.replace(/,/g, decimals ? '.' : '').replace(decimals ? /[^0-9.]/g : /[^0-9]/g, '');
        if (decimals) raw = raw.replace(/(\..*)\./g, '$1'); // un solo punto
        setTxt(raw);
        onChange(raw === '' || raw === '.' ? null : Number(raw));
      }}
    />
  );
}
