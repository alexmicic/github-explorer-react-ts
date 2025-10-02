import React from 'react'
import type { GithubUser } from '../types'

type Props = {
  users: GithubUser[]
  selected?: string | null
  onSelect: (u: GithubUser) => void
  loading?: boolean
  error?: string | null
  query?: string
}

export default function UserList({ users, selected, onSelect, loading, error, query }: Props) {
  if (!query) return null
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h3 style={{fontSize: 13, fontWeight: 700, margin: '0 0 8px'}}>Matching users</h3>
      <div className="users">
        {loading && <div className="hint">Searching…</div>}
        {!loading && !error && users.length === 0 && <div className="hint">No matches found.</div>}
        {error && <div className="hint" style={{color: 'var(--danger)'}}>{error}</div>}
        {users.map(u => (
          <button
            key={u.login}
            className={`user-btn ${selected === u.login ? 'user-selected' : ''}`}
            onClick={() => onSelect(u)}
            aria-pressed={selected === u.login}
          >
            <img src={u.avatar_url} alt="avatar" className="avatar" />
            <div style={{flex: 1, minWidth: 0}}>
              <div className="user-login">{u.login}</div>
              <div className="user-url">{u.html_url}</div>
            </div>
            <span style={{fontSize: 12, color: 'var(--accent-2)', fontWeight: 600}}>View repos →</span>
          </button>
        ))}
      </div>
    </div>
  )
}
