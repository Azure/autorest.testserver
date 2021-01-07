import * as commonmark from "commonmark";
import { MarkdownTreeNode } from "./md-tree";
import { cleanRender, renderSectionPath } from "./md-utils";

export type TreeNodeMapping<T> = {
  [P in keyof T]: MappingEntry<T[P]>;
};

export type MappingEntry<T> = HeadingMapping<T> | NodeMapping<T>;

export type HeadingMapping<TResult> = {
  type: "heading";
  name: string;
  process: (child: MarkdownTreeNode) => TResult;
};

export type NodeMapping<TResult> = {
  type: "code_block"; // Only code block supported for now.
  process: (child: commonmark.Node) => TResult;
};

type WithKey<T> = T & { key: string };
type HeadingMap = { [key: string]: WithKey<HeadingMapping<unknown>> };

export const mapMarkdownTree = <T>(path: string[], node: MarkdownTreeNode, mapping: TreeNodeMapping<T>): Partial<T> => {
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

  return (result as unknown) as T;
};

const processMappings = (mapping: TreeNodeMapping<unknown>) => {
  const headings: HeadingMap = {};
  let codeBlock: WithKey<NodeMapping<unknown>> | undefined;
  for (const [key, value] of Object.entries<MappingEntry<unknown>>(mapping)) {
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
