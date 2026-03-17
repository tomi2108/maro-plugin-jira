import z from "zod/v4";

import { ExecutionContext, ConfigHelp, ConfigSection } from "@maro/maro";

const schema = z.object({
  server: z.string(),
  project_key: z.string().optional(),
  username: z.string(),
  token: z.string(),
  labels: z.array(z.string()).optional(),
  board_id: z.number().optional(),
  monitors: z.object({
    project_key: z.string().optional(),
    parent_issue_key: z.string().optional()
  }).optional(),
  tasks: z.object({
    jira_parent_key: z.string().optional()
  })
});

export class JiraConfig implements ConfigSection {
  key = "jira";

  defaults(): Record<string, unknown> {
    return {
      server: process.env.MARO_JIRA_SERVER ?? ""
    };
  }

  help(): ConfigHelp[] {
    return [
      { key: "server", description: "Jira server URL", type: "string" },
      { key: "project_key", description: "Default Jira project key", type: "string" },
      { key: "username", description: "Jira username", type: "string" },
      { key: "token", description: "Jira API token", type: "string" },
      { key: "labels", description: "Default issue labels", type: "string[]" },
      { key: "board_id", description: "Board id used for issue queries", type: "number" },
      { key: "monitors.project_key", description: "Project key for monitor issues", type: "string" },
      { key: "monitors.parent_issue_key", description: "Parent issue key for monitor tickets", type: "string" },
      { key: "tasks.jira_parent_key", description: "Default parent Jira issue for task creation", type: "string" }
    ];
  }

  validate(config: unknown) {
    return schema.parse(config);
  }

  async setup(ctx: ExecutionContext) {
    const username = await ctx.ui.input({ message: "Enter Jira username" });
    const token = await ctx.ui.password({ message: "Enter Jira auth token (https://id.atlassian.com/manage-profile/security/api-tokens)" });
    return { username, token };
  }

}

