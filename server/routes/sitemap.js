const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');
const Service = require('../models/Service');
const Project = require('../models/Project');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://sahaninesinteriors.com';
    const sm = new SitemapStream({ hostname: baseUrl });

    // Static pages
    const pages = ['/', '/about', '/services', '/projects', '/gallery', '/reviews', '/faq', '/contact'];
    pages.forEach(p => sm.write({ url: p, changefreq: 'weekly', priority: p === '/' ? 1.0 : 0.8 }));

    // Dynamic service pages
    const services = await Service.find({ isActive: true });
    services.forEach(s => sm.write({ url: `/services/${s.slug}`, changefreq: 'monthly', priority: 0.7 }));

    // Dynamic project pages
    const projects = await Project.find({ isActive: true });
    projects.forEach(p => sm.write({ url: `/projects/${p.slug}`, changefreq: 'monthly', priority: 0.6 }));

    sm.end();
    const xml = await streamToPromise(sm);
    res.header('Content-Type', 'application/xml');
    res.send(xml.toString());
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
