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
            name:        doc.name,
            tagline:     doc.tagline,
            description: doc.description,
            highlights:  doc.highlights,
            unitSpecsTemplate: doc.unitSpecsTemplate,
            floorPlans:  doc.floorPlans,
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        const translations = await res.json();

        // Patch con los campos traducidos
        patch.execute([
          { set: { nameEn:        translations.nameEn ?? doc.nameEn } },
          { set: { taglineEn:     translations.taglineEn ?? doc.taglineEn } },
          { set: { descriptionEn: translations.descriptionEn ?? doc.descriptionEn } },
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
