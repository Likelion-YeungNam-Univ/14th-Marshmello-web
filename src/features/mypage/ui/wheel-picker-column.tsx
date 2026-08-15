import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type UIEvent,
} from "react"

import { cn } from "@/shared/lib/utils"

const ITEM_HEIGHT = 44
const SCROLL_END_DELAY_MS = 120

export interface WheelPickerColumnProps<T> {
  ariaLabel: string
  getLabel?: (item: T) => string
  items: T[]
  onChange: (value: T) => void
  value: T
}

export function WheelPickerColumn<T>({
  ariaLabel,
  getLabel = String,
  items,
  onChange,
  value,
}: WheelPickerColumnProps<T>) {
  const listboxId = useId()
  const viewportRef = useRef<HTMLDivElement>(null)
  const scrollEndTimerRef = useRef<number | null>(null)
  const hasPositionedInitiallyRef = useRef(false)
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => Object.is(item, value)),
  )

  const scrollToIndex = (index: number, behavior: ScrollBehavior) => {
    viewportRef.current?.scrollTo({
      behavior,
      top: index * ITEM_HEIGHT,
    })
  }

  useLayoutEffect(() => {
    scrollToIndex(
      selectedIndex,
      hasPositionedInitiallyRef.current ? "smooth" : "auto",
    )
    hasPositionedInitiallyRef.current = true
  }, [items.length, selectedIndex])

  useEffect(
    () => () => {
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current)
      }
    },
    [],
  )

  const commitClosestValue = () => {
    const viewport = viewportRef.current
    if (!viewport || items.length === 0) return

    const closestIndex = Math.min(
      items.length - 1,
      Math.max(0, Math.round(viewport.scrollTop / ITEM_HEIGHT)),
    )

    scrollToIndex(closestIndex, "smooth")

    if (!Object.is(items[closestIndex], value)) {
      onChange(items[closestIndex])
    }
  }

  const handleScroll = (_event: UIEvent<HTMLDivElement>) => {
    if (scrollEndTimerRef.current !== null) {
      window.clearTimeout(scrollEndTimerRef.current)
    }

    scrollEndTimerRef.current = window.setTimeout(
      commitClosestValue,
      SCROLL_END_DELAY_MS,
    )
  }

  const selectIndex = (index: number) => {
    const nextIndex = Math.min(items.length - 1, Math.max(0, index))
    const nextValue = items[nextIndex]

    if (nextValue === undefined) return

    onChange(nextValue)
    scrollToIndex(nextIndex, "smooth")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      selectIndex(selectedIndex - 1)
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      selectIndex(selectedIndex + 1)
    }

    if (event.key === "Home") {
      event.preventDefault()
      selectIndex(0)
    }

    if (event.key === "End") {
      event.preventDefault()
      selectIndex(items.length - 1)
    }
  }

  return (
    <div className="relative h-[132px] w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-11 z-0 h-11 border-y border-[#f4e1eb] bg-[#fff9fc]"
      />
      <div
        aria-activedescendant={`${listboxId}-option-${selectedIndex}`}
        aria-label={ariaLabel}
        className="relative z-10 h-[132px] snap-y snap-mandatory touch-pan-y overflow-y-auto overscroll-contain scroll-smooth py-11 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        ref={viewportRef}
        role="listbox"
        tabIndex={0}
      >
        {items.map((item, index) => {
          const isSelected = Object.is(item, value)

          return (
            <div
              aria-selected={isSelected}
              className={cn(
                "flex h-11 cursor-pointer snap-center items-center justify-center text-center transition-[color,font-size,opacity] duration-150 select-none",
                isSelected
                  ? "text-[17px] font-semibold text-[#3d3d3d] opacity-100"
                  : "text-[14px] font-medium text-[#c7bec4] opacity-70",
              )}
              id={`${listboxId}-option-${index}`}
              key={`${getLabel(item)}-${index}`}
              onClick={() => selectIndex(index)}
              role="option"
            >
              {getLabel(item)}
            </div>
          )
        })}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-11 bg-gradient-to-b from-white to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-11 bg-gradient-to-t from-white to-transparent"
      />
    </div>
  )
}
