/**
 * Cleanup the raw content:
 *  - trim whitespaces
 *  - replace \r\n with \n
 * @param rawContent: raw content to clean.
 */
export const cleanupBody = (rawContent: string): string => rawContent.trim().replace(/\r?\n|\r/g, "\n");

export const coerceDate = (targetObject: object): object => {
    var stringRep = JSON.stringify(targetObject);
    stringRep = stringRep.replace(/(\d\d\d\d-\d\d-\d\d[Tt]\d\d:\d\d:\d\d)\.\d{3,7}([Zz]|[+-]00:00)/g, "$1Z");
    return JSON.parse(stringRep);
};
