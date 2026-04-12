export default function CallsSection() {
  return (
    <section className="calls" id="calls">
      <div className="calls-inner">
        <div className="fade-up">
          <div className="section-label">Weekly calls</div>
          <h2>
            Where strangers
            <br />
            become <em>travel friends.</em>
          </h2>
          <p className="calls-body">
            Every week we hold an intimate group call on Zoom — themed around a
            destination, travel style, or topic the community votes on. 30
            minutes. 12 women. No awkward small talk.
          </p>
          <div className="call-schedule">
            <div className="call-item">
              <div className="call-dot" />
              <span className="call-topic">Solo travel safety &amp; tips</span>
              <span className="call-date">Every Tuesday</span>
            </div>
            <div className="call-item">
              <div className="call-dot" style={{ background: "var(--green)" }} />
              <span className="call-topic">
                Destination deep-dive: Southeast Asia
              </span>
              <span className="call-date">Bi-weekly</span>
            </div>
            <div className="call-item">
              <div className="call-dot" />
              <span className="call-topic">Budget travel for women 30+</span>
              <span className="call-date">Monthly</span>
            </div>
            <div className="call-item">
              <div className="call-dot" style={{ background: "var(--green)" }} />
              <span className="call-topic">
                Find your travel buddy — open mixer
              </span>
              <span className="call-date">Every Thursday</span>
            </div>
          </div>
        </div>

        <div className="calls-visual fade-up">
          <div className="calls-visual-title">This week&apos;s call · 8pm EST</div>
          {[
            { src: "https://randomuser.me/api/portraits/women/44.jpg", name: "Sofia M.", loc: "Barcelona" },
            { src: "https://randomuser.me/api/portraits/women/68.jpg", name: "Amara K.", loc: "London" },
            { src: "https://randomuser.me/api/portraits/women/26.jpg", name: "Rosa T.", loc: "New York" },
            { src: "https://randomuser.me/api/portraits/women/57.jpg", name: "Lena P.", loc: "Berlin" },
          ].map((a) => (
            <div className="attendee-row" key={a.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt={a.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              <div>
                <div className="att-name">{a.name}</div>
                <div className="att-loc">{a.loc}</div>
              </div>
              <span className="att-status">Going</span>
            </div>
          ))}
          <div className="attendee-row" style={{ borderBottom: "none" }}>
            <div
              className="att-avatar"
              style={{ background: "var(--cream-dark)", color: "var(--text-light)" }}
            >
              +
            </div>
            <div>
              <div className="att-name" style={{ color: "var(--text-light)" }}>
                7 more spots open
              </div>
              <div className="att-loc">Join this call →</div>
            </div>
            <a
              href="/signup"
              style={{
                fontSize: 12,
                color: "var(--pink)",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              RSVP
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
