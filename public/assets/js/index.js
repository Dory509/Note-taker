let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  if (elem) elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  if (elem) elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Fetch all saved notes from API
const getNotes = async () => {
  try {
    const response = await fetch('/api/notes', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notes. Status: ${response.status}`);
    }

    return await response.json();
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
    body: JSON.stringify(note)
  });
};

// Delete a note from the API
const deleteNote = async (id) => {
  await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
};

// Render a selected note in the editor
const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title || '';
    noteText.value = activeNote.text || '';
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Handle saving a new note
const handleNoteSave = async () => {
  const newNote = {
    title: noteTitle.value.trim(),
    text: noteText.value.trim()
  };

  if (!newNote.title || !newNote.text) {
    alert("Both title and text are required.");
    return;
  }

  await saveNote(newNote);
  getAndRenderNotes();
  renderActiveNote();
};

// Delete the clicked note
const handleNoteDelete = async (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteData = note.parentElement.getAttribute('data-note');

  if (!noteData) {
    console.error("Error: Missing note data");
    return;
  }

  const noteId = JSON.parse(noteData).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  await deleteNote(noteId);
  getAndRenderNotes();
  renderActiveNote();
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  const noteData = e.target.parentElement.getAttribute('data-note');

  if (!noteData) {
    console.error("Error: Missing note data");
    return;
  }

  activeNote = JSON.parse(noteData);
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = () => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Renders the appropriate buttons based on the state of the form
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async () => {
  const notes = await getNotes();

  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('button');
      delBtnEl.textContent = "Delete";
      delBtnEl.classList.add('delete-note');
      delBtnEl.addEventListener('click', handleNoteDelete);
      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (notes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  notes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => renderNoteList();

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  if (clearBtn) clearBtn.addEventListener('click', renderActiveNote);
  if (noteForm) noteForm.addEventListener('input', handleRenderBtns);
}

getAndRenderNotes();