export const loadNotes = () => {
  try {
    const data = localStorage.getItem("notemint_notes");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error loading notes from LocalStorage", err);
    return [];
  }
};

export const saveNotes = (notes) => {
  localStorage.setItem("notemint_notes", JSON.stringify(notes));
};
