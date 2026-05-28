'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { set, unset, useClient, useFormValue } from 'sanity';
import type { ObjectInputProps } from 'sanity';

/**
 * PinPlacer — input visual para colocar el pin del local en el master plan.
 *
 * Cómo funciona:
 *  1. Lee el `plazaRef` del documento unit actual.
 *  2. Fetch del master plan image de esa plaza.
 *  3. Muestra la imagen; al hacer click calcula x,y (0–1) relativos.
 *  4. Guarda { x, y } en el campo `pin`.
 */
export function PinPlacer(props: ObjectInputProps) {
  const { value, onChange } = props;

  // Lee el slug y nivel del documento padre
  const plazaSlug = useFormValue(['plazaSlug']) as string | undefined;
  const level = useFormValue(['level']) as number | undefined;

  const client = useClient({ apiVersion: '2024-01-01' });
  const [masterPlanUrl, setMasterPlanUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Fetch master plan cuando cambia el slug de plaza
  useEffect(() => {
    if (!plazaSlug) return;
    setLoading(true);
    const field = Number(level) === 2 ? 'masterPlanLevel2' : 'masterPlanImage';
    client
      .fetch(
        `*[_type == "plaza" && slug.current == $slug][0]{
          "url": ${field}.asset->url
        }`,
        { slug: plazaSlug }
      )
      .then((res: any) => setMasterPlanUrl(res?.url ?? null))
      .catch(() => setMasterPlanUrl(null))
      .finally(() => setLoading(false));
  }, [plazaSlug, level, client]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      const img = imgRef.current;
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const x = parseFloat(((e.clientX - rect.left) / rect.width).toFixed(4));
      const y = parseFloat(((e.clientY - rect.top) / rect.height).toFixed(4));
      onChange([set(x, ['x']), set(y, ['y'])]);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange([unset(['x']), unset(['y'])]);
  }, [onChange]);

  if (!plazaSlug) {
    return (
      <div style={{ padding: '12px', background: '#f4f4f4', borderRadius: 6, fontSize: 13, color: '#666' }}>
        Primero selecciona la plaza en el campo <strong>Plaza (slug)</strong> de arriba para poder colocar el pin.
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '12px', fontSize: 13, color: '#666' }}>Cargando master plan…</div>;
  }

  if (!masterPlanUrl) {
    return (
      <div style={{ padding: '12px', background: '#fff3cd', borderRadius: 6, fontSize: 13 }}>
        La plaza <strong>{plazaSlug}</strong> no tiene master plan cargado todavía.
      </div>
    );
  }

  const px = value?.x != null ? `${(value.x * 100).toFixed(1)}%` : null;
  const py = value?.y != null ? `${(value.y * 100).toFixed(1)}%` : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Instrucción */}
      <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
        Mostrando <strong>Nivel {level === 2 ? '2' : '1'}</strong> — haz click para colocar el pin.
        {px && py && (
          <span style={{ marginLeft: 8, fontWeight: 600, color: '#0070f3' }}>
            Pin en {px}, {py}
          </span>
        )}
      </p>

      {/* Imagen + pin */}
      <div style={{ position: 'relative', display: 'inline-block', cursor: 'crosshair', maxWidth: '100%' }}>
        <img
          ref={imgRef}
          src={masterPlanUrl}
          alt="Master Plan"
          onClick={handleClick}
          style={{ display: 'block', width: '100%', borderRadius: 8, border: '1px solid #e0e0e0' }}
          draggable={false}
        />

        {/* Pin marker */}
        {value?.x != null && value?.y != null && (
          <div
            style={{
              position: 'absolute',
              left: `${value.x * 100}%`,
              top: `${value.y * 100}%`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              background: '#0070f3',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }} />
          </div>
        )}
      </div>

      {/* Clear button */}
      {value?.x != null && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            alignSelf: 'flex-start',
            padding: '4px 12px',
            fontSize: 12,
            border: '1px solid #ddd',
            borderRadius: 4,
            background: '#fff',
            cursor: 'pointer',
            color: '#c00',
          }}
        >
          Quitar pin
        </button>
      )}
    </div>
  );
}
