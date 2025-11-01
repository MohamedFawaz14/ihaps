require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const { Resend } = require('resend');
const router = express.Router();

// Sequelize Models
const Login = require('../models/Login');
const Achievement = require("../models/AchievementModel");
const Project = require("../models/Project");
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');
const Insight = require('../models/Insight');
const Carousel = require('../models/Carousel');
const Gallery = require('../models/GalleryModel');

// Middleware
router.use(cors());
router.use(express.json());
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads";
    if (req.originalUrl.includes("/projects")) folder = path.join("uploads", "project");
    else if (req.originalUrl.includes("/insights")) folder = path.join("uploads", "insight");
    else if (req.originalUrl.includes("/carousel")) folder = path.join("uploads", "carousel");
    else if (req.originalUrl.includes("/gallery")) folder = path.join("uploads", "gallery");

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// ================== Contact Form ===================
router.post('/contactForm', async (req, res) => {
  const { formData } = req.body;
  try {
    const { email, name, phone, type } = formData;
    console.log(email, name, phone, type);

    const resend = new Resend(process.env.RESEND_API_KEY); 

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'mohamedfawaz.sb@gmail.com',
      subject: `New ${type} Request from ${name}`,
      html: `
        <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);">
    <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
      
      <!-- Header -->
      <div style="background: #1e40af; color: white; text-align: center; padding: 20px;">
        <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">New ${type.replace('-', ' ')} Request</h2>
      </div>

      <!-- Details Cards -->
      <div style="padding: 25px;">
        
        <!-- Name -->
        <div style="background: #f8fafc; border-left: 3px solid #1e40af; padding: 18px 20px; border-radius: 8px; margin-bottom: 15px;">
          <div style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Full Name</div>
          <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${name}</div>
        </div>
        
        <!-- Email -->
        <div style="background: #f8fafc; border-left: 3px solid #d4af37; padding: 18px 20px; border-radius: 8px; margin-bottom: 15px;">
          <div style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Email Address</div>
          <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
            <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a>
          </div>
        </div>
        
        <!-- Phone -->
        <div style="background: #f8fafc; border-left: 3px solid #1e40af; padding: 18px 20px; border-radius: 8px; margin-bottom: 15px;">
          <div style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Phone Number</div>
          <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
            <a href="tel:${phone}" style="color: #1e40af; text-decoration: none;">${phone}</a>
          </div>
        </div>

        <!-- Type -->
        <div style="background: #f8fafc; border-left: 3px solid #d4af37; padding: 18px 20px; border-radius: 8px; margin-bottom: 15px;">
          <div style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Request Type</div>
          <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${type}</div>
        </div>

      </div>
      
      <!-- Footer -->
      <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <div style="margin-bottom: 10px;">
          <span style="display: inline-block; width: 30px; height: 2px; background: #d4af37; margin: 0 5px;"></span>
          <span style="display: inline-block; width: 30px; height: 2px; background: #1e40af; margin: 0 5px;"></span>
          <span style="display: inline-block; width: 30px; height: 2px; background: #d4af37; margin: 0 5px;"></span>
        </div>
        <p style="margin: 0 0 5px; color: #64748b; font-size: 13px; font-weight: 500;">Ikhlas Housing and Properties</p>
        <p style="margin: 0; color: #94a3b8; font-size: 11px;">© 2025 All rights reserved</p>
      </div>

    </div>
  </body>
  </html>
  `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: 'Failed to send email', error: error.message });
    }

    console.log('Email sent:', data);
    return res.status(200).json({ message: 'Email sent successfully!' });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// ================== Register ==================
router.post('/sign_in', async (req, res) => {
  try {
    const { email, password } = req.body;
    const login = await Login.create({ email, password });
    res.status(200).json({ message: "Saved in Database", id: login.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to Save in Database" });
  }
});

// ================== Login ==================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Login.findOne({ where: { email, password } });
    if (user) res.status(200).json({ message: 'success' });
    else res.status(401).json({ message: 'Incorrect email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while checking data' });
  }
});

// ================== Forgot Password ==================
router.post('/forget_password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Login.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found..!' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.update({ otp, otpExpiresAt });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'arczondemo25@gmail.com', pass: 'vfobxmzxwepqvdtq' }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP Code is: ${otp}`
    });

    res.json({ message: otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// ================== Reset Password ==================
router.post('/reset_password', async (req, res) => {
  const { email, otp, resetpassword } = req.body;
  try {
    const user = await Login.findOne({
      where: {
        email,
        otp,
        otpExpiresAt: { [Op.gt]: new Date() }
      }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    await user.update({ password: resetpassword, otp: null, otpExpiresAt: null });
    res.json({ message: 'OTP verified successfully & password changed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

// ================== Projects ==================
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/projects", upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 10 }
]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.amenities === 'string') data.amenities = JSON.parse(data.amenities);
    if (typeof data.specifications === 'string') data.specifications = JSON.parse(data.specifications);

    if (req.files.mainImage) data.mainImage = `/uploads/project/${req.files.mainImage[0].filename}`;
    if (req.files.images) data.images = req.files.images.map(f => `/uploads/project/${f.filename}`);

    const project = await Project.create(data);
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Bad Request", error: err.message });
  }
});

router.put("/projects/:id", upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 10 }
]), async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const data = { ...req.body };
    if (typeof data.amenities === 'string') data.amenities = JSON.parse(data.amenities);
    if (typeof data.specifications === 'string') data.specifications = JSON.parse(data.specifications);

    // Handle new main image
    if (req.files.mainImage) data.mainImage = `/uploads/project/${req.files.mainImage[0].filename}`;

    // Handle new sub-images
    let newImages = [];
    if (req.files.images) newImages = req.files.images.map(f => `/uploads/project/${f.filename}`);

    // Merge existing images
    let existingImages = [];
    if (data.existingImages) existingImages = JSON.parse(data.existingImages);

    data.images = [...existingImages, ...newImages];

    // Delete removed images
    if (data.deletedImages) {
      const deleted = JSON.parse(data.deletedImages);
      deleted.forEach(imgPath => {
        const filePath = path.join(process.cwd(), imgPath.startsWith("/") ? imgPath.slice(1) : imgPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await project.update(data);
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});


router.delete("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    await project.destroy();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ================== Insights ==================
router.get("/insights", async (req, res) => {
  try {
    const insights = await Insight.findAll({ order: [['createdAt', 'DESC']] });
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/insights", upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt, category, author } = req.body;
    const image = req.file ? `/uploads/insight/${req.file.filename}` : null;
    const insight = await Insight.create({ title, excerpt, category, author, image });
    res.json(insight);
  } catch (err) {
    res.status(400).json({ message: "Bad Request", error: err.message });
  }
});

router.put("/insights/:id", upload.single("image"), async (req, res) => {
  try {
    const insight = await Insight.findByPk(req.params.id);
    if (!insight) return res.status(404).json({ message: "Insight not found" });

    const { title, excerpt, category, author, published } = req.body;
    const updateData = {
      title: title || insight.title,
      excerpt: excerpt || insight.excerpt,
      category: category || insight.category,
      author: author || insight.author,
      published: published !== undefined ? published : insight.published
    };
    if (req.file) updateData.image = `/uploads/insight/${req.file.filename}`;

    await insight.update(updateData);
    res.json(insight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/insights/:id", async (req, res) => {
  try {
    const insight = await Insight.findByPk(req.params.id);
    if (!insight) return res.status(404).json({ message: "Insight not found" });
    await insight.destroy();
    res.json({ message: "Insight deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ================== Achievements ==================
router.get('/achievements', async (req, res) => {
  const achievements = await Achievement.findAll();
  res.json(achievements);
});

router.post('/achievements', async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.json(achievement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save achievement' });
  }
});

router.put('/achievements/:id', async (req, res) => {
  const achievement = await Achievement.findByPk(req.params.id);
  if (!achievement) return res.status(404).json({ message: 'Not found' });
  await achievement.update(req.body);
  res.json(achievement);
});

router.delete('/achievements/:id', async (req, res) => {
  const achievement = await Achievement.findByPk(req.params.id);
  if (!achievement) return res.status(404).json({ message: 'Not found' });
  await achievement.destroy();
  res.json({ message: 'Deleted successfully' });
});

// ================== Testimonials ==================
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    await testimonial.update(req.body);
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    await testimonial.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== Services ==================
router.get('/services', async (req, res) => {
  try {
    const services = await Service.findAll({ order: [['createdAt', 'DESC']] });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Not found' });
    await service.update(req.body);
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Not found' });
    await service.destroy();
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== Carousel ==================
// GET all carousel images
router.get('/carousel', async (req, res) => {
  try {
    const images = await Carousel.findAll({ order: [['createdAt', 'DESC']] });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new carousel image
router.post('/carousel', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const { title, deviceType } = req.body;
    if (!deviceType || !['mobile', 'desktop'].includes(deviceType)) {
      return res.status(400).json({ message: "Valid deviceType is required: 'mobile' or 'desktop'" });
    }

    const newImage = await Carousel.create({
      title: title || '',
      image: `/uploads/carousel/${req.file.filename}`,
      deviceType
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error('Carousel upload error:', err);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// DELETE carousel image
router.delete('/carousel/:id', async (req, res) => {
  try {
    const img = await Carousel.findByPk(req.params.id);
    if (!img) return res.status(404).json({ message: 'Image not found' });

    const filePath = path.join(process.cwd(), img.image.startsWith('/') ? img.image.slice(1) : img.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await img.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== Gallery ==================
router.get("/gallery", async (req, res) => {
  try {
    const gallery = await Gallery.findAll({ order: [['createdAt', 'DESC']] });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/gallery", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });
    const item = await Gallery.create({
      title: req.body.title,
      category: req.body.category,
      image: `/uploads/gallery/${req.file.filename}`
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/gallery/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    if (req.file) {
      const oldPath = path.join(process.cwd(), item.image.startsWith("/") ? item.image.slice(1) : item.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      await item.update({
        title: req.body.title || item.title,
        category: req.body.category || item.category,
        image: `/uploads/gallery/${req.file.filename}`
      });
    } else {
      await item.update({
        title: req.body.title || item.title,
        category: req.body.category || item.category
      });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/gallery/:id", async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    const filePath = path.join(process.cwd(), item.image.startsWith("/") ? item.image.slice(1) : item.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await item.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
