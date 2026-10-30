// The plugin ships no types; only its flat configs are used, in eslint.config.js.
declare module "eslint-plugin-jsx-a11y" {
  import type { Linter } from "eslint";

  const plugin: {
    flatConfigs: Record<"recommended" | "strict", Linter.Config>;
  };
  export default plugin;
}
