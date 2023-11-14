import Nav from "/components/Nav";

function Layout({ children }) {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}

export default Layout;
