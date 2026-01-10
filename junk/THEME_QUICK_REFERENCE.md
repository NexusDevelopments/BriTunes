# BriTunes - Spotify Theme Quick Reference

## 🎨 Color Palette

```css
/* Copy-paste ready CSS variables */
:root {
  /* Backgrounds */
  --bg-black: #000000;
  --bg-base: #121212;
  --bg-elevated-base: #181818;
  --bg-elevated-highlight: #282828;
  --bg-elevated-press: #3e3e3e;
  
  /* Accent Colors */
  --blue: #3b82f6;
  --blue-light: #60a5fa;
  --blue-dark: #2563eb;
  
  /* Text */
  --text-base: #ffffff;
  --text-subdued: #b3b3b3;
  --text-muted: #a7a7a7;
  
  /* Borders */
  --border-base: #282828;
  --border-subtle: #121212;
}
```

## 🔧 Common Patterns

### Card Component
```css
.spotify-card {
  background: #181818;
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.spotify-card:hover {
  background: #282828;
}
```

### Button (Primary)
```css
.btn-primary {
  background: #3b82f6;
  color: #000000;
  border: none;
  border-radius: 500px;
  padding: 12px 32px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #60a5fa;
  transform: scale(1.04);
}
```

### Play Button (Circular)
```css
.play-button {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(8px);
}

.card:hover .play-button {
  opacity: 1;
  transform: translateY(0);
}

.play-button:hover {
  background: #60a5fa;
  transform: scale(1.05);
}
```

### Progress Bar
```css
.progress-bar {
  height: 4px;
  background: #4d4d4d;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: #ffffff;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-bar:hover .progress-bar-fill {
  background: #3b82f6;
}
```

## 📐 Spacing System

```css
/* Use consistent spacing values */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

## 🔤 Typography

```css
/* Font Weights */
--font-normal: 400;
--font-bold: 700;

/* Font Sizes */
--text-xs: 11px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 16px;
--text-xl: 24px;
--text-2xl: 32px;
--text-3xl: 48px;
```

## 🎭 Shadow Effects

```css
/* Card Shadow */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);

/* Elevated Shadow */
box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);

/* Dropdown Shadow */
box-shadow: 0 16px 24px rgba(0, 0, 0, 0.3), 0 6px 8px rgba(0, 0, 0, 0.2);
```

## ⚡ Transitions

```css
/* Fast transitions for UI feedback */
transition: all 0.1s ease;

/* Medium transitions for hover effects */
transition: all 0.2s ease;

/* Slow transitions for animations */
transition: all 0.3s ease;
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Desktop styles */
}
```

## 🎯 Best Practices

1. **Always use the defined color variables** - Don't create new shades
2. **Stick to 8px spacing grid** - Use multiples of 8 (8, 16, 24, 32, etc.)
3. **Font weights: 400 or 700 only** - No in-between weights
4. **Border radius: 4px, 8px, or 500px** - Consistent rounded corners
5. **Hover states must be obvious** - Use color change + transform
6. **Shadows for elevation** - Cards should feel layered
7. **Transitions should be quick** - 0.1s-0.3s maximum
8. **Blue is the only accent** - Don't introduce new colors

## 🚀 Quick Wins

### Make any element feel like Spotify:

1. Dark background (#181818 or #121212)
2. Add hover effect (lighten bg to #282828)
3. Round corners (8px)
4. Add shadow on hover
5. Use blue (#3b82f6) for interactive elements
6. White text (#ffffff) or gray (#b3b3b3)
7. Bold headings (font-weight: 700)

---

**Need help?** Check the full documentation in `SPOTIFY_THEME_UPDATE.md`
