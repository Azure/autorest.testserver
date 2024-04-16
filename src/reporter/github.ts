export interface Comment {
  id: number;
  message: string;
  user: string;
  url: string;
}

export class GitHubCiClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private headersInit: Record<string, string> = {
    "User-Agent": "AutoRest CI",
  };

  constructor(
    private githubRepo: string,
    githubTokenOfCI: string,
  ) {
    this.headersInit["Authorization"] = "token " + githubTokenOfCI;
  }

  public async getComments(pr: number): Promise<Comment[]> {
    const res = await fetch(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`, {
      headers: this.headersInit,
    });
    const comments = JSON.parse(await res.text());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return comments.map((x: any) => {
      return { id: x.id, message: x.body, user: x.user.login, url: x.html_url };
    });
  }

  public async getCommentsWithIndicator(pr: number, indicator: string): Promise<Comment[]> {
    return (await this.getComments(pr)).filter((comment) => comment.message.startsWith(indicator));
  }

  public async setComment(id: number, message: string): Promise<void> {
    await fetch(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`, {
      body: JSON.stringify({ body: message }),
      headers: this.headersInit,
      method: "POST",
    });
  }

  public async deleteComment(id: number): Promise<void> {
    await fetch(`https://api.github.com/repos/${this.githubRepo}/issues/comments/${id}`, {
      headers: this.headersInit,
      method: "DELETE",
    });
  }

  public async tryDeleteComment(id: number): Promise<void> {
    try {
      await this.deleteComment(id);
    } catch (_) {
      //.
    }
  }

  public async createComment(pr: number, message: string): Promise<number> {
    const res = await fetch(`https://api.github.com/repos/${this.githubRepo}/issues/${pr}/comments`, {
      body: JSON.stringify({ body: message }),
      headers: this.headersInit,
      method: "POST",
    });
    return JSON.parse(await res.text()).id;
  }
}
