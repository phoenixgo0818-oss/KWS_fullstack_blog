import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar" aria-label="Main">
            <ul className="navbar__list">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/articles-list">Articles</Link>
                </li>
                <li>
                    <Link to="/write">Write</Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;