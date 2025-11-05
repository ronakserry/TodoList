(() => {
  /**
   * Minimal Todo list logic with localStorage persistence and progress bar.
   */

  const STORAGE_KEY = "todos:v1";

  const elements = {
    input: document.getElementById("taskInput"),
    addButton: document.getElementById("AddTask"),
    list: document.getElementById("tasklist"),
    progressBar: document.getElementById("ProgressBar"),
    // The template currently uses an id with a typo: PorgressValue
    progressValue: document.getElementById("PorgressValue"),
    emptyModal: document.getElementById("EmptyTaskModal"),
    emptyOk: document.getElementById("EmptyTaskOk"),
    emptyClose: document.getElementById("EmptyTaskClose"),
  };

  /** @type {{ id: string; text: string; completed: boolean }[]} */
  let todos = [];

  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      todos = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(todos)) todos = [];
    } catch {
      todos = [];
    }
  }

  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore storage errors
    }
  }

  function createTodo(text) {
    return {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      text,
      completed: false,
    };
  }

  function renderTodos() {
    if (!elements.list) return;
    elements.list.innerHTML = "";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "flex items-center gap-3 text-white/90";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.className = "size-4 accent-white/80";
      checkbox.setAttribute("data-action", "toggle");
      checkbox.setAttribute("data-id", todo.id);

      const label = document.createElement("label");
      label.textContent = todo.text;
      label.className = todo.completed ? "line-through opacity-70" : "";

      const spacer = document.createElement("div");
      spacer.className = "flex-1";

      const actions = document.createElement("div");
      actions.className = "ml-auto flex items-center gap-2";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit";
      edit.title = "Edit";
      edit.className = "px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/90 text-xs border border-white/20";
      edit.setAttribute("aria-label", "Edit task");
      edit.setAttribute("data-action", "edit");
      edit.setAttribute("data-id", todo.id);

      const done = document.createElement("button");
      done.type = "button";
      done.textContent = "Done";
      done.title = "Mark as done";
      done.className = "px-2 py-1 rounded bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-100 text-xs border border-emerald-200/30";
      done.setAttribute("aria-label", "Mark task as done");
      done.setAttribute("data-action", "done");
      done.setAttribute("data-id", todo.id);

      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.title = "Delete";
      del.className = "px-2 py-1 rounded bg-rose-400/20 hover:bg-rose-400/30 text-rose-100 text-xs border border-rose-200/30";
      del.setAttribute("aria-label", "Delete task");
      del.setAttribute("data-action", "delete");
      del.setAttribute("data-id", todo.id);

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(spacer);
      actions.appendChild(edit);
      actions.appendChild(done);
      actions.appendChild(del);
      li.appendChild(actions);
      elements.list.appendChild(li);
    });
  }

  function updateProgress() {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    if (elements.progressBar) {
      elements.progressBar.style.width = pct + "%";
    }
    if (elements.progressValue) {
      elements.progressValue.textContent = pct + "%";
    }
  }

  function addTodoFromInput() {
    if (!elements.input) return;
    const value = elements.input.value.trim();
    if (!value) {
      showEmptyModal();
      return;
    }
    todos.push(createTodo(value));
    elements.input.value = "";
    saveTodos();
    renderTodos();
    updateProgress();
  }

  function handleListClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");
    if (!action || !id) return;

    if (action === "toggle") {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateProgress();
      }
    }

    if (action === "done") {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = true;
        saveTodos();
        renderTodos();
        updateProgress();
      }
    }

    if (action === "edit") {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        const next = prompt("Edit task", todo.text);
        if (next !== null) {
          const trimmed = next.trim();
          if (trimmed.length > 0) {
            todo.text = trimmed;
            saveTodos();
            renderTodos();
          }
        }
      }
    }

    if (action === "delete") {
      todos = todos.filter((t) => t.id !== id);
      saveTodos();
      renderTodos();
      updateProgress();
    }
  }

  function bindEvents() {
    if (elements.addButton) {
      elements.addButton.addEventListener("click", addTodoFromInput);
    }
    if (elements.input) {
      elements.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTodoFromInput();
      });
    }
    if (elements.list) {
      elements.list.addEventListener("click", handleListClick);
    }

    // Modal controls
    if (elements.emptyOk) {
      elements.emptyOk.addEventListener("click", hideEmptyModal);
    }
    if (elements.emptyClose) {
      elements.emptyClose.addEventListener("click", hideEmptyModal);
    }
    if (elements.emptyModal) {
      elements.emptyModal.addEventListener("click", (e) => {
        if (e.target === elements.emptyModal) hideEmptyModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") hideEmptyModal();
      });
    }
  }

  function showEmptyModal() {
    if (!elements.emptyModal) return;
    elements.emptyModal.classList.remove("hidden");
  }

  function hideEmptyModal() {
    if (!elements.emptyModal) return;
    elements.emptyModal.classList.add("hidden");
    if (elements.input) elements.input.focus();
  }

  // Initialize
  loadTodos();
  bindEvents();
  renderTodos();
  updateProgress();
})();


