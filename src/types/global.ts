import { validateENV } from 'src/utils/validate-env';

export enum AppModes {
  DEV = 'dev',
  PROD = 'prod',
}

export type IEnvironment = ReturnType<typeof validateENV>;
