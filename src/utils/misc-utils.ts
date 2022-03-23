export const toPascalCase = (input: string): string => "" + input.charAt(0).toUpperCase() + input.slice(1);

export const coerceDateString = (date: string): string =>
  date.replace(/(\d\d\d\d-\d\d-\d\d[Tt]\d\d:\d\d:\d\d)\.\d{3,7}([Zz]|[+-]00:00)/g, "$1Z");
