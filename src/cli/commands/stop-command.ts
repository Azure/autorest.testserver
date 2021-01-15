import axios from "axios";
import { AdminUrls } from "../../constants";
import { logger } from "../../logger";
import { CliConfig } from "../cli-config";

export const stopCommand = async ({ port }: CliConfig): Promise<void> => {
  logger.info("Stopping server at port {port}", port);
  try {
    const url = `http://localhost:${port}${AdminUrls.stop}`;
    const response = await axios.post(url);
    logger.debug(`Call success: ${url} ${response.status}`);
    logger.info(`Successfuly stopped server at port ${port}`);
    process.exit(0);
  } catch (e) {
    logger.error("Error while trying to stop server", e);
    process.exit(-1);
  }
};
