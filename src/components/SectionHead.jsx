// "(02) About" row that opens every section.
export default function SectionHead({ num, label, children, inverse = false }) {
  return (
    <div className={`section-head${inverse ? ' section-head--inv' : ''}`} data-gen="component">
      <p className="label">
        {num && <span className="section-head__num num">({num})</span>}
        {label}
      </p>
      {children}
    </div>
  );
}
