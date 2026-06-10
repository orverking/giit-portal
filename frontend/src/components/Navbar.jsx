import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import GradientButton from './GradientButton';

const Navbar = () => {
  const links = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Programmes', to: '/programmes' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-giit-purpleDeep via-giit-purple to-giit-orange text-lg font-black text-white">
            G
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">GIIT Makerere</p>
            <h1 className="text-sm font-bold text-white md:text-base">School Portal</h1>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <motion.span whileHover={{ y: -2 }} className="relative">
                  {link.label}
                  {isActive ? <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-giit-orange" /> : null}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <GradientButton to="/login" variant="ghost" className="hidden md:inline-flex">
            Sign In
          </GradientButton>
          <GradientButton to="/register">Apply / Register</GradientButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
