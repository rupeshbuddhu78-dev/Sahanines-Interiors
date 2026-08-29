// Simple JSON-based data store for demo
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

const defaultData = {
  admins: [],
  settings: [],
  services: [],
  projects: [],
  gallery: [],
  testimonials: [],
  faqs: [],
  enquiries: [],
  counters: { admin: 0, settings: 0, service: 0, project: 0, gallery: 0, testimonial: 0, faq: 0, enquiry: 0 }
};

let data;

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } else {
      data = JSON.parse(JSON.stringify(defaultData));
    }
  } catch (e) {
    data = JSON.parse(JSON.stringify(defaultData));
  }
  return data;
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function nextId(collection) {
  data.counters[collection] = (data.counters[collection] || 0) + 1;
  return String(data.counters[collection]);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

// Initialize
load();

module.exports = { data, save, load, nextId, slugify, DB_PATH };
