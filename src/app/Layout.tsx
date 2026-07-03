import { NavLink, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <header className="flex flex-wrap items-end justify-between gap-4 pt-8 pb-10">
        <NavLink to="/" className="leading-none">
          <span className="font-hand text-5xl font-bold">JS for babies</span>
          <span className="text-ink-soft mt-1 block text-sm">see JavaScript think ✏️</span>
        </NavLink>
        <nav className="font-hand flex gap-6 text-2xl">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'underline decoration-[var(--color-marker-yellow)] decoration-4 underline-offset-4' : 'hover:underline'
            }
          >
            the map
          </NavLink>
          <NavLink
            to="/design"
            className={({ isActive }) =>
              isActive ? 'underline decoration-[var(--color-marker-yellow)] decoration-4 underline-offset-4' : 'hover:underline'
            }
          >
            style guide
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
