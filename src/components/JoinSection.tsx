export default function JoinSection() {
  return (
    <section className="join-section" id="join">
      <div className="section-label">Ready to join?</div>
      <h2>
        Pull up a <em>chair.</em>
      </h2>
      <p className="join-sub">
        Create your travel profile in 5 minutes. Tell us who you are, where
        you&apos;re headed, and find women who travel the same way you do.
      </p>
      <a
        href="/signup"
        className="btn-join"
        style={{ display: "inline-block", textDecoration: "none" }}
      >
        Create Profile
      </a>
      <p className="join-note">
        Free to join · No spam · Founding member status locked in
      </p>
    </section>
  );
}
