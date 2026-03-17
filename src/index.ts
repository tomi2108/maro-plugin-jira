import { ConfigRegistry, PluginExport } from "@maro/maro";
import { JiraConfig } from "./config";

const plugin: PluginExport = {
  name: "maro-plugin-jira",
  onLoad() {
    ConfigRegistry.register(new JiraConfig())
  }

};

export default plugin;
