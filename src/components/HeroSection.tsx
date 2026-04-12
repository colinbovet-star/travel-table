export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-eyebrow">Travel Table</div>
        <h1>
          Find your
          <br />
          <em>travel crew.</em>
          <br />
          Explore together.
        </h1>
        <p className="hero-sub">
          A virtual travel club for women 30+ who are done waiting for the
          &ldquo;perfect&rdquo; moment — and the perfect companion. Meet your
          people. Plan your next adventure.
        </p>
        <div className="hero-actions">
          <a href="/signup" className="btn-primary">
            Create Profile
          </a>
          <a href="#how" className="btn-ghost">
            See how it works
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">Weekly</span>
            <span className="stat-label">Group calls</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">Free</span>
            <span className="stat-label">To join</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card-stack">
          <div className="member-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="card-photo" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sofia" />
            <div className="card-body">
              <div className="card-name">Sofia M.</div>
              <div className="card-meta">Barcelona · Active traveler</div>
              <div className="card-tags">
                <span className="card-tag">Southeast Asia</span>
                <span className="card-tag pink">Oct–Nov</span>
              </div>
            </div>
          </div>
          <div className="member-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="card-photo" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Amara" />
            <div className="card-body">
              <div className="card-name">Amara K.</div>
              <div className="card-meta">London · Culture + food</div>
              <div className="card-tags">
                <span className="card-tag">Japan</span>
                <span className="card-tag">Italy</span>
                <span className="card-tag pink">Spring</span>
              </div>
            </div>
          </div>
          <div className="member-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="card-photo" src="https://randomuser.me/api/portraits/women/26.jpg" alt="Rosa" />
            <div className="card-body">
              <div className="card-name">Rosa T.</div>
              <div className="card-meta">New York · Relaxed explorer</div>
              <div className="card-tags">
                <span className="card-tag">South America</span>
                <span className="card-tag pink">Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
