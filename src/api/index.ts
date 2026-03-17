import axios, { AxiosInstance } from "axios";

import { Config } from "@maro/maro";

import { jira } from "./api";
import { Issue, IssueResponse } from "./issue";
import { JiraProject, JiraProjectReponse } from "./project";
import { JiraUser, JiraUserResponse } from "./user";
import { base64Encode } from "../utils";

export class Jira {
  // TODO: try to stick to one
  private jira: ReturnType<typeof jira>;
  private api: AxiosInstance;

  constructor() {
    this.jira = jira();
    const string = `${Config.getView().get("jira.username")}:${Config.getView().get("jira.token")}`;
    const encodedString = base64Encode(string);
    this.api = axios.create({
      baseURL: `https://${Config.getView().get("jira.server")}/rest/api`,
      headers: { Authorization: `Basic ${encodedString}` }
    });
  }

  async getUsers() {
    const params = { project: Config.getView().get("jira.project_key"), maxResults: 1000 };
    const res = await this.api.get("/3/user/assignable/search", { params });
    // TODO: test
    const data = res.data as JiraUserResponse[];
    return data.map((u) => JiraUser.fromUserResponse(u));
  }

  async getCurrentUser() {
    return JiraUser.fromUserResponse(
      await this.jira.getCurrentUser() as JiraUserResponse
    );
  }

  async getProject(project_key: string) {
    return JiraProject.fromJiraProjectResponse(await this.jira.getProject(project_key) as JiraProjectReponse);
  }

  async getBoard() {
    return await this.jira.getBoard(String(Config.getView().get("jira.board_id")));
  }

  async getIssue(idOrKey: string) {
    return Issue.fromIssueResponse(await this.jira.getIssue(idOrKey) as IssueResponse);
  }

  async getIssueLinkTypes() {
    return (await this.jira.listIssueLinkTypes()).issueLinkTypes as { name: string; inward: string }[];
  }

  async getIssueTypes() {
    return await this.jira.listIssueTypes();
  }
}

