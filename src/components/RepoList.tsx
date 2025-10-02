import React from 'react'
import type { GithubRepo } from '../types'

type Props = {
  repos: GithubRepo[]
  loading?: boolean
  error?: string | null
}

export default function RepoList({ repos, loading, error }: Props) {
  if (loading) return <div className="hint">Loading repositories…</div>
  if (error) return <div className="hint" style={{color: 'var(--danger)'}}>{error}</div>

  return (
    <ul className="repos">
      {repos.map(r => (
        <li key={r.id} className="repo">
          <a href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a>
          {r.description && <p className="repo-desc">{r.description}</p>}
          <div className="repo-meta">
            {r.language && <span className="badge"><span style={{display:'inline-block', width:8, height:8, borderRadius:999, background:'#9ca3af'}} />{r.language}</span>}
            <span className="badge" title="Stars">★ {r.stargazers_count}</span>
            <span className="badge" title="Forks">⑂ {r.forks_count}</span>
            <span style={{marginLeft:'auto'}}>Updated {new Date(r.updated_at).toLocaleDateString()}</span>
          </div>
        </li>
      ))}
      {repos.length === 0 && !loading && !error && <li className="hint">No public repositories.</li>}
    </ul>
  )
}
