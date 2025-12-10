const router = require('express').Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  summarizeNote
} = require('../controllers/noteController');

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/summarize', summarizeNote);
router.post('/summarize-text', require('../controllers/noteController').summarizeContent);

module.exports = router;
