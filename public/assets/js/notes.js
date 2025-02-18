let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let activeNote = {}; 

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Fetch all saved notes from API
const getNotes = async () => {
  try {
    const response = await fetch('/api/notes', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notes. Status: ${response.status}`);
    }

    const notes = await response.json();
    console.log("Fetched Notes:", notes); // Debugging log
    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

// Save a new note to the API
const saveNote = async (note) => {
  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
};

// Delete a note from the API
const deleteNote = async (id) => {
  await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
};

// Render a selected note in the editor
const renderActiveNote = (note = {}) => {
  activeNote = note;
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title || '';
    noteText.value = activeNote.text || '';
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Fetch and render notes in the list
const getAndRenderNotes = async () => {
  const notes = await getNotes();
  renderNoteList(notes);
};

// Render notes in the sidebar list
const renderNoteList = (notes) => {
  if (!noteList) {
    console.error("Element .list-group not found");
    return;
  }

  noteList.innerHTML = ''; // Clear existing notes

  if (!notes.length) {
    noteList.innerHTML = "<p>No saved notes</p>";
    return;
  }

  notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note.title;
    li.classList.add("list-group-item");
    li.setAttribute("data-id", note.id);
    li.addEventListener("click", () => renderActiveNote(note));

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-id", note.id);
    deleteBtn.classList.add("delete-note");
    deleteBtn.addEventListener("click", handleNoteDelete);
    
    li.appendChild(deleteBtn);
    noteList.appendChild(li);
  });
};

// Handle saving a new note
const handleNoteSave = async () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  await saveNote(newNote);
  getAndRenderNotes();
  renderActiveNote({});
};

// Handle deleting a note
const handleNoteDelete = async (e) => {
  e.stopPropagation();
  const noteId = e.target.getAttribute('data-id');

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  await deleteNote(noteId);
  getAndRenderNotes();
  renderActiveNote({});
};

// Attach event listeners
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', renderActiveNote);
  getAndRenderNotes(); // Fetch notes when page loads
}