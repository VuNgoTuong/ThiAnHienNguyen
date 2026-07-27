import { useEffect, useRef, useState } from 'react'

// Reveals `text` a character at a time, like a dialog box. Restarts whenever
// `text` changes so it can be reused across a sequence of lines.
export function useTypewriter(text, { speedMs = 18 } = {}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayedText('')
    setIsDone(text.length === 0)
    indexRef.current = 0

    if (text.length === 0) return

    const intervalId = setInterval(() => {
      indexRef.current += 1
      setDisplayedText(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(intervalId)
        setIsDone(true)
      }
    }, speedMs)

    return () => clearInterval(intervalId)
  }, [text, speedMs])

  function skip() {
    setDisplayedText(text)
    setIsDone(true)
  }

  return { displayedText, isDone, skip }
}
