import fs from "fs";
import { join } from "path";
import { Category } from "../api";
import { logger } from "../logger";
import { ensureDir } from "../utils";

export interface CoverageMap {
  [name: string]: number;
}

export class CoverageService {
  private coverageDirectory = "./coverage";

  private coverage: { [category: string]: CoverageMap } = {
    defaultCategoryName: {},
  };

  public getAllForCategory(category: string): CoverageMap {
    return this.coverage[category] ?? {};
  }

  /**
   * Track usage of a scenario.
   * @param category Category for the coverage
   * @param name Name of the scenario.
   * @param value {Optional} For legacy test set the value of the usage.
   */
  public async track(category: Category, name: string): Promise<void> {
    let map = this.coverage[category];
    if (!map) {
      map = this.coverage[category] = {};
    }

    if (!(name in map)) {
      map[name] = 0;
    }

    map[name] += 1;
    await this.saveCoverage(category);
  }

  /**
   * For LEGACY test only.
   * @deprecated
   */
  public legacyTrack(category: Category, name: string, value: number): void {
    let map = this.coverage[category];
    if (!map) {
      map = this.coverage[category] = {};
    }

    if (!(name in map)) {
      map[name] = 0;
    }

    if (value > map[name]) {
      map[name] = value;
    }
    this.legacySaveCoverage(category);
  }

  public register(category: string, name: string): void {
    let map = this.coverage[category];
    if (!map) {
      map = this.coverage[category] = {};
    }

    if (name in map) {
      throw new Error(`Name '${name}' already exists in category '${category}' make sure it is unique.`);
    }

    map[name] = 0;
  }

  public reset(): void {
    for (const categoryMap of Object.values(this.coverage)) {
      for (const name of Object.keys(categoryMap)) {
        categoryMap[name] = 0;
      }
    }
  }

  public init(coverageDirectory: string, loadExisting = false): void {
    this.coverageDirectory = coverageDirectory;
    if (loadExisting) {
      this.loadExistingCoverages();
    }
  }

  private async saveCoverage(category: Category) {
    const categoryMap = this.coverage[category];
    await ensureDir(this.coverageDirectory);
    const path = this.getReportPath(category);

    try {
      await fs.promises.writeFile(path, JSON.stringify(categoryMap, null, 2));
    } catch (e) {
      logger.warn("Error while saving coverage", e);
    }
  }

  private legacySaveCoverage(category: Category) {
    const categoryMap = this.coverage[category];
    fs.mkdirSync(this.coverageDirectory, { recursive: true });
    const path = this.getReportPath(category);
    try {
      fs.writeFileSync(path, JSON.stringify(categoryMap, null, 2));
    } catch (e) {
      logger.warn("Error while saving coverage", e);
    }
  }

  private loadExistingCoverages() {
    const categories: Category[] = ["vanilla", "azure", "optional", "dpg"];
    for (const category of categories) {
      this.loadExistingCoverage(category);
    }
  }

  private loadExistingCoverage(category: Category) {
    const path = this.getReportPath(category);
    try {
      if (!fs.existsSync(path)) {
        logger.warn(`Coverage for category '${category}' doesn't exists yet(File '${path}' is not found)`);

        return;
      }
      const content = fs.readFileSync(path);
      const data = JSON.parse(content.toString());
      for (const [key, value] of Object.entries(data)) {
        this.coverage[category][key] = value as number;
      }
    } catch (e) {
      logger.warn("Error while loading existing coverage", e);
    }
  }

  private getReportPath(category: Category) {
    return join(this.coverageDirectory, `report-${category}.json`);
  }
}

export const coverageService = new CoverageService();
