export interface CoverageMap {
  [name: string]: number;
}

export class CoverageService {
  private coverage: { [category: string]: CoverageMap } = {
    defaultCategoryName: {},
  };

  public getAllForCategory(category: string): CoverageMap {
    return this.coverage[category] ?? {};
  }

  public track(category: string, name: string): void {
    const map = this.coverage[category];
    if (!map) {
      throw new Error(`Unknown category '${category}'`);
    }

    if (!(name in map)) {
      throw new Error(`Unknown coverage name '${name}' in  '${category}'`);
    }

    map[name] += 1;
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
}

export const coverageService = new CoverageService();
