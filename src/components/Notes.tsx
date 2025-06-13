import React, { useState, useEffect } from 'react';
import './Notes.css';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
    setFormData({
      title: newNote.title,
      content: newNote.content
    });
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!activeNote) return;

    const updatedNote: Note = {
      ...activeNote,
      title: formData.title,
      content: formData.content,
      updatedAt: new Date().toISOString()
    };

    setNotes(prev =>
      prev.map(note => (note.id === activeNote.id ? updatedNote : note))
    );
    setActiveNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (activeNote?.id === noteId) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };

  const editNote = (note: Note) => {
    setActiveNote(note);
    setFormData({
      title: note.title,
      content: note.content
    });
    setIsEditing(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="notes-container">
      <h1>Quick Notes</h1>
      
      <div className="notes-header">
        <button className="new-note-btn" onClick={createNewNote}>
          + New Note
        </button>
      </div>

      <div className="notes-content">
        <div className="notes-sidebar">
          {notes.length === 0 ? (
            <p className="no-notes">No notes yet. Create your first note!</p>
          ) : (
            <div className="notes-list">
              {notes.map(note => (
                <div
                  key={note.id}
                  className={`note-item ${activeNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => editNote(note)}
                >
                  <h3>{note.title}</h3>
                  <p className="note-date">{formatDate(note.updatedAt)}</p>
                  <button
                    className="delete-note-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    title="Delete Note"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="note-editor">
          {isEditing ? (
            <div className="editor-container">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="note-title-input"
                placeholder="Note Title"
              />
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="note-content-input"
                placeholder="Write your note here..."
              />
              <div className="editor-actions">
                <button className="save-btn" onClick={saveNote}>
                  Save Note
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setActiveNote(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : activeNote ? (
            <div className="note-view">
              <h2>{activeNote.title}</h2>
              <p className="note-date">Last updated: {formatDate(activeNote.updatedAt)}</p>
              <div className="note-content">
                {activeNote.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <button className="edit-btn" onClick={() => editNote(activeNote)}>
                Edit Note
              </button>
            </div>
          ) : (
            <div className="no-note-selected">
              <p>Select a note to view or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes; 