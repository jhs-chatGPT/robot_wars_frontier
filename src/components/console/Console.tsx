import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PanelProps = { title: string; subtitle: string; className?: string; children: ReactNode };
export function HeaderFrame({title, subtitle}: Pick<PanelProps, 'title' | 'subtitle'>) {
  return <header className="panel-header"><h2>{title}</h2><small>{subtitle}</small></header>;
}
export function MainPanel({title, subtitle, className = '', children}: PanelProps) {
  return <section className={`command-panel ${className}`}><HeaderFrame title={title} subtitle={subtitle}/>{children}</section>;
}
export const SubPanel = MainPanel;
export function PrimaryButton({className = '', ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`console-button ${className}`} {...props}/>;
}
export function QuickMenuCard({title, description, icon, onClick}: {title: string; description: string; icon: string; onClick: () => void}) {
  return <button type="button" className="command-panel quick-menu-card" onClick={onClick}><img src={`/assets/ui/icon_${icon}.svg`} alt=""/><span><b>{title}</b><small>{description}</small></span></button>;
}
export function MenuButton({label, sublabel, icon, active, onClick}: {label: string; sublabel: string; icon: string; active: boolean; onClick: () => void}) {
  return <button type="button" className={`console-menu-button${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} aria-label={label} title={label} onClick={onClick}><span className="rwf-nav-icon" aria-hidden="true"><img src={`/assets/ui/icon_${icon}.svg`} alt=""/></span><span className="rwf-nav-copy"><b>{label}</b><small>{sublabel}</small></span></button>;
}
