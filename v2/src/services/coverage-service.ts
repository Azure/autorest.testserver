export interface CoverageMap {
  [name: string]: number;
}

const defaultCategoryName = "__default__";

export class CoverageService {
  private coverage: { [category: string]: CoverageMap } = {
    defaultCategoryName: {},
  };

  public getAllForCategory(category: string | undefined): CoverageMap {
    return this.coverage[getCategoryName(category)] ?? {};
  }

  public track(category: string, name: string): void {
    const categoryName = category ?? defaultCategoryName;
    const map = this.coverage[categoryName];
    if (!map) {
      throw new Error(`Unknown category '${categoryName}'`);
    }

    if (!(name in map)) {
      throw new Error(`Unknown coverage name '${name}' in  '${categoryName}'`);
    }

    map[name] += 1;
  }

  public register(category: string | undefined, name: string): void {
    const categoryName = category ?? defaultCategoryName;
    let map = this.coverage[categoryName];
    if (!map) {
      map = this.coverage[categoryName] = {};
    }

    if (name in map) {
      throw new Error(`Name '${name}' already exists in category '${categoryName}' make sure it is unique.`);
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

const getCategoryName = (category: string | undefined): string => {
  return category ?? defaultCategoryName;
};
export const coverageService = new CoverageService();
