import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header>
      <div className="container">
        <Link to="/" className="logo">
          My Blog.
        </Link>
        <div className="nav-links">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
