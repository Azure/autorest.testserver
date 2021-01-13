export interface CliConfig {
  // Logging
  verbose?: boolean;
  debug?: boolean;
  level?: string;

  /**
   * List of pattern containing definition files.
   */
  include: string[];

  /**
   * Port to serve the application.
   */
  port: number;
}
