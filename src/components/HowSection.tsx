export default function HowSection() {
  return (
    <section className="how" id="how">
      <div className="how-inner">
        <div className="how-header fade-up">
          <div className="section-label">How it works</div>
          <h2>
            Four steps to your
            <br />
            next <em>adventure.</em>
          </h2>
        </div>
        <div className="steps">
          <div className="step fade-up">
            <div className="step-num">01</div>
            <div className="step-title">Create your profile</div>
            <div className="step-body">
              Share your travel style, dream destinations, and when you&apos;re
              free to go. Active explorer or slow traveller, we want the real
              you.
            </div>
            <span className="step-tag">5 minutes</span>
          </div>
          <div className="step fade-up">
            <div className="step-num">02</div>
            <div className="step-title">Browse the directory</div>
            <div className="step-body">
              See other members, filter by region, style, and timing. Discover
              women who travel the way you do.
            </div>
            <span className="step-tag">No algorithm needed</span>
          </div>
          <div className="step fade-up">
            <div className="step-num">03</div>
            <div className="step-title">Join weekly calls</div>
            <div className="step-body">
              Every week we gather on Zoom — themed conversations about
              destinations, planning, solo travel tips, and everything in
              between.
            </div>
            <span className="step-tag">Every week</span>
          </div>
          <div className="step fade-up">
            <div className="step-num">04</div>
            <div className="step-title">Find your travel companions</div>
            <div className="step-body">
              The real magic happens when strangers become friends. Plan your
              trip together, or just cheer each other on.
            </div>
            <span className="step-tag">The good part</span>
          </div>
        </div>
      </div>
    </section>
  );
}
