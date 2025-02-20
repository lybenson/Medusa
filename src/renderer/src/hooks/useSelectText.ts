import { useLayoutEffect, useState } from 'react'

export const useSelectText = (
  selectableRef: React.MutableRefObject<HTMLDivElement | null>,
  isMounted: boolean
) => {
  const [popoverPosition, setPopoverPosition] = useState({
    left: 0,
    top: 0
  })
  const [selectedText, setSelectedText] = useState('')

  const handleSelection = () => {
    const selection = window.getSelection()
    if (
      selection &&
      selection.rangeCount > 0 &&
      selection.toString().length > 0
    ) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setPopoverPosition({
        left: rect.x + rect.width / 2,
        top: rect.y + rect.height + 5
      })
      const trimedSelectedText = selection.toString().trim()

      if (trimedSelectedText) {
        setSelectedText(
          trimedSelectedText.charAt(0).toLowerCase() +
            trimedSelectedText.slice(1)
        )
      }
    }
  }

  useLayoutEffect(() => {
    if (!selectableRef.current) return

    const selectableEle = selectableRef.current

    const handleMouseUp = handleSelection

    const handleKeyUp = (event) => {
      if (event.key === 'Shift') {
        handleSelection()
      }
    }

    selectableEle?.addEventListener('mouseup', handleMouseUp)
    selectableEle?.addEventListener('keyup', handleKeyUp)
    return () => {
      selectableEle?.removeEventListener('mouseup', handleMouseUp)
      selectableEle?.removeEventListener('keyup', handleKeyUp)
    }
  }, [selectableRef.current, isMounted])

  return {
    selectedText,
    popoverPosition
  }
}
