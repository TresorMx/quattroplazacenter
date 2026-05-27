import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getActivePlazasAsync, getPlazaBySlugAsync } from '@/lib/data';
import QuoteWizard from '@/components/QuoteWizard';

export async function generateStaticParams() {
  const plazas = await getActivePlazasAsync();
  return plazas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plaza = await getPlazaBySlugAsync(slug);
  return {
    title: `Cotizar — ${plaza?.shortName ?? 'Quattro'}`,
    description: `Cotiza tu local en ${plaza?.name}. Planes flexibles, descuentos por pronto pago, apartado reembolsable de $50,000 MXN.`,
    robots: { index: false },
  };
}

export default async function CotizarPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ unit?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const plaza = await getPlazaBySlugAsync(slug);
  if (!plaza || plaza.comingSoon) notFound();

  const preselected = sp.unit
    ? plaza.units?.find((u) => u.id === sp.unit)
    : undefined;

  return (
    <>
      <section className="border-b border-line bg-bg-soft/40 pt-24 pb-10">
        <div className="container-wrap">
          <span className="eyebrow eyebrow-accent block">— Cotizador</span>
          <h1 className="mt-3 font-serif text-[clamp(36px,5vw,64px)] font-light italic leading-tight">
            Cotiza tu local en {plaza.shortName}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-ink-3">
            En 4 pasos generamos tu propuesta con tabla de pagos personalizada. Te enviamos PDF al instante.
          </p>
        </div>
      </section>

      <QuoteWizard plaza={plaza} preselectedUnit={preselected} />
    </>
  );
}
