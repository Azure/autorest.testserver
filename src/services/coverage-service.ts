import fs from "fs";
import { join } from "path";
import { logger } from "../logger";
import { ensureDir } from "../utils";

export interface CoverageMap {
  [name: string]: number;
}

export class CoverageService {
  public coverageDirectory = "./coverage";

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
  public async track(category: string, name: string): Promise<void> {
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
   * @depreacted
   */
  public legacyTrack(category: string, name: string, value: number): void {
    let map = this.coverage[category];
    if (!map) {
      map = this.coverage[category] = {};
    }

    if (!(name in map)) {
      map[name] = 0;
    }

    map[name] = value;
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

  private async saveCoverage(category: string) {
    const categoryMap = this.coverage[category];
    await ensureDir(this.coverageDirectory);
    const path = join(this.coverageDirectory, `report-${category}.json`);

    try {
      await fs.promises.writeFile(path, JSON.stringify(categoryMap, null, 2));
    } catch (e) {
      logger.warn("Error while saving coverage", e);
    }
  }
}

export const coverageService = new CoverageService();
