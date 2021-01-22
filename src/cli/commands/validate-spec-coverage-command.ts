import { join } from "path";
import { app, HttpMethod } from "../../api";
import { requireMockRoutes, ROUTE_FOLDER } from "../../app";
import { ProjectRoot } from "../../constants";
import { logger } from "../../logger";
import { getPathsFromSpecs, SpecPath } from "../../services";
import { findFilesFromPattern } from "../../utils";
import { CliConfig } from "../cli-config";

interface Layer {
  route: { path: string; methods: Record<HttpMethod, boolean> };
  regexp: RegExp;
}

export const validateSpecCoverageCommand = async (cliConfig: CliConfig): Promise<void> => {
  const files = await findFilesFromPattern(join(ProjectRoot, "swagger/*.json"));
  logger.info(`Validating spec coverage, found ${files.length} specs.`);
  const paths = await getPathsFromSpecs(files);
  logger.info(`Found ${paths.length} paths.`);

  await requireMockRoutes(ROUTE_FOLDER);
  const apiRouter = app;

  const registeredPaths: Layer[] = apiRouter.router.stack.filter((x) => x.route);
  logger.info(`Found ${registeredPaths.length} mock paths.`);

  const errors = findSpecCoverageErrors(paths, registeredPaths);
  if (errors.length) {
    for (const error of errors) {
      logger.warn(`Route ${error.path.path} is missing a mocked API for methods: ${error.methods.join(",")}`);
    }
    logger.error(`Validate spec coverage completed with ${errors.length} errors.`);
    process.exit(-1);
  } else {
    process.exit(0);
  }
};

interface SpecCoverageError {
  /**
   * Path missing some or all methods implemented.
   */
  path: SpecPath;

  /**
   * List of non implemented methods.
   */
  methods: HttpMethod[];
}

const findSpecCoverageErrors = (paths: SpecPath[], registeredPaths: Layer[]): SpecCoverageError[] => {
  const errors: SpecCoverageError[] = [];
  for (const path of paths) {
    const missingMethods = validateRouteDefined(path, registeredPaths);
    if (missingMethods.length > 0) {
      errors.push({ path: path, methods: missingMethods });
    } else {
      logger.debug(`Route ${path.path} has a mocked API.`);
    }
  }
  return errors;
};

/**
 * Validat the given path is defined in the mock api.
 * @param path Path to validate
 * @param registeredPaths List of all registered mock apis.
 * @returns list of methods that are not implemented for the given path.
 */
const validateRouteDefined = (path: SpecPath, registeredPaths: Layer[]): HttpMethod[] => {
  const methodFound: Partial<Record<HttpMethod, boolean>> = {};

  for (const registeredPath of registeredPaths) {
    if (registeredPath.regexp.test(path.path)) {
      for (const [method, defined] of Object.entries(registeredPath.route.methods)) {
        if (defined) {
          methodFound[method as HttpMethod] = true;
        }
      }
    }
  }

  return path.methods.filter((x) => !methodFound[x]);
};
