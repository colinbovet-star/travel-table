const features = [
  {
    icon: "🪪",
    title: "Your travel profile",
    body: "Show who you are as a traveller — your style, your regions, your vibe. Photos, bio, and the kind of trip you're actually dreaming about.",
  },
  {
    icon: "🌍",
    title: "Member directory",
    body: "Browse women by destination interest, travel style, and availability. Find someone heading to Vietnam in October — not just \"anywhere warm.\"",
  },
  {
    icon: "📞",
    title: "Weekly group calls",
    body: "Small, intimate Zoom sessions — 12 women max — where you talk travel, swap tips, and actually get to know each other before committing to a trip.",
  },
  {
    icon: "✈️",
    title: "Trip plans visible",
    body: "Add your upcoming trips and travel windows. Let other members see where you're headed — and who might want to join.",
  },
  {
    icon: "🤝",
    title: "Real community",
    body: "Not a swipe app. Not a dating platform. A genuine club where women who love travel build real friendships over shared wanderlust.",
  },
  {
    icon: "🆓",
    title: "Free to join",
    body: "We're in launch mode — which means right now, it costs nothing. Get in early, help shape the community, and lock in founding member status.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="features-inner">
        <div className="features-header fade-up">
          <div className="section-label">What you get</div>
          <h2>
            Everything a travel
            <br />
            club should <em>be.</em>
          </h2>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card fade-up">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-body">{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
