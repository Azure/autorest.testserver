export interface CliConfig {
  // Logging
  verbose?: boolean;
  debug?: boolean;
  level?: string;

  /**
   * Port to serve the application.
   */
  port: number;
}
