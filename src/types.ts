export type GithubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
};

export type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
};
