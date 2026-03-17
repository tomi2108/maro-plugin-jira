import JiraApi from "jira-client";

import { Config } from "@maro/maro";

export const jira = () => new JiraApi({
  host: Config.getView().get("jira.server"),
  protocol: "https",
  username: Config.getView().get("jira.username"),
  password: Config.getView().get("jira.token")
});


