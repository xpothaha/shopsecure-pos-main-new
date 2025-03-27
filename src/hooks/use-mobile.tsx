
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Create media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Modern way to add event listener
    mql.addEventListener("change", handleChange)
    
    // Cleanup
    return () => mql.removeEventListener("change", handleChange)
  }, [])

  return isMobile
}
