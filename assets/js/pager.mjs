// 쪽 넘김 — 긴 줄 목록을 한 쪽씩 끊는다(사령관 2026-09-10, /insights/technology).
//
// 원칙: 스크립트가 없으면 목록이 통째로 선다. 그래서 단추를 산출물에 미리 심지 않고
// 여기서 만든다 — 심어 두면 JS 가 꺼진 화면에 눌리지 않는 단추만 남는다.
// 켜는 쪽은 데이터다: `data-paged="10"` 이 붙은 묶음만 나뉜다(partials/compositions.mjs).
//
// 쪽은 주소에 남기지 않는다. 이 목록은 갈래 하나의 최근분이라 3쪽을 남에게 보낼 일이
// 없고, 히스토리에 쌓이면 뒤로 가기가 목록 안을 맴돈다.
import { markFirstVisible } from "./rows.mjs?v=bde6ff3b8021";

const SIZE_MIN = 1;

export function initPagers() {
  for (const box of document.querySelectorAll("[data-paged]")) {
    const size = Number(box.dataset.paged);
    if (!Number.isFinite(size) || size < SIZE_MIN) continue;
    const rows = [...box.children];
    const last = Math.ceil(rows.length / size);
    if (last < 2) continue;

    const nav = document.createElement("nav");
    nav.className = "pager";
    nav.setAttribute("aria-label", "목록 쪽 넘김");

    const prev = button("‹", "이전 쪽");
    const next = button("›", "다음 쪽");
    const nums = document.createElement("div");
    nums.className = "pager__nums";
    const pages = [];
    for (let n = 1; n <= last; n += 1) {
      const b = button(String(n), `${n}쪽`);
      b.className = "pager__num";
      b.addEventListener("click", () => go(n, true));
      nums.append(b);
      pages.push(b);
    }
    prev.addEventListener("click", () => go(now - 1, true));
    next.addEventListener("click", () => go(now + 1, true));
    nav.append(prev, nums, next);
    box.after(nav);

    let now = 0;
    function go(n, moved) {
      const page = Math.min(Math.max(n, 1), last);
      if (page === now) return;
      now = page;
      const from = (page - 1) * size;
      rows.forEach((row, i) => {
        const on = i >= from && i < from + size;
        row.hidden = !on;
        // 등장 애니메이션의 순번은 보이는 줄 기준으로 다시 매긴다 — 원래 순번을 두면
        // 뒤쪽 쪽수가 스무 칸치 늦게 뜬다(styles/components.css 모션 구획).
        if (on) row.style.setProperty("--i", i - from);
      });
      // 첫 줄의 윗줄은 지운다 — 앞 줄이 숨어도 `.press + .press` 는 그대로 걸려
      // 두 쪽부터 목록 맨 위에 실선이 하나 뜬다(rows.mjs 에 이유가 적혀 있다).
      markFirstVisible(box);
      pages.forEach((b, i) => {
        if (i + 1 === page) b.setAttribute("aria-current", "page");
        else b.removeAttribute("aria-current");
      });
      prev.disabled = page === 1;
      next.disabled = page === last;
      // 첫 그림에서는 움직이지 않는다 — 화면을 연 사람이 목록으로 끌려간다.
      if (moved) box.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    go(1, false);
  }
}

function button(text, label) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "pager__step";
  b.textContent = text;
  b.setAttribute("aria-label", label);
  return b;
}
