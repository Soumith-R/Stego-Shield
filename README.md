# 🛡️ Stego Shield

A modern, secure web application for hiding secret messages within images using LSB (Least Significant Bit) steganography.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?logo=vite)

## ✨ Features

- **🔒 Encode Messages** - Hide secret text within images using LSB steganography
- **🔓 Decode Messages** - Extract hidden messages from encoded images
- **🔐 100% Private** - All processing happens client-side, nothing is uploaded
- **⚡ Lightning Fast** - Built with Vite for optimal performance
- **📱 Fully Responsive** - Works on desktop, tablet, and mobile devices
- **🎨 Modern UI** - Beautiful dark theme with gradient accents and animations

## 🚀 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Navigation
- **Framer Motion** - Animations
- **React Icons** - Icon Library

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Soumith-R/Stego-Shield.git

# Navigate to project directory
cd Stego-Shield

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Usage

### Encoding a Message
1. Navigate to the **Encode** page
2. Upload an image (PNG, JPG, or BMP)
3. Enter your secret message
4. Click "Encode & Download"
5. Save the encoded image

### Decoding a Message
1. Navigate to the **Decode** page
2. Upload the encoded image
3. Click "Decode Message"
4. View the hidden message

## 🛠️ How It Works

Stego Shield uses **LSB (Least Significant Bit) Steganography**:

1. Each pixel in an image has RGB color values (0-255)
2. The last bit of each color value is modified to store message data
3. These changes are imperceptible to the human eye
4. A NUL terminator marks the end of the hidden message

## 👥 Team

**Project Guide:** D. Padmaja Usha Rani, Assistant Professor, KMEC

**Developers:**
- Soumith Reddy Chiluka - CSE (AI & ML)
- Rishi Pothireddy - CSE (AI & ML)
- R. Nandita Reddy - CSE (AI & ML)

## 🎓 About

This is a major project by CSE (AI & ML) students from **Keshav Memorial Engineering College**, Batch of 2026.

## 📄 License

This project is for educational purposes.

---

Made with ❤️ by KMEC Students
