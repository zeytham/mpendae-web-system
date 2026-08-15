const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const generateRefNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `MPS-${year}-${random}`;
};

module.exports = { slugify, generateRefNumber };
