/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * This file handles loading the legacy test server routes.
 */
import { Router } from "express";
import { Category } from "../api";
import { ProjectRoot } from "../constants";
import { MockApiServer } from "../server";
import { CoverageMap, coverageService } from "../services";

const legacyRoutePath = `${ProjectRoot}/legacy/routes`;

const requireLegacy = (filename: string) => require(`${legacyRoutePath}/${filename}`);

const additionalProperties = requireLegacy("additionalProperties.js");
const array = requireLegacy("array");
const parameterGrouping = requireLegacy("azureParameterGrouping.js");
const azureSpecial = requireLegacy("azureSpecials");
const azureUrl = requireLegacy("azureUrl");
const bool = requireLegacy("bool");
const byte = requireLegacy("byte");
const complex = requireLegacy("complex");
const customUri = requireLegacy("customUri.js");
const date = requireLegacy("date");
const datetime = requireLegacy("datetime");
const datetimeRfc1123 = requireLegacy("datetime-rfc1123");
const dictionary = requireLegacy("dictionary");
const duration = requireLegacy("duration");
const errorStatusCodes = requireLegacy("errorStatusCodes.js");
const extensibleEnums = requireLegacy("extensibleEnums.js");
const files = requireLegacy("files");
const formData = requireLegacy("formData");
const header = requireLegacy("header");
const httpResponses = requireLegacy("httpResponses");
const routes = requireLegacy("index");
const integer = requireLegacy("int");
const lroParameterizedEndpoints = requireLegacy("lroParameterizedEndpoints.js");
const lros = requireLegacy("lros");
const mediatypes = requireLegacy("mediatypes");
const modelFlatten = requireLegacy("model-flatten");
const multiapi = requireLegacy("multiapi");
const multiapiCustomBaseUrl = requireLegacy("multiapiCustomBaseUrl.js");
const multipleInheritance = requireLegacy("multipleInheritance.js");
const nonStringEnums = requireLegacy("nonStringEnums.js");
const number = requireLegacy("number");
const objectType = requireLegacy("objectType.js");
const paging = requireLegacy("paging");
const pathitem = requireLegacy("pathitem");
const paths = requireLegacy("paths");
const queries = requireLegacy("queries");
const time = requireLegacy("time.js");
const validation = requireLegacy("validation.js");
const xml = requireLegacy("xml.js");

const proxyCoverage = (category: Category, coverage: CoverageMap) => {
  for (const key of Object.keys(coverage)) {
    coverageService.legacyTrack(category, key as string, 0);
  }

  return new Proxy(coverage, {
    get: (_, key) => coverageService.getAllForCategory(category)[key as string],
    set: (obj, key, value) => {
      coverageService.legacyTrack(category, key as string, value);
      obj[key as string] = value;
      return true;
    },
  });
};

export const registerLegacyRoutes = (app: MockApiServer | Router): void => {
  const azurecoverage = proxyCoverage("azure", {});
  const optionalCoverage = proxyCoverage("optional", {
    getDecimalInvalid: 0,
    getDecimalBig: 0,
    getDecimalSmall: 0,
    getDecimalBigPositiveDecimal: 0,
    getDecimalBigNegativeDecimal: 0,
    putDecimalBig: 0,
    putDecimalSmall: 0,
    putDecimalBigPositiveDecimal: 0,
    putDecimalBigNegativeDecimal: 0,
  });

  const coverage = proxyCoverage("vanilla", {
    additionalPropertiesTrue: 0,
    additionalPropertiesSubclass: 0,
    additionalPropertiesTypeObject: 0,
    additionalPropertiesTypeString: 0,
    additionalPropertiesInProperties: 0,
    additionalPropertiesInPropertiesWithAPTypeString: 0,
    getArrayNull: 0,
    getArrayEmpty: 0,
    putArrayEmpty: 0,
    getArrayInvalid: 0,
    getArrayBooleanValid: 0,
    putArrayBooleanValid: 0,
    getArrayBooleanWithNull: 0,
    getArrayBooleanWithString: 0,
    getArrayIntegerValid: 0,
    putArrayIntegerValid: 0,
    getArrayIntegerWithNull: 0,
    getArrayIntegerWithString: 0,
    getArrayLongValid: 0,
    putArrayLongValid: 0,
    getArrayLongWithNull: 0,
    getArrayLongWithString: 0,
    getArrayFloatValid: 0,
    putArrayFloatValid: 0,
    getArrayFloatWithNull: 0,
    getArrayFloatWithString: 0,
    getArrayDoubleValid: 0,
    putArrayDoubleValid: 0,
    getArrayDoubleWithNull: 0,
    getArrayDoubleWithString: 0,
    getArrayStringValid: 0,
    putArrayStringValid: 0,
    getArrayEnumValid: 0,
    putArrayEnumValid: 0,
    getArrayStringEnumValid: 0,
    putArrayStringEnumValid: 0,
    getArrayStringWithNull: 0,
    getArrayStringWithNumber: 0,
    getArrayDateValid: 0,
    putArrayDateValid: 0,
    getArrayDateWithNull: 0,
    getArrayDateWithInvalidChars: 0,
    getArrayDateTimeValid: 0,
    putArrayDateTimeValid: 0,
    getArrayDateTimeWithNull: 0,
    getArrayDateTimeWithInvalidChars: 0,
    getArrayDateTimeRfc1123Valid: 0,
    putArrayDateTimeRfc1123Valid: 0,
    getArrayDurationValid: 0,
    putArrayDurationValid: 0,
    getArrayUuidValid: 0,
    getArrayUuidWithInvalidChars: 0,
    putArrayUuidValid: 0,
    getArrayByteValid: 0,
    putArrayByteValid: 0,
    getArrayByteWithNull: 0,
    getArrayArrayNull: 0,
    getArrayArrayEmpty: 0,
    getArrayArrayItemNull: 0,
    getArrayArrayItemEmpty: 0,
    getArrayArrayValid: 0,
    putArrayArrayValid: 0,
    getArrayComplexNull: 0,
    getArrayComplexEmpty: 0,
    getArrayComplexItemNull: 0,
    getArrayComplexItemEmpty: 0,
    getArrayComplexValid: 0,
    putArrayComplexValid: 0,
    getArrayDictionaryNull: 0,
    getArrayDictionaryEmpty: 0,
    getArrayDictionaryItemNull: 0,
    getArrayDictionaryItemEmpty: 0,
    getArrayDictionaryValid: 0,
    putArrayDictionaryValid: 0,
    getBoolTrue: 0,
    putBoolTrue: 0,
    getBoolFalse: 0,
    putBoolFalse: 0,
    getBoolInvalid: 0,
    getBoolNull: 0,
    getByteNull: 0,
    getByteEmpty: 0,
    getByteNonAscii: 0,
    putByteNonAscii: 0,
    getByteInvalid: 0,
    getDateNull: 0,
    getDateInvalid: 0,
    getDateOverflow: 0,
    getDateUnderflow: 0,
    getDateMax: 0,
    putDateMax: 0,
    getDateMin: 0,
    putDateMin: 0,
    getDateTimeNull: 0,
    getDateTimeInvalid: 0,
    getDateTimeOverflow: 0,
    getDateTimeUnderflow: 0,
    putDateTimeMaxUtc: 0,
    getDateTimeMaxUtcLowercase: 0,
    getDateTimeMaxUtcUppercase: 0,
    getDateTimeMaxLocalPositiveOffsetLowercase: 0,
    getDateTimeMaxLocalPositiveOffsetUppercase: 0,
    getDateTimeMaxLocalNegativeOffsetLowercase: 0,
    getDateTimeMaxLocalNegativeOffsetUppercase: 0,
    getDateTimeMinUtc: 0,
    putDateTimeMinUtc: 0,
    getDateTimeMinLocalPositiveOffset: 0,
    getDateTimeMinLocalNegativeOffset: 0,
    getDateTimeRfc1123Null: 0,
    getDateTimeRfc1123Invalid: 0,
    getDateTimeRfc1123Overflow: 0,
    getDateTimeRfc1123Underflow: 0,
    getDateTimeRfc1123MinUtc: 0,
    putDateTimeRfc1123Max: 0,
    putDateTimeRfc1123Min: 0,
    getDateTimeRfc1123MaxUtcLowercase: 0,
    getDateTimeRfc1123MaxUtcUppercase: 0,
    getIntegerNull: 0,
    getIntegerInvalid: 0,
    getIntegerOverflow: 0,
    getIntegerUnderflow: 0,
    getLongOverflow: 0,
    getLongUnderflow: 0,
    putIntegerMax: 0,
    putLongMax: 0,
    putIntegerMin: 0,
    putLongMin: 0,
    getNumberNull: 0,
    getFloatInvalid: 0,
    getDoubleInvalid: 0,
    getFloatBigScientificNotation: 0,
    putFloatBigScientificNotation: 0,
    getDoubleBigScientificNotation: 0,
    putDoubleBigScientificNotation: 0,
    getDoubleBigPositiveDecimal: 0,
    putDoubleBigPositiveDecimal: 0,
    getDoubleBigNegativeDecimal: 0,
    putDoubleBigNegativeDecimal: 0,
    getFloatSmallScientificNotation: 0,
    putFloatSmallScientificNotation: 0,
    getDoubleSmallScientificNotation: 0,
    putDoubleSmallScientificNotation: 0,
    putComplexBasicValid: 0,
    getComplexBasicValid: 0,
    getComplexBasicEmpty: 0,
    getComplexBasicNotProvided: 0,
    getComplexBasicNull: 0,
    getComplexBasicInvalid: 0,
    putComplexPrimitiveInteger: 0,
    putComplexPrimitiveLong: 0,
    putComplexPrimitiveFloat: 0,
    putComplexPrimitiveDouble: 0,
    putComplexPrimitiveBool: 0,
    putComplexPrimitiveString: 0,
    putComplexPrimitiveDate: 0,
    putComplexPrimitiveDateTime: 0,
    putComplexPrimitiveDateTimeRfc1123: 0,
    putComplexPrimitiveDuration: 0,
    putComplexPrimitiveByte: 0,
    getComplexPrimitiveInteger: 0,
    getComplexPrimitiveLong: 0,
    getComplexPrimitiveFloat: 0,
    getComplexPrimitiveDouble: 0,
    getComplexPrimitiveBool: 0,
    getComplexPrimitiveString: 0,
    getComplexPrimitiveDate: 0,
    getComplexPrimitiveDateTime: 0,
    getComplexPrimitiveDateTimeRfc1123: 0,
    getComplexPrimitiveDuration: 0,
    getComplexPrimitiveByte: 0,
    putComplexArrayValid: 0,
    putComplexArrayEmpty: 0,
    getComplexArrayValid: 0,
    getComplexArrayEmpty: 0,
    getComplexArrayNotProvided: 0,
    putComplexDictionaryValid: 0,
    putComplexDictionaryEmpty: 0,
    getComplexDictionaryValid: 0,
    getComplexDictionaryEmpty: 0,
    getComplexDictionaryNull: 0,
    getComplexDictionaryNotProvided: 0,
    putComplexInheritanceValid: 0,
    getComplexInheritanceValid: 0,
    putComplexPolymorphismValid: 0,
    getComplexPolymorphismValid: 0,
    putComplexPolymorphismComplicated: 0,
    getComplexPolymorphismComplicated: 0,
    putComplexPolymorphismNoDiscriminator: 0,
    putComplexPolymorphicRecursiveValid: 0,
    getComplexPolymorphicRecursiveValid: 0,
    putComplexReadOnlyPropertyValid: 0,
    getComplexReadOnlyPropertyValid: 0,
    UrlPathsBoolFalse: 0,
    UrlPathsBoolTrue: 0,
    UrlPathsIntPositive: 0,
    UrlPathsIntNegative: 0,
    UrlPathsLongPositive: 0,
    UrlPathsLongNegative: 0,
    UrlPathsFloatPositive: 0,
    UrlPathsFloatNegative: 0,
    UrlPathsDoublePositive: 0,
    UrlPathsDoubleNegative: 0,
    UrlPathsStringUrlEncoded: 0,
    UrlPathsStringUrlNonEncoded: 0,
    UrlPathsStringEmpty: 0,
    UrlPathsStringUnicode: 0,
    UrlPathsEnumValid: 0,
    UrlPathsByteMultiByte: 0,
    UrlPathsByteEmpty: 0,
    UrlPathsDateValid: 0,
    UrlPathsDateTimeValid: 0,
    UrlQueriesBoolFalse: 0,
    UrlQueriesBoolTrue: 0,
    UrlQueriesBoolNull: 0,
    UrlQueriesIntPositive: 0,
    UrlQueriesIntNegative: 0,
    UrlQueriesIntNull: 0,
    UrlQueriesLongPositive: 0,
    UrlQueriesLongNegative: 0,
    UrlQueriesLongNull: 0,
    UrlQueriesFloatPositive: 0,
    UrlQueriesFloatNegative: 0,
    UrlQueriesFloatNull: 0,
    UrlQueriesDoublePositive: 0,
    UrlQueriesDoubleNegative: 0,
    UrlQueriesDoubleNull: 0,
    UrlQueriesStringUrlEncoded: 0,
    UrlQueriesStringEmpty: 0,
    UrlQueriesStringNull: 0,
    UrlQueriesStringUnicode: 0,
    UrlQueriesEnumValid: 0,
    UrlQueriesEnumNull: 0,
    UrlQueriesByteMultiByte: 0,
    UrlQueriesByteEmpty: 0,
    UrlQueriesByteNull: 0,
    UrlQueriesDateValid: 0,
    UrlQueriesDateNull: 0,
    UrlQueriesDateTimeValid: 0,
    UrlQueriesDateTimeNull: 0,
    UrlQueriesArrayCsvNull: 0,
    UrlQueriesArrayCsvEmpty: 0,
    UrlQueriesArrayCsvValid: 0,
    UrlQueriesArrayMultiNull: 0,
    UrlQueriesArrayMultiEmpty: 0,
    UrlQueriesArrayMultiValid: 0,
    UrlQueriesArraySsvValid: 0,
    UrlQueriesArrayPipesValid: 0,
    UrlQueriesArrayTsvValid: 0,
    UrlQueriesArrayNoCollectionFormatValid: 0,
    UrlPathItemGetAll: 0,
    UrlPathItemGetGlobalNull: 0,
    UrlPathItemGetGlobalAndLocalNull: 0,
    UrlPathItemGetPathItemAndLocalNull: 0,
    putDictionaryEmpty: 0,
    getDictionaryNull: 0,
    getDictionaryEmpty: 0,
    getDictionaryInvalid: 0,
    getDictionaryNullValue: 0,
    getDictionaryNullkey: 0,
    getDictionaryKeyEmptyString: 0,
    getDictionaryBooleanValid: 0,
    getDictionaryBooleanWithNull: 0,
    getDictionaryBooleanWithString: 0,
    getDictionaryIntegerValid: 0,
    getDictionaryIntegerWithNull: 0,
    getDictionaryIntegerWithString: 0,
    getDictionaryLongValid: 0,
    getDictionaryLongWithNull: 0,
    getDictionaryLongWithString: 0,
    getDictionaryFloatValid: 0,
    getDictionaryFloatWithNull: 0,
    getDictionaryFloatWithString: 0,
    getDictionaryDoubleValid: 0,
    getDictionaryDoubleWithNull: 0,
    getDictionaryDoubleWithString: 0,
    getDictionaryStringValid: 0,
    getDictionaryStringWithNull: 0,
    getDictionaryStringWithNumber: 0,
    getDictionaryDateValid: 0,
    getDictionaryDateWithNull: 0,
    getDictionaryDateWithInvalidChars: 0,
    getDictionaryDateTimeValid: 0,
    getDictionaryDateTimeWithNull: 0,
    getDictionaryDateTimeWithInvalidChars: 0,
    getDictionaryDateTimeRfc1123Valid: 0,
    getDictionaryDurationValid: 0,
    getDictionaryByteValid: 0,
    getDictionaryByteWithNull: 0,
    putDictionaryBooleanValid: 0,
    putDictionaryIntegerValid: 0,
    putDictionaryLongValid: 0,
    putDictionaryFloatValid: 0,
    putDictionaryDoubleValid: 0,
    putDictionaryStringValid: 0,
    putDictionaryDateValid: 0,
    putDictionaryDateTimeValid: 0,
    putDictionaryDateTimeRfc1123Valid: 0,
    putDictionaryDurationValid: 0,
    putDictionaryByteValid: 0,
    getDictionaryComplexNull: 0,
    getDictionaryComplexEmpty: 0,
    getDictionaryComplexItemNull: 0,
    getDictionaryComplexItemEmpty: 0,
    getDictionaryComplexValid: 0,
    putDictionaryComplexValid: 0,
    getDictionaryArrayNull: 0,
    getDictionaryArrayEmpty: 0,
    getDictionaryArrayItemNull: 0,
    getDictionaryArrayItemEmpty: 0,
    getDictionaryArrayValid: 0,
    putDictionaryArrayValid: 0,
    getDictionaryDictionaryNull: 0,
    getDictionaryDictionaryEmpty: 0,
    getDictionaryDictionaryItemNull: 0,
    getDictionaryDictionaryItemEmpty: 0,
    getDictionaryDictionaryValid: 0,
    putDictionaryDictionaryValid: 0,
    putDurationPositive: 0,
    getDurationNull: 0,
    getDurationInvalid: 0,
    getDurationPositive: 0,
    HeaderParameterExistingKey: 0,
    HeaderResponseExistingKey: 0,
    HeaderResponseProtectedKey: 0,
    HeaderParameterIntegerPositive: 0,
    HeaderParameterIntegerNegative: 0,
    HeaderParameterLongPositive: 0,
    HeaderParameterLongNegative: 0,
    HeaderParameterFloatPositive: 0,
    HeaderParameterFloatNegative: 0,
    HeaderParameterDoublePositive: 0,
    HeaderParameterDoubleNegative: 0,
    HeaderParameterBoolTrue: 0,
    HeaderParameterBoolFalse: 0,
    HeaderParameterStringValid: 0,
    HeaderParameterStringNull: 0,
    HeaderParameterStringEmpty: 0,
    HeaderParameterDateValid: 0,
    HeaderParameterDateMin: 0,
    HeaderParameterDateTimeValid: 0,
    HeaderParameterDateTimeMin: 0,
    HeaderParameterDateTimeRfc1123Valid: 0,
    HeaderParameterDateTimeRfc1123Min: 0,
    HeaderParameterBytesValid: 0,
    HeaderParameterDurationValid: 0,
    HeaderResponseIntegerPositive: 0,
    HeaderResponseIntegerNegative: 0,
    HeaderResponseLongPositive: 0,
    HeaderResponseLongNegative: 0,
    HeaderResponseFloatPositive: 0,
    HeaderResponseFloatNegative: 0,
    HeaderResponseDoublePositive: 0,
    HeaderResponseDoubleNegative: 0,
    HeaderResponseBoolTrue: 0,
    HeaderResponseBoolFalse: 0,
    HeaderResponseStringValid: 0,
    HeaderResponseStringNull: 0,
    HeaderResponseStringEmpty: 0,
    HeaderParameterEnumValid: 0,
    HeaderParameterEnumNull: 0,
    HeaderResponseEnumValid: 0,
    HeaderResponseEnumNull: 0,
    HeaderResponseDateValid: 0,
    HeaderResponseDateMin: 0,
    HeaderResponseDateTimeValid: 0,
    HeaderResponseDateTimeMin: 0,
    HeaderResponseDateTimeRfc1123Valid: 0,
    HeaderResponseDateTimeRfc1123Min: 0,
    HeaderResponseBytesValid: 0,
    HeaderResponseDurationValid: 0,
    ConstantsInPath: 0,
    ConstantsInBody: 0,
    CustomBaseUri: 0,
    CustomBaseUriMoreOptions: 0,
    getModelFlattenArray: 0,
    putModelFlattenArray: 0,
    getModelFlattenDictionary: 0,
    putModelFlattenDictionary: 0,
    getModelFlattenResourceCollection: 0,
    putModelFlattenResourceCollection: 0,
    putModelFlattenCustomBase: 0,
    postModelFlattenCustomParameter: 0,
    putModelFlattenCustomGroupedParameter: 0,
    getArrayBase64Url: 0,
    getDictionaryBase64Url: 0,
    UrlPathsArrayCSVInPath: 0,
    getUnixTime: 0,
    getInvalidUnixTime: 0,
    getNullUnixTime: 0,
    putUnixTime: 0,
    UrlPathsIntUnixTime: 0,
    expectedEnum: 0,
    unexpectedEnum: 0,
    allowedValueEnum: 0,
    roundTripEnum: 0,
    expectedNoErrors: 0,
    expectedPetSadError: 0,
    expectedPetHungryError: 0,
    intError: 0,
    stringError: 0,
    animalNotFoundError: 0,
    linkNotFoundError: 0,
  });

  app.use("/", routes);
  app.use("/bool", new bool(coverage).router);
  app.use("/int", new integer(coverage).router);
  app.use("/number", new number(coverage, optionalCoverage).router);
  app.use("/byte", new byte(coverage).router);
  app.use("/date", new date(coverage).router);
  app.use("/datetime", new datetime(coverage, optionalCoverage).router);
  app.use("/datetimeRfc1123", new datetimeRfc1123(coverage).router);
  app.use("/duration", new duration(coverage, optionalCoverage).router);
  app.use("/array", new array(coverage).router);
  app.use("/complex", new complex(coverage).router);
  app.use("/dictionary", new dictionary(coverage).router);
  app.use("/paths", new paths(coverage).router);
  app.use("/queries", new queries(coverage).router);
  app.use("/pathitem", new pathitem(coverage).router);
  app.use("/header", new header(coverage, optionalCoverage).router);
  app.use("/files", new files(coverage).router);
  app.use("/formdata", new formData(optionalCoverage).router);
  app.use("/http", new httpResponses(coverage, optionalCoverage).router);
  app.use("/model-flatten", new modelFlatten(coverage).router);
  app.use("/lro", new lros(azurecoverage).router);
  app.use("/lroParameterizedEndpoints", new lroParameterizedEndpoints(azurecoverage).router);
  app.use("/paging", new paging(azurecoverage).router);
  app.use("/azurespecials", new azureSpecial(azurecoverage).router);
  app.use("/subscriptions", new azureUrl(azurecoverage).router);
  app.use("/parameterGrouping", new parameterGrouping(azurecoverage).router);
  app.use("/validation", new validation(coverage).router);
  app.use("/customUri", new customUri(coverage).router);
  app.use("/extensibleEnums", new extensibleEnums(coverage).router);
  app.use("/errorStatusCodes", new errorStatusCodes(coverage, optionalCoverage).router);
  app.use("/additionalProperties", new additionalProperties(coverage).router);
  app.use("/mediatypes", new mediatypes(coverage).router);
  app.use("/xml", new xml(coverage).router);
  app.use("/multiapi", new multiapi(optionalCoverage).router);
  app.use("/objectType", new objectType(coverage).router);
  app.use("/nonStringEnums", new nonStringEnums(coverage).router);
  app.use("/time", new time(coverage).router);
  app.use("/multipleInheritance", new multipleInheritance(coverage).router);
  app.use("/multiapiCustomBaseUrl", new multiapiCustomBaseUrl(optionalCoverage).router);
};
