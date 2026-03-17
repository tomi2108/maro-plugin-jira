import { Config, ConfigError } from "@maro/maro";

import { Task, TaskTracker } from "maro-plugin-tasks";
import { Jira } from "./api";

export class JiraTaskTracker extends TaskTracker {

  override isTracked(task: Task) {
    const todoLine = task.getTodo();
    const regex = /TODO[^:]*\([^)]*\)[^:]*:/;
    return regex.test(todoLine);
  }

  override addIdToTodo(id: string) {
    return `(${id})`;
  }

  override async save(task: Task) {
    const config = Config.getView();
    const jira = new Jira();
    const parent_key = config.get("tasks.jira_parent_key");
    const project_key = config.get("jira.project_key");
    const labels = config.get("jira.labels");
    if (!parent_key) throw new ConfigError("tasks.jira_parent_key");
    if (!project_key) throw new ConfigError("jira.project_key");
    const parent_issue = await jira.getIssue(parent_key);
    const relative = task.getPathInProject();
    const created_issue = await parent_issue.createChild({
      issueType: "Task",
      asignee: await jira.getCurrentUser(),
      reporter: await jira.getCurrentUser(),
      project: await jira.getProject(project_key),
      title: `TODO(${task.project.name()}): ${task.title}`,
      description: `- FILE-LOCATION: ${relative}:${task.file_location.row}:${task.file_location.col}
${task.description ?? ""}`,
      labels
    });
    return created_issue.key;
  }

}

