import { arch, platform, release, tmpdir } from "os";
import { RequestAPI, UriOptions, UrlOptions } from "request";
import { defaults as request_defaults, RequestPromise, RequestPromiseOptions } from "request-promise-native";

export class GitHubCiClient {
  constructor(
    githubRepo,
    githubTokenOfCI
  ) {
    this.githubRepo = githubRepo;
    this.request = request_defaults({
      headers: {
        "User-Agent": "AutoRest CI",
        "Authorization": "token " + githubTokenOfCI
      }
    });
  }

  async getComments(pr) {
    const res = await this.request.get(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`);
    const comments = JSON.parse(res);
    return comments.map(x => { return { id: x.id, message: x.body, user: x.user.login, url: x.html_url }; });
  }

  async getCommentsWithIndicator(pr, indicator) {
    return (await this.getComments(pr)).filter(comment => comment.message.startsWith(indicator));
  }

  async setComment(id, message) {
    await this.request.post(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`, { body: JSON.stringify({ body: message }) });
  }

  async deleteComment(id) {
    await this.request.delete(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`);
  }

  async tryDeleteComment(id) {
    try { await this.deleteComment(id); } catch { }
  }

  async createComment(pr, message) {
    const res = await this.request.post(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`, { body: JSON.stringify({ body: message }) });
    return JSON.parse(res).id;
  }
}