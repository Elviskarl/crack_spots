export async function copyToClipBoard(el: HTMLElement) {
  try {
    await navigator.clipboard.writeText(el.innerText);
  } catch (err) {
    console.error("Failed to copy text", err);
  }
}
