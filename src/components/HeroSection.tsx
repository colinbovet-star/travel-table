export default function HeroSection() {
  return (
    <section className="hero">
      {/* Animated globe background */}
      <svg
        className="hero-globe"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="globe-clip">
            <circle cx="250" cy="250" r="220" />
          </clipPath>
        </defs>

        {/* Latitude lines */}
        <g clipPath="url(#globe-clip)" fill="none" stroke="var(--pink)" strokeWidth="0.8" strokeOpacity="0.18">
          {[-66, -40, -20, 0, 20, 40, 66].map((lat) => {
            const y = 250 + (lat / 90) * 220;
            const r = Math.sqrt(Math.max(0, 220 * 220 - (y - 250) * (y - 250)));
            return <ellipse key={lat} cx="250" cy={y} rx={r} ry={r * 0.18} />;
          })}
        </g>

        {/* Longitude lines — animated slow rotation */}
        <g clipPath="url(#globe-clip)" fill="none" stroke="var(--pink)" strokeWidth="0.8" strokeOpacity="0.18">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 250 250"
            to="360 250 250"
            dur="32s"
            repeatCount="indefinite"
          />
          {[0, 30, 60, 90, 120, 150].map((lng) => (
            <ellipse key={lng} cx="250" cy="250" rx="220" ry={220 * Math.abs(Math.cos((lng * Math.PI) / 180)) || 8} transform={`rotate(${lng} 250 250)`} />
          ))}
        </g>


      </svg>

      <div className="hero-content">
        <div className="hero-eyebrow">Travel Table</div>
        <h1>
          Find your
          <br />
          <em>travel companions.</em>
          <br />
          Discover the world.
        </h1>
        <p className="hero-sub">
          A virtual travel club for women 30+ who are done waiting for the
          &ldquo;perfect&rdquo; moment, and the right companions. Meet your
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
