import Header from './Header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="container">
        {children}
      </main>
      <footer>
        <div className="container">
          &copy; {new Date().getFullYear()} My Blog. All rights reserved.
        </div>
      </footer>
    </>
  );
}
