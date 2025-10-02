import React from 'react'

type Props = { text?: string | null }

export default function HintBar({ text }: Props) {
  if (!text) return null
  return <div className="hint">{text}</div>
}
