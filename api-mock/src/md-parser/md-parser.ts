import fs from "fs";
import * as commonmark from "commonmark";
import yaml from "js-yaml";
import { logger } from "../logger";
import {
  CommonDefinition,
  CommonRequestDefinition,
  CommonResponseDefinition,
  MockRouteDefinition,
  MockRouteDefinitionGroup,
} from "../models";
import { convertToTree, dumpMarkdownTree, MarkdownTreeNode } from "./md-tree";
import { cleanRender } from "./md-utils";

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
  const group = convertTreeToDefinitionGroup(tree);
  logger.debug(`Extracted group: ${group}`);
  return [];
};

const KnownHeading = {
  common: "Common",
  routes: "Routes",
  request: "Request",
  response: "Response",
};

const convertTreeToDefinitionGroup = (tree: MarkdownTreeNode): MockRouteDefinitionGroup => {
  const title = cleanRender(tree.heading);
  let common: CommonDefinition | undefined;
  let routes: MockRouteDefinition[] | undefined;
  logger.debug(`Title for document is '${title}'`);

  for (const child of tree.children) {
    if (!("heading" in child)) {
      logger.warn("Unexpected node right under the title. Make sure to follow the required structure.");
      continue;
    }
    const heading = cleanRender(child.heading);
    if (heading === KnownHeading.common) {
      common = extractCommonFromTreeNode(child);
    } else if (heading === KnownHeading.routes) {
      routes = extractRoutesFromTreeNode(child);
    }
  }

  if (routes === undefined) {
    throw new Error(
      `Document is missing route definitions. Make sure to have a heading called '${KnownHeading.routes}'.`,
    );
  }
  return {
    title,
    common,
    routes,
  };
};

const extractCommonFromTreeNode = (tree: MarkdownTreeNode): CommonDefinition => {
  let request: CommonRequestDefinition | undefined;
  let response: CommonResponseDefinition | undefined;

  for (const child of tree.children) {
    if (!("heading" in child)) {
      logger.warn("Unexpected node right under the common section. Make sure to follow the required structure.");
      continue;
    }
    switch (cleanRender(child.heading)) {
      case KnownHeading.request:
        request = extractYamlConfigFromTreeNode<CommonRequestDefinition>(child, "Common > Request");
        break;
      case KnownHeading.response:
        response = extractYamlConfigFromTreeNode<CommonResponseDefinition>(child, "Common > Response");
        break;
    }
  }

  return {
    request,
    response,
  };
};

const extractYamlConfigFromTreeNode = <T>(tree: MarkdownTreeNode, sectionName: string): T => {
  const child = tree.children[0];
  if (child === undefined) {
    throw new Error(`${sectionName} section must have a code block content but found nothing`);
  }
  if ("heading" in child) {
    throw new Error(`Unexpected heading '${cleanRender(child.heading)}' found in ${sectionName} section.`);
  }
  if (child.type !== "code_block") {
    throw new Error(`Unexpected element under ${sectionName} section. Expected code block but got ${child.type}`);
  }
  const result = child.literal && yaml.load(child.literal);

  if (result === undefined) {
    throw new Error(`Couldn't parse yaml: ${child.literal}`);
  }
  return (result as unknown) as T;
};

const extractRoutesFromTreeNode = (tree: MarkdownTreeNode): MockRouteDefinition[] => {
  return undefined!;
};
