import { Navbar, NavItem } from 'shadcn-ui';
import Link from 'next/link';

const Header = () => {
  return (
    <Navbar className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">
            <a>Resource Collection</a>
          </Link>
        </div>
        <div className="flex space-x-4">
          <NavItem>
            <Link href="/">
              <a>Home</a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/about">
              <a>About</a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/contact">
              <a>Contact</a>
            </Link>
          </NavItem>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
