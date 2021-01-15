import { ApiMockApp, ApiMockAppConfig } from "../../app";
import { CliConfig } from "../cli-config";

const getAppConfig = (cliConfig: CliConfig): ApiMockAppConfig => {
  return {
    coverageDirectory: cliConfig.coverageDirectory,
    port: cliConfig.port,
  };
};

export const runCommand = async (cliConfig: CliConfig): Promise<void> => {
  const app = new ApiMockApp(getAppConfig(cliConfig));
  await app.start();
};
