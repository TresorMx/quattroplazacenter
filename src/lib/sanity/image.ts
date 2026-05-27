import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any): string {
  if (!source?.asset) return '';
  return builder.image(source).auto('format').url();
}
