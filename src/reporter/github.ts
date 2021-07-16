import { defaults } from "request-promise-native";

export class GitHubCiClient {
  private request: any;

  constructor(private githubRepo: string, githubTokenOfCI: string) {
    this.request = defaults({
      headers: {
        "User-Agent": "AutoRest CI",
        "Authorization": "token " + githubTokenOfCI,
      },
    });
  }

  public async getComments(pr) {
    const res = await this.request.get(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`);
    const comments = JSON.parse(res);
    return comments.map((x) => {
      return { id: x.id, message: x.body, user: x.user.login, url: x.html_url };
    });
  }

  public async getCommentsWithIndicator(pr, indicator) {
    return (await this.getComments(pr)).filter((comment) => comment.message.startsWith(indicator));
  }

  public async setComment(id, message) {
    await this.request.post(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`, {
      body: JSON.stringify({ body: message }),
    });
  }

  public async deleteComment(id) {
    await this.request.delete(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`);
  }

  public async tryDeleteComment(id) {
    try {
      await this.deleteComment(id);
    } catch (_) {}
  }

  public async createComment(pr, message) {
    const res = await this.request.post(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`, {
      body: JSON.stringify({ body: message }),
    });
    return JSON.parse(res).id;
  }
}
