import Nav from "/components/Nav";

function Layout({ children }) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}

export default Layout;
