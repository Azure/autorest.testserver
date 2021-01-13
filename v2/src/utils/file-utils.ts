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
