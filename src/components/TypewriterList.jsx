import React, { useState, useEffect } from 'react'
import { Typewriter } from 'react-simple-typewriter'

const TypewriterList = ({ lines, typingSpeed = 40, delayBetween = 500 }) => {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (currentLineIndex >= lines.length) return

    if (charIndex < lines[currentLineIndex].length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + lines[currentLineIndex][charIndex])
        setCharIndex((prev) => prev + 1)
      }, typingSpeed)
      return () => clearTimeout(timeout)
    } else {
      const delay = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, lines[currentLineIndex]])
        setCurrentText('')
        setCharIndex(0)
        setCurrentLineIndex((prev) => prev + 1)
      }, delayBetween)
      return () => clearTimeout(delay)
    }
  }, [charIndex, currentLineIndex, lines, typingSpeed, delayBetween])

  return (
    <div className="text-lg md:text-xl space-y-1 pl-6 text-cyan-300">
      {displayedLines.map((line, index) => (
        <div key={index}>• {line}</div>
      ))}
      {currentText && <div>• {currentText}</div>}
    </div>
  )
}

export default TypewriterList