// Define a shared data structure to ensure media links are always synced
import { DESIGN_DATA } from './design';
import { DEV_DATA } from './dev';

export const PROJECT_DATA = [
  ...DESIGN_DATA,
  ...DEV_DATA
];
