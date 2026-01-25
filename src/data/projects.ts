// Define a shared data structure to ensure media links are always synced
import { DEV_DATA } from './dev';
import { DESIGN_DATA } from './design';

export const PROJECT_DATA = [
  ...DESIGN_DATA,
  ...DEV_DATA
];
