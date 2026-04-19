function Footer({ onOpenTrading }) {
  return (
    <footer className="site-footer">
      <div>
        <button className="brand-mark" type="button" onClick={onOpenTrading}>
          <span>F</span> Finfision
        </button>
        <p>Build steadier investing habits before money is on the line.</p>
      </div>
      <form className="newsletter" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="email">Join the waitlist</label>
        <div>
          <input id="email" type="email" placeholder="you@example.com" />
          <button type="submit">Join</button>
        </div>
      </form>
      <nav aria-label="Footer navigation">
        <a href="#features">Signals</a>
        <a href="#practice">Practice</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </nav>
    </footer>
  );
}

export default Footer;
