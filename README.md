# Saran's Portfolio

A modern, responsive personal portfolio website showcasing my skills, projects, and experience as a Web Developer & AI/ML Engineer.

## 🚀 Live Demo

[View Portfolio](#) <!-- Add your hosted URL here -->

## ✨ Features

- **Interactive Hero Section** - Animated particle network background with cursor interaction
- **Auto-rotating Quotes** - Motivational quotes with word-by-word animation
- **Typewriter Effect** - Dynamic role display (Backend, Full Stack, Machine Learning)
- **Responsive Design** - Mobile-friendly with hamburger navigation menu
- **Scroll Spy Navigation** - Active nav link updates based on scroll position
- **Project Showcase** - Expandable project grid with hover effects
- **Contact Form** - EmailJS integration for direct messaging
- **Copy Protection** - Disabled right-click, text selection, and keyboard shortcuts

## 🛠️ Built With

- HTML5
- CSS3 (Custom animations, Flexbox, Grid)
- Vanilla JavaScript
- [EmailJS](https://www.emailjs.com/) - Contact form
- [Font Awesome](https://fontawesome.com/) - Icons
- [Devicon](https://devicon.dev/) - Technology icons
- [Google Fonts](https://fonts.google.com/) - Poppins font

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── assets/             # Images and media
    ├── photo.jpeg      # Profile photo
    ├── contact.avif    # Contact section image
    ├── college.jpg     # Education images
    ├── school.jpg
    └── project[1-6].*  # Project screenshots
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saranbalusamy/portfolio.git
   ```

2. **Open in browser**
   - Simply open `index.html` in your browser
   - Or use VS Code Live Server extension

3. **Customize**
   - Update personal info in `index.html`
   - Replace images in `assets/` folder
   - Update EmailJS credentials in `script.js`

## 📧 Contact Form Setup

The contact form uses EmailJS. To configure:

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Update these values in `script.js`:
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY");
   emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form);
   ```

## 📱 Responsive Breakpoints

- **Desktop**: > 980px
- **Tablet**: 768px - 980px
- **Mobile**: < 768px

## 👤 Author

**Saran Venkatesh B**

- GitHub: [@Saranbalusamy](https://github.com/Saranbalusamy)
- LinkedIn: [Saran Venkatesh](https://www.linkedin.com/in/saran-venkatesh-b-a664002bb/)
- Email: saranbalusamy10@gmail.com

## 📄 License

This project is open source and available for personal use.

---

⭐ If you like this portfolio, give it a star!
