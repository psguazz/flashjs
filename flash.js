function initFlash() {
  const process = async (trigger, action, method, body) => {
    const message = trigger.dataset.flashConfirm;
    if (message && !window.confirm(message)) {
      return;
    }

    try {
      trigger.dataset.submitting = "true";

      const response = await fetch(action, {
        method,
        body,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      const html = await response.text();
      const temp = document.createElement("template");
      temp.innerHTML = html.trim();

      const fragments = temp.content.querySelectorAll("template[flash-target]");

      fragments.forEach((fragment) => {
        const targetId = fragment.getAttribute("flash-target");
        const action = fragment.getAttribute("flash-action") || "replace";
        const target = document.getElementById(targetId);

        if (!target) {
          return;
        }

        const children = [...fragment.content.children].map((node) =>
          node.cloneNode(true),
        );

        const op = {
          append: () => target.append(...children),
          prepend: () => target.prepend(...children),
          update: () => target.replaceChildren(...children),
          replace: () => target.replaceWith(...children),
        }[action];

        op?.();
      });
    } finally {
      delete trigger.dataset.submitting;
    }
  };

  const interceptLink = async (event) => {
    const link = event.target.closest("a[data-flash]");

    if (!link) {
      return;
    }

    event.preventDefault();
    await process(link, link.href, link.dataset.flashMethod || "GET");
  };

  const interceptForm = async (event) => {
    const form = event.target;

    if (!form.matches("form[data-flash]")) {
      return;
    }

    event.preventDefault();
    await process(form, form.action, form.method || "POST", new FormData(form));
  };

  document.addEventListener("submit", interceptForm);
  document.addEventListener("click", interceptLink);
}

document.addEventListener("DOMContentLoaded", function () {
  initSearch();
  initFlash();
});
