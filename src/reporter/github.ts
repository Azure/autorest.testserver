import { RequestAPI } from "request";
import { defaults } from "request-promise-native";

export interface Comment {
  id: number;
  message: string;
  user: string;
  url: string;
}

export class GitHubCiClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private request: RequestAPI<any, any, any>;

  constructor(private githubRepo: string, githubTokenOfCI: string) {
    this.request = defaults({
      headers: {
        "User-Agent": "AutoRest CI",
        "Authorization": "token " + githubTokenOfCI,
      },
    });
  }

  public async getComments(pr: number): Promise<Comment[]> {
    const res = await this.request.get(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`);
    const comments = JSON.parse(res);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return comments.map((x: any) => {
      return { id: x.id, message: x.body, user: x.user.login, url: x.html_url };
    });
  }

  public async getCommentsWithIndicator(pr: number, indicator: string): Promise<Comment[]> {
    return (await this.getComments(pr)).filter((comment) => comment.message.startsWith(indicator));
  }

  public async setComment(id: number, message: string): Promise<void> {
    await this.request.post(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`, {
      body: JSON.stringify({ body: message }),
    });
  }

  public async deleteComment(id: number): Promise<void> {
    await this.request.delete(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`);
  }

  public async tryDeleteComment(id: number): Promise<void> {
    try {
      await this.deleteComment(id);
    } catch (_) {
      //.
    }
  }

  public async createComment(pr: number, message: string): Promise<number> {
    const res = await this.request.post(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`, {
      body: JSON.stringify({ body: message }),
    });
    return JSON.parse(res).id;
  }
}
