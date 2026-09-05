import fsExtra from 'fs-extra';

// Export calls (needed for mocking)
export const readFile = fsExtra.readFile;
export const writeFile = fsExtra.writeFile;
export const copyFile = fsExtra.copyFile;
export const exists = fsExtra.pathExists;
export const mkdir = fsExtra.mkdirp;
export const rmdir = fsExtra.remove;
