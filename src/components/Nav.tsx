export default function Nav() {
  return (
    <nav>
      <a href="#" className="nav-logo">
        Modern Round <span>Table</span>
      </a>
      <div className="nav-links">
        <a href="#how">How it works</a>
        <a href="#features">What you get</a>
        <a href="#calls">Weekly calls</a>
        <a href="/signup" className="nav-cta">
          Create Profile
        </a>
      </div>
    </nav>
  );
}
