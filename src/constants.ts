import { join, resolve } from "path";

export const ProjectRoot = resolve(join(__dirname), "..");

export const AdminUrls = {
  stop: "/.admin/stop",
};
