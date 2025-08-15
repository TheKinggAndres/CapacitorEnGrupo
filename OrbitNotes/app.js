let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let selectedId = null;

const q = document.getElementById("q");
const list = document.getElementById("list");
const empty = document.getElementById("empty");

const title = document.getElementById("title");
const content = document.getElementById("content");
const tags = document.getElementById("tags");

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes(filter = "") {
  list.innerHTML = "";
  let filtered = notes.filter(n =>
    n.title.toLowerCase().includes(filter) ||
    n.content.toLowerCase().includes(filter) ||
    n.tags.some(t => t.includes(filter))
  );
  if (filtered.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  filtered.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${note.title || "(Sin título)"}</h3>
      <p>${note.content}</p>
      <div class="tags">${note.tags.map(t => `<span class="tag">#${t}</span>`).join("")}</div>
      <div class="actions">
        <button class="btn ghost" onclick="editNote('${note.id}')">Editar</button>
        <button class="btn danger" onclick="deleteNote('${note.id}')">Eliminar</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function newNote() {
  selectedId = null;
  title.value = "";
  content.value = "";
  tags.value = "";
}

function saveNote() {
  const newNote = {
    id: selectedId || Date.now().toString(),
    title: title.value.trim(),
    content: content.value.trim(),
    tags: tags.value.split(",").map(t => t.trim()).filter(Boolean)
  };
  if (selectedId) {
    notes = notes.map(n => n.id === selectedId ? newNote : n);
  } else {
    notes.push(newNote);
  }
  saveNotes();
  renderNotes(q.value.toLowerCase());
  newNote();
}

function editNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  selectedId = id;
  title.value = note.title;
  content.value = note.content;
  tags.value = note.tags.join(", ");
}

function deleteNote(id) {
  if (!confirm("¿Eliminar esta nota?")) return;
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes(q.value.toLowerCase());
}

document.getElementById("saveBtn").onclick = saveNote;
document.getElementById("clearBtn").onclick = newNote;
document.getElementById("newBtn").onclick = newNote;

q.addEventListener("input", () => {
  renderNotes(q.value.toLowerCase());
});

renderNotes();
