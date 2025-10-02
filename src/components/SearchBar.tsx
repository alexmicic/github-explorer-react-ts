import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="card">
      <label htmlFor="search" style={{fontSize: 13, fontWeight: 600}}>GitHub username</label>
      <input
        id="search"
        className="input"
        type="text"
        placeholder="e.g. gaearon, torvalds, vercel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}
