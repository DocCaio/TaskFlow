import { NavLink } from "react-router-dom";


const links = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/postar", label: "Postar" },
];

export function Navbar() {
  return (
    <header className="border-b border-borda bg-superficie">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
            <img src="https://imgur.com/5Sdq2tJ.png" alt="Logo" className="h-10 w-auto"/>
        </NavLink>

        <ul className="flex items-center gap-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `font-medium transition-colors hover:text-laranja ${
                    isActive ? "text-verde" : "text-texto"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
