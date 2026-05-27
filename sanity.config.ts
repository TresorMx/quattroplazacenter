import { defineConfig } from 'sanity';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – sanity/structure exports map lacks 'types' condition; runtime is correct
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { translateAction } from './sanity/actions/translateAction';
import { structure } from './sanity/desk';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'quattro-plaza-cms',
  title: 'Quattro Plaza Center',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, ctx) => {
      if (ctx.schemaType === 'plaza') {
        return [translateAction, ...prev];
      }
      return prev;
    },
  },
});
