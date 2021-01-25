export interface CliConfig {
  // Logging
  verbose?: boolean;
  debug?: boolean;
  level?: string;

  /**
   * Port to serve the application.
   */
  port: number;

  /**
   * Directory where the coverage reports should be saved.
   */
  coverageDirectory: string;

  /**
   * Command to use
   */
  command: "run" | "stop" | "validate-spec-coverage";
}
