function initFlash() {
  const process = async (action, method, body) => {
    try {
      {
        const response = await fetch(action, {
          method,
          body,
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });

        const html = await response.text();
        const temp = document.createElement("template");
        temp.innerHTML = html.trim();

        const fragments = temp.content.querySelectorAll(
          "template[flash-target]",
        );

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
            prepend: () => target.append(...children),
            update: () => target.replaceChildren(...children),
            replace: () => target.replaceWith(...children),
          }[action];

          op?.();
        });
      }
    } catch {}
  };

  const interceptLink = async (event) => {
    const link = event.target.closest("a[data-flash]");

    if (!link) {
      return;
    }

    event.preventDefault();

    if (link.dataset.submitting !== "true") {
      link.dataset.submitting = "true";
      await process(link.href, "GET");
      delete link.dataset.submitting;
    }
  };

  const interceptForm = async (event) => {
    const form = event.target;

    if (!form.matches("form[data-flash]")) {
      return;
    }

    event.preventDefault();

    if (form.dataset.submitting !== "true") {
      form.dataset.submitting = "true";
      await process(form.action, form.method || "POST", new FormData(form));
      delete form.dataset.submitting;
    }
  };

  document.addEventListener("submit", interceptForm);
  document.addEventListener("click", interceptLink);
}

document.addEventListener("DOMContentLoaded", function () {
  initSearch();
  initFlash();
});
