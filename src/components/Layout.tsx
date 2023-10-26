import { Nav } from './Nav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white">
      <Nav />

      {children}
    </div>
  );
};

export default Layout;
