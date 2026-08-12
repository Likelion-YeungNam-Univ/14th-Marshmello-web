import { Navbar } from "@/shared/components/ui/navbar"
import { Outlet } from "react-router-dom"

export default function App() {
  return(
    <div className = "min-h-dvh pb-[82px]">
      <main>
        <Outlet />
      </main>

      <Navbar />
    </div>
    
  ) 
}
