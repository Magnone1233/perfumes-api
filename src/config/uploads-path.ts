import { resolve } from 'path';

export const getUploadsRoot = (): string => {
  const configuredPath = process.env.UPLOADS_DIR;
  if (configuredPath && configuredPath.trim().length > 0) {
    return resolve(configuredPath.trim());
  }

  return resolve(process.cwd(), 'uploads');
};
