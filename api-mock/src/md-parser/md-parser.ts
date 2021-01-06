import fs from "fs";
import * as commonmark from "commonmark";
import { logger } from "../logger";
import { MockRouteDefinition } from "../models";
import { convertToTree, dumpMarkdownTree } from "./md-tree";

export const parseMardownFile = async (path: string): Promise<MockRouteDefinition[]> => {
  logger.debug(`Reading file ${[path]}`);
  const content = await fs.promises.readFile(path);
  return parseMardown(content.toString());
};

export const parseMardown = async (content: string): Promise<MockRouteDefinition[]> => {
  const parser = new commonmark.Parser();
  const parsed = parser.parse(content);
  const tree = convertToTree(parsed);

  logger.debug(`Extracted structure\n${dumpMarkdownTree(tree)}`);
  return [];
};
