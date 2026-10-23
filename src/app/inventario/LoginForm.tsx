'use client';

import { useActionState } from 'react';
import { login } from './actions';

const input = 'w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-white outline-none placeholder:text-white/25 focus:border-[#FAB413]/60';

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#FAB413]">Quattro Plaza Center</p>
        <h1 className="mt-1 text-[24px] font-semibold">Inventario</h1>
      </div>
      <input name="name" placeholder="Tu nombre" autoComplete="name" className={input} required />
      <input name="password" type="password" placeholder="Contraseña del equipo" autoComplete="current-password" className={input} required />
      {error && <p className="text-[13px] text-red-400">{error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-[#FAB413] py-2.5 text-[14px] font-semibold text-black disabled:opacity-50">
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
