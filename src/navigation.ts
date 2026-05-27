/**
 * next-intl locale-aware navigation helpers.
 * Importa Link, useRouter, usePathname, redirect desde aquí
 * en vez de 'next/navigation' para que el locale se maneje automáticamente.
 */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './i18n/routing';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
