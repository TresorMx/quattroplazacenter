'use client';

import { useState } from 'react';
import { useClient, useDocumentOperation } from 'sanity';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

/**
 * Documento action: Traducir ES → EN
 * Aparece en el toolbar del Studio para documentos tipo 'plaza'.
 * Llama al endpoint /api/translate del sitio, que usa Claude API.
 */
export const translateAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, draft, published } = props;
  const [loading, setLoading] = useState(false);
  const { patch, commit } = useDocumentOperation(id, 'plaza');

  const doc = draft ?? published;

  return {
    label: loading ? 'Traduciendo…' : '🌐 Traducir al inglés',
    disabled: loading || !doc,
    title: 'Genera automáticamente los campos EN a partir del contenido ES usando Claude AI',
    onHandle: async () => {
      if (!doc) return;
      setLoading(true);

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:           doc.name,
            tagline:        doc.tagline,
            description:    doc.description,
            projectTitle:   doc.projectTitle,
            projectBody1:   doc.projectBody1,
            projectBody2:   doc.projectBody2,
            bullet1:        doc.bullet1,
            bullet2:        doc.bullet2,
            bullet3:        doc.bullet3,
            floorPlansDesc: doc.floorPlansDesc,
            highlights:     Array.isArray(doc.highlights) ? doc.highlights.map((h: any) => ({ label: h.label })) : [],
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        const t = await res.json();

        // Patch con todos los campos traducidos
        patch.execute([
          { set: { nameEn:           t.nameEn           ?? doc.nameEn } },
          { set: { taglineEn:        t.taglineEn        ?? doc.taglineEn } },
          { set: { descriptionEn:    t.descriptionEn    ?? doc.descriptionEn } },
          { set: { projectTitleEn:   t.projectTitleEn   ?? doc.projectTitleEn } },
          { set: { projectBody1En:   t.projectBody1En   ?? doc.projectBody1En } },
          { set: { projectBody2En:   t.projectBody2En   ?? doc.projectBody2En } },
          { set: { bullet1En:        t.bullet1En        ?? doc.bullet1En } },
          { set: { bullet2En:        t.bullet2En        ?? doc.bullet2En } },
          { set: { bullet3En:        t.bullet3En        ?? doc.bullet3En } },
          { set: { floorPlansDescEn: t.floorPlansDescEn ?? doc.floorPlansDescEn } },
          // Patch labelEn en cada highlight
          ...((t.highlights ?? []) as { labelEn: string }[]).map((h, i) => ({
            set: { [`highlights[${i}].labelEn`]: h.labelEn },
          })),
        ]);

        commit.execute();
      } catch (e) {
        console.error('[translateAction]', e);
        alert('Error al traducir. Verifica que ANTHROPIC_API_KEY esté configurado.');
      } finally {
        setLoading(false);
      }
    },
  };
};
