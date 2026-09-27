export function Arrow({ diagonal = false, down = false, ...props }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...props}>{diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : down ? <path d="M12 3v18m-7-7 7 7 7-7" /> : <path d="M3 12h18m-7-7 7 7-7 7" />}</svg>;
}
export function Play({ ...props }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" {...props}><path d="m8 5 11 7-11 7Z" /></svg>;
}
export function Close() {
  return <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}
