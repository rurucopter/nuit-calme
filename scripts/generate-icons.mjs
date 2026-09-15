import { createCanvas } from "canvas";
import { writeFileSync } from "fs";

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0a0e27";
  ctx.fillRect(0, 0, size, size);

  // Gradient glow
  const gradient = ctx.createRadialGradient(
    size * 0.5, size * 0.4, 0,
    size * 0.5, size * 0.4, size * 0.4
  );
  gradient.addColorStop(0, "rgba(245, 158, 11, 0.4)");
  gradient.addColorStop(0.5, "rgba(249, 115, 22, 0.15)");
  gradient.addColorStop(1, "rgba(10, 14, 39, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Moon circle
  const moonR = size * 0.22;
  const moonX = size * 0.5;
  const moonY = size * 0.38;
  const moonGrad = ctx.createRadialGradient(
    moonX - moonR * 0.3, moonY - moonR * 0.3, moonR * 0.1,
    moonX, moonY, moonR
  );
  moonGrad.addColorStop(0, "#fbbf24");
  moonGrad.addColorStop(0.6, "#f59e0b");
  moonGrad.addColorStop(1, "#ea580c");
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fillStyle = moonGrad;
  ctx.fill();

  // Text "NC"
  ctx.fillStyle = "#0a0e27";
  ctx.font = `bold ${size * 0.14}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NC", moonX, moonY + size * 0.01);

  // "Nuit Calme" text below
  ctx.fillStyle = "#f0f0f5";
  ctx.font = `600 ${size * 0.08}px sans-serif`;
  ctx.fillText("Nuit Calme", size * 0.5, size * 0.72);

  return canvas.toBuffer("image/png");
}

writeFileSync("public/icons/icon-192.png", generateIcon(192));
writeFileSync("public/icons/icon-512.png", generateIcon(512));
console.log("Icons generated successfully");
