const { deleteFromCloudinary } = require('../utils/cloudinary');
const { slugify } = require('../utils/slugify');

const prisma = require('../utils/prisma');

const getPublished = async (req, res, next) => {
  try {
    const { page = 1, category = '' } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 9, 50); // cap ili kuzuia abuse
    const skip = (parseInt(page) - 1) * limit;
    const where = {
      status: 'PUBLISHED',
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
    };
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where, skip, take: limit,
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, author: true, publishedAt: true, views: true },
      }),
      prisma.news.count({ where }),
    ]);
    res.json({ news, pagination: { total, page: parseInt(page), limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { page = 1, status = '' } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (parseInt(page) - 1) * limit;
    const where = status ? { status } : {};
    const [news, total] = await Promise.all([
      prisma.news.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.news.count({ where }),
    ]);
    res.json({ news, pagination: { total, page: parseInt(page), limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const article = await prisma.news.findUnique({ where: { slug: req.params.slug } });
    if (!article || article.status !== 'PUBLISHED') return res.status(404).json({ error: 'Article not found.' });
    await prisma.news.update({ where: { slug: req.params.slug }, data: { views: { increment: 1 } } });
    res.json({ ...article, views: article.views + 1 });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, content, category, author, status, excerpt } = req.body;
    const coverImage = req.file ? req.file.path : null;
    const coverPubId = req.file ? req.file.filename : null;

    let slug = slugify(title);
    const exists = await prisma.news.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now()}`;

    const article = await prisma.news.create({
      data: {
        title, content, category, author, excerpt,
        slug, coverImage, coverPubId,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
    res.status(201).json({ message: 'News article created.', article });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Article not found.' });

    let coverImage = existing.coverImage;
    let coverPubId = existing.coverPubId;
    if (req.file) {
      if (existing.coverPubId) await deleteFromCloudinary(existing.coverPubId);
      coverImage = req.file.path;
      coverPubId = req.file.filename;
    }

    // Fields zilizothibitishwa tu (req.body imepitia updateNewsSchema) — hakuna mass-assignment
    const { title, content, excerpt, category, author, status } = req.body;

    const article = await prisma.news.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(category !== undefined && { category }),
        ...(author !== undefined && { author }),
        ...(status !== undefined && { status }),
        coverImage,
        coverPubId,
        publishedAt: status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });
    res.json({ message: 'Article updated.', article });
  } catch (error) {
    next(error);
  }
};

const togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.news.findUnique({ where: { id } });
    if (!article) return res.status(404).json({ error: 'Article not found.' });

    const newStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const updated = await prisma.news.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt: newStatus === 'PUBLISHED' ? new Date() : article.publishedAt,
      },
    });
    res.json({ message: `Article ${newStatus.toLowerCase()}.`, article: updated });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const article = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!article) return res.status(404).json({ error: 'Article not found.' });
    if (article.coverPubId) await deleteFromCloudinary(article.coverPubId);
    await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ message: 'Article deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublished, getAll, getBySlug, create, update, togglePublish, remove };