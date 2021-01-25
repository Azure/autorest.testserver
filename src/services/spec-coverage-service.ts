import fs from "fs";
import { HttpMethod } from "../api";
import { logger } from "../logger";

export interface SpecPath {
  /**
   * Path to implement.
   */
  path: string;
  /**
   * List of HTTP methods to implement.
   */
  methods: HttpMethod[];
}

export const getPathsFromSpecs = async (specPaths: string[]): Promise<SpecPath[]> => {
  let paths: SpecPath[] = [];
  for (const specPath of specPaths) {
    paths = paths.concat(await getPathsFromSpec(specPath));
  }
  return paths;
};

const getPathsFromSpec = async (specPath: string): Promise<SpecPath[]> => {
  logger.debug(`Parsing spec ${specPath}`);
  const json = await parseSpec(specPath);
  return json.paths && typeof json.paths === "object" ? parseOpenAPIPath(json.paths as Record<string, unknown>) : [];
};

const parseOpenAPIPath = (paths: Record<string, unknown>): SpecPath[] => {
  return Object.entries(paths)
    .map(([path, content]) => {
      return {
        path,
        methods: content && typeof content === "object" ? (Object.keys(content) as HttpMethod[]) : [],
      };
    })
    .filter((x) => x.methods.length > 0);
};

const parseSpec = async (specPath: string): Promise<Record<string, unknown>> => {
  const content = await fs.promises.readFile(specPath);
  try {
    const json = JSON.parse(content.toString().replace(/^\uFEFF/, ""));

    if (typeof json !== "object") {
      throw new Error(`Spec ${specPath} is not valid, should be an json object.`);
    }

    return json;
  } catch (e) {
    throw new Error(`Spec ${specPath} is not valid json, ${e}`);
  }
};
