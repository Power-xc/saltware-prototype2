// 층 고리([data-rings]) — 오른쪽 줄에 손이 닿으면 같은 순번의 고리가 켜지고, 고리에 닿으면 줄이 켜진다
// (partials/chapters.mjs rings). 아무것도 닿지 않으면 첫 줄이 켜져 있다 — 빈 그림으로 두지 않는다.
// 스크립트가 없으면 고리는 그림, 줄은 링크로 그대로 읽힌다.

export function initRings() {
  for (const box of document.querySelectorAll("[data-rings]")) {
    const parts = [...box.querySelectorAll("[data-ring]")];
    const show = (i) => parts.forEach((p) => p.classList.toggle("is-on", p.dataset.ring === String(i)));
    for (const p of parts) {
      p.addEventListener("pointerenter", () => show(p.dataset.ring));
      p.addEventListener("focus", () => show(p.dataset.ring));
    }
    show(0);
  }
}
