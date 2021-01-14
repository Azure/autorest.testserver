import fs from "fs";
import glob from "glob";

export const findFilesFromPattern = async (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        reject(err);
      }
      resolve(matches);
    });
  });
};

/**
 * Ensure the given dir exists.
 * @param path Path to the dir.
 */
export const ensureDir = async (path: string): Promise<void> => {
  await fs.promises.mkdir(path, { recursive: true });
};
