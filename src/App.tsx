import { useEffect, useMemo, useState } from 'react'
import SearchBar from '@components/SearchBar'
import UserList from '@components/UserList'
import RepoList from '@components/RepoList'
import HintBar from '@components/HintBar'
import type { GithubUser, GithubRepo } from './types'
import { useDebouncedValue } from '@hooks/useDebounce'
import { searchUsers, fetchAllRepos } from '@services/github'

export default function App() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 400)

  const [users, setUsers] = useState<GithubUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)

  const [selectedUser, setSelectedUser] = useState<GithubUser | null>(null)
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(false)
  const [reposError, setReposError] = useState<string | null>(null)

  // Search users
  useEffect(() => {
    let active = true
    async function run() {
      if (!debouncedQuery) {
        setUsers([]); setUsersError(null); return
      }
      setUsersLoading(true); setUsersError(null); setRateLimited(false)
      const { data, error, rateLimited } = await searchUsers(debouncedQuery, 5)
      if (!active) return
      if (rateLimited) setRateLimited(true)
      if (error) { setUsersError(error); setUsers([]) }
      else setUsers(data?.items || [])
      setUsersLoading(false)
    }
    run()
    return () => { active = false }
  }, [debouncedQuery])

  async function loadAllRepos(username: string) {
    setRepos([]); setReposError(null); setReposLoading(true); setRateLimited(false)
    const { data, error, rateLimited } = await fetchAllRepos(username)
    if (rateLimited) setRateLimited(true)
    if (error) setReposError(error)
    setRepos(data || [])
    setReposLoading(false)
  }

  function onSelectUser(u: GithubUser) {
    setSelectedUser(u)
    loadAllRepos(u.login)
  }

  const hint = useMemo(() => {
    if (rateLimited) return 'GitHub API rate limit reached. Add VITE_GITHUB_TOKEN to a .env file or try later.'
    if (usersLoading) return 'Searching users...'
    if (reposLoading) return `Loading ${selectedUser?.login}'s repositories...`
    if (usersError) return usersError
    if (reposError) return reposError
    return ''
  }, [rateLimited, usersLoading, reposLoading, usersError, reposError, selectedUser?.login])

  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <h1 className="title">GitHub Explorer</h1>
          <p className="subtitle">Search users → view public repositories</p>
        </div>
      </header>

      <main className="container">
        <SearchBar value={query} onChange={setQuery} />
        <UserList
          users={users}
          selected={selectedUser?.login || null}
          onSelect={onSelectUser}
          loading={usersLoading}
          error={usersError}
          query={query}
        />
        {hint && <HintBar text={hint} />}
        {selectedUser && (
          <section style={{ marginTop: 16 }}>
            <div className="actions">
              <a href={selectedUser.html_url} target="_blank" rel="noreferrer" style={{display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none'}}>
                <img src={selectedUser.avatar_url} alt="avatar" className="small-avatar" />
                <span style={{fontWeight:700}}>{selectedUser.login}</span>
              </a>
              <button className="refresh" onClick={() => loadAllRepos(selectedUser.login)}>Refresh</button>
            </div>
            <RepoList repos={repos} loading={reposLoading} error={reposError} />
          </section>
        )}
        <footer className="footer">
          Copyright &copy; 2025.
        </footer>
      </main>
    </div>
  )
}
