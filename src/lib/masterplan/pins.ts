import type { PlazaSlug } from '@/lib/inventory';

/* Centro de cada bolita, en puntos del PDF (origen abajo a la izquierda, página de 1920 × 1080).
   Salen de los master plan que David pineaba a mano, para que caigan exactamente igual.
   Base: public/master-plan-base/<slug>.pdf, página 1 = nivel 1 y página 2 = nivel 2. */
type Pins = Record<string, [x: number, y: number]>;

export const PIN_RADIUS = 20.05;

export const MASTER_PLAN_PINS: Record<PlazaSlug, Pins> = {
  gardens: {
    '101': [322.9, 595.1], '102': [419.6, 650.5], '103': [486.3, 650.5], '104': [550, 650.5],
    '105': [611.7, 650.5], '106': [726.7, 650.5], '107': [809.8, 650.5], '108': [886, 650.5],
    '109': [1027.8, 651], '110': [1112.9, 651], '111': [1187.1, 651], '112': [1304.1, 651.7],
    '113': [1364.8, 651.7], '114': [1430.5, 651.7], '115': [1494.2, 651.7], '116': [1590.3, 595.1],
    '201': [322.9, 586.9], '202': [415.6, 642.4], '203': [482.3, 642.4], '204': [547, 642.4],
    '205': [611.7, 642.4], '206': [721.2, 642.4], '207': [798.6, 642.4], '208': [879.2, 642.4],
    '209': [1035.2, 642.8], '210': [1114.1, 642.8], '211': [1189.5, 642.8], '212': [1304.2, 643.5],
    '213': [1366.4, 643.5], '214': [1430.6, 643.5], '215': [1496.2, 643.5], '216': [1589.5, 586.9],
  },
  'long-island': {
    '101': [334.2, 613.7], '105': [521.9, 701.9], '106': [607.1, 701.9], '107': [681.5, 701.9],
    '108': [755.9, 701.9], '109': [830.6, 701.9], '110': [904.6, 701.9], '111': [1030.8, 701.9],
    '112': [1105.1, 701.9], '113': [1178.5, 701.9], '114': [1252.9, 701.9], '115': [1328.2, 701.9],
    '116': [1529.1, 701.9],
    '201': [329.2, 406.9], '202': [329.2, 517.4], '203': [329.2, 612.7], '205': [521.9, 701.9],
    '206': [607.1, 701.9], '207': [681.5, 701.9], '208': [755.9, 701.9], '209': [830.6, 701.9],
    '210': [904.6, 701.9], '211': [1030.8, 701.9], '212': [1105.1, 701.9], '213': [1178.5, 701.9],
    '214': [1252.9, 701.9], '215': [1328.2, 701.9], '216': [1412.6, 701.9], '217': [1551.7, 701.9],
  },
};

/* Los colores de la leyenda impresa en cada base. Ahí están en Display P3; aquí van convertidos a sRGB,
   que es lo que dibuja pdf-lib, para que se vean iguales. Bloqueado no está en la leyenda: es el gris que ya se usaba. */
export const PIN_COLORS: Record<PlazaSlug, Record<string, [number, number, number]>> = {
  gardens: {
    disponible: [213, 244, 202],
    apartado: [255, 239, 31],
    vendido: [248, 163, 159],
    bloqueado: [213, 213, 213],
  },
  'long-island': {
    disponible: [213, 244, 202],
    apartado: [239, 226, 79],
    vendido: [248, 163, 159],
    bloqueado: [213, 213, 213],
  },
};
