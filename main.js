const SELECTORS = {
  header: "[data-header]",
  nav: "[data-nav]",
  navToggle: "[data-nav-toggle]",
  copyTemplateBtn: "[data-copy-template]",
};

function setAriaExpanded(el, value) {
  el.setAttribute("aria-expanded", value ? "true" : "false");
}

function setupHeaderScroll() {
  const header = document.querySelector(SELECTORS.header);
  if (!header) return;

  const onScroll = () => {
    const scrolled = window.scrollY > 8;
    header.classList.toggle("isScrolled", scrolled);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupMobileNav() {
  const nav = document.querySelector(SELECTORS.nav);
  const toggle = document.querySelector(SELECTORS.navToggle);
  if (!nav || !toggle) return;

  const open = () => {
    nav.classList.add("isOpen");
    setAriaExpanded(toggle, true);
  };
  const close = () => {
    nav.classList.remove("isOpen");
    setAriaExpanded(toggle, false);
  };
  const isOpen = () => nav.classList.contains("isOpen");

  toggle.addEventListener("click", () => {
    if (isOpen()) close();
    else open();
  });

  nav.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("a") : null;
    if (a) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (!isOpen()) return;
    if (nav.contains(target) || toggle.contains(target)) return;
    close();
  });
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

function setupCopyTemplate() {
  const btn = document.querySelector(SELECTORS.copyTemplateBtn);
  if (!btn) return;

  const template =
    [
      "【行った施設】",
      "【エリア】",
      "【サウナ温度/水風呂温度】",
      "【よかった点】",
      "【混み具合】",
      "【アクセス】",
      "【ひとこと】",
    ].join("\n") + "\n";

  btn.addEventListener("click", async () => {
    const original = btn.textContent;
    btn.disabled = true;
    try {
      await copyText(template);
      btn.textContent = "コピーしました";
      window.setTimeout(() => {
        btn.textContent = original || "感想テンプレをコピー";
        btn.disabled = false;
      }, 1200);
    } catch {
      btn.textContent = "コピーに失敗しました";
      window.setTimeout(() => {
        btn.textContent = original || "感想テンプレをコピー";
        btn.disabled = false;
      }, 1600);
    }
  });
}

setupHeaderScroll();
setupMobileNav();
setupCopyTemplate();

