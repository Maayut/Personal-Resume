type SectionHeadingProps = {
  label: string;
  title: string;
  note?: string;
};

export function SectionHeading({ label, title, note }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <p className="section-label">{label}</p>
      <div>
        <h2>{title}</h2>
        {note ? <p className="section-heading-note">{note}</p> : null}
      </div>
    </header>
  );
}
