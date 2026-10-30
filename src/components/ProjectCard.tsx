import type { CatalogItem } from "../lib/catalog";

interface Props {
  item: CatalogItem;
}

/**
 * One catalog card. The title is the card's only link; its `::after`
 * stretches over the card so the whole card is clickable.
 */
export function ProjectCard({ item }: Props) {
  return (
    <article className="relative flex h-full flex-col gap-4 rounded-card border border-line bg-bg-raised p-6 transition-colors focus-within:border-fg hover:border-fg">
      <p aria-hidden="true" className="text-sm text-muted tabular-nums">
        {item.number}
      </p>
      <h3 className="text-xl font-medium tracking-tight">
        <a
          href={item.href}
          className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-focus"
        >
          {item.title}
        </a>
      </h3>
      <p className="text-muted">{item.summary}</p>
      {item.metrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          {item.metrics.map(({ label, value }) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-2xl font-medium tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <ul aria-label="Stack" className="mt-auto flex flex-wrap gap-2 text-sm">
        {item.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-card border border-line px-2 py-0.5"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}
