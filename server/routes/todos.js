import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const todo = await prisma.todo.create({
      data: { title: title.trim(), userId: req.user.id },
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid todo id' });
    const existing = await prisma.todo.findFirst({
      where: { id: idNum, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Todo not found' });
    const { title, completed } = req.body;
    const data = {};
    if (typeof title === 'string') data.title = title.trim();
    if (typeof completed === 'boolean') data.completed = completed;
    const todo = await prisma.todo.update({
      where: { id: idNum },
      data,
    });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid todo id' });
    const existing = await prisma.todo.findFirst({
      where: { id: idNum, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Todo not found' });
    await prisma.todo.delete({ where: { id: idNum } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
