import * as commonmark from "commonmark";
import { MarkdownTreeNode } from "./md-tree";
import { cleanRender, renderSectionPath } from "./md-utils";

export type IsRequired<T> = T extends null | undefined ? false | undefined : true;

export type TreeNodeMapping<T> = {
  [P in keyof T]: MappingEntry<NonNullable<T[P]>, IsRequired<T[P]>>;
};

export type MappingEntry<T, TRequired extends boolean | undefined> =
  | HeadingMapping<T, TRequired>
  | NodeMapping<T, TRequired>;

export type HeadingMapping<TResult, TRequired extends boolean | undefined> = {
  type: "heading";
  name: string;
  required?: TRequired;
  process: (child: MarkdownTreeNode) => TResult;
};

export type NodeMapping<TResult, TRequired extends boolean | undefined> = {
  type: "code_block"; // Only code block supported for now.
  required?: TRequired;
  process: (child: commonmark.Node) => TResult;
};

// , TRequired extends boolean
type WithKey<T> = T & { key: string };
type HeadingMap = { [key: string]: WithKey<HeadingMapping<unknown, boolean>> };

export const mapMarkdownTree = <T>(
  path: string[],
  node: MarkdownTreeNode,
  mapping: TreeNodeMapping<T>,
): { [P in keyof T]: T[P] } => {
  const sectionName = renderSectionPath(path);
  const { headings, codeBlock } = processMappings(mapping);

  const result: { [key: string]: unknown } = {};
  for (const child of node.children) {
    if ("heading" in child) {
      const childTitle = cleanRender(child.heading);
      const mapping = headings[childTitle];
      if (mapping) {
        result[mapping.key] = mapping.process(child);
      } else {
        throw new Error(`Unexpected heading ${childTitle} under section ${sectionName}`);
      }
    } else if (child.type === "code_block" && codeBlock) {
      result[codeBlock.key] = codeBlock.process(child);
    } else {
      throw new Error(`Unexpected element ${child.type} under section ${sectionName}`);
    }
  }

  validateRequiredMapping(sectionName, mapping, result);

  return (result as unknown) as T;
};

const processMappings = (mapping: TreeNodeMapping<unknown>) => {
  const headings: HeadingMap = {};
  let codeBlock: WithKey<NodeMapping<unknown, boolean>> | undefined;
  for (const [key, value] of Object.entries<MappingEntry<unknown, boolean>>(mapping)) {
    switch (value.type) {
      case "heading":
        headings[value.name] = { key, ...value };
        break;
      case "code_block":
        if (codeBlock !== undefined) {
          throw new Error("Found 2 mapping definition for the code_block");
        }
        codeBlock = { key, ...value };
        break;
    }
  }
  return { headings, codeBlock };
};

const validateRequiredMapping = (
  sectionName: string,
  mapping: TreeNodeMapping<unknown>,
  result: { [key: string]: unknown },
) => {
  for (const [key, value] of Object.entries<MappingEntry<unknown, boolean>>(mapping)) {
    if (value.required && result[key] === undefined) {
      const name = value.type === "heading" ? `heading named '${value.name}'` : value.type;
      throw new Error(`Error: expected section ${sectionName} to contain a ${name}`);
    }
  }
};
