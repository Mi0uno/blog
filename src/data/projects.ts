// Define a shared data structure to ensure media links are always synced
import { DESIGN_DATA } from './design';
import { GENERATED_PROJECTS } from './generated_projects';

export const PROJECT_DATA = [
  ...DESIGN_DATA,
  ...GENERATED_PROJECTS
];
