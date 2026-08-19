import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const children = [
  spawn("npm", ["run", "dev"], {
    cwd: path.join(root, "server"),
    stdio: "inherit",
    shell: true,
  }),
  spawn("npm", ["run", "dev"], {
    cwd: path.join(root, "client"),
    stdio: "inherit",
    shell: true,
  }),
];

const stop = () => {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of children) {
  child.on("exit", (code) => {
    if (code) stop();
  });
}
