import { ConfigRegistry, PluginExport } from "@maro/maro";
import { CreateMissingTasksAction } from "maro-plugin-tasks"
import { JiraTaskTracker } from "./task_tracker";
import { JiraConfig } from "./config";

const plugin: PluginExport = {
  name: "maro-plugin-jira",
  onLoad() {
    new CreateMissingTasksAction(new JiraTaskTracker()).register();
    ConfigRegistry.register(new JiraConfig())
  }

};

export default plugin;
