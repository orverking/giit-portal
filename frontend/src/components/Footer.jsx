const Footer = () => (
  <footer className="border-t border-white/10 bg-black/40 py-12">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-white/40">GIIT</p>
        <h3 className="mt-2 text-2xl font-black text-white">Global Institute of Information Technology & Business</h3>
        <p className="mt-3 max-w-md text-white/60">
          A next-generation school portal for blended learning, practical skills development and delightfully
          engaging student success experiences.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-white">Campuses & Contact</h4>
        <p className="mt-3 text-white/60">Haruna Towers, Wandegeya, Kampala, Uganda</p>
        <p className="text-white/60">Jinja City – Light Arcade Plot 80, Main Street</p>
        <p className="mt-2 text-white/60">info@giit.ac.ug • +256 776 945 602</p>
      </div>
      <div>
        <h4 className="font-semibold text-white">Admissions</h4>
        <p className="mt-3 text-white/60">Three intakes every year: January, May and September.</p>
        <p className="text-white/60">Flexible morning, afternoon, evening, weekend and online schedules.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
