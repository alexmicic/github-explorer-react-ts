import type { GithubUser, GithubRepo } from '../types'

const BASE = 'https://api.github.com'

function withAuth(headers: Headers) {
  const token = import.meta.env.VITE_GITHUB_TOKEN
  if (token) headers.set('Authorization', `Bearer ${token}`)
  headers.set('Accept', 'application/vnd.github.v3+json')
}

export async function fetchJSON<T>(url: string): Promise<{ data?: T; rateLimited?: boolean; error?: string }> {
  try {
    const headers = new Headers()
    withAuth(headers)
    const res = await fetch(url, { headers })

    if (res.status === 403) {
      const remaining = res.headers.get('X-RateLimit-Remaining')
      if (remaining === '0') {
        return { rateLimited: true, error: 'GitHub API rate limit reached.' }
      }
    }

    if (!res.ok) {
      const text = await res.text()
      return { error: `Request failed (${res.status}): ${text || res.statusText}` }
    }

    const json = (await res.json()) as T
    return { data: json }
  } catch (err: any) {
    return { error: err?.message || 'Network error' }
  }
}

export async function searchUsers(q: string, perPage = 5) {
  const url = `${BASE}/search/users?q=${encodeURIComponent(q)}&per_page=${perPage}`
  return fetchJSON<{ items: GithubUser[] }>(url)
}

export async function fetchAllRepos(username: string) {
  const perPage = 100
  let page = 1
  const all: GithubRepo[] = []

  while (true) {
    const url = `${BASE}/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated`
    const { data, error, rateLimited } = await fetchJSON<GithubRepo[]>(url)
    if (rateLimited) return { rateLimited, error, data: all }
    if (error) return { error, data: all }
    const batch = data || []
    all.push(...batch)
    if (batch.length < perPage) break
    page++
  }
  return { data: all }
}
