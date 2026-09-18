import fs from "fs";
import path from "path";
import https from "https";

const dir = path.join(process.cwd(), "public", "assets", "images", "bariloche");
fs.mkdirSync(dir, { recursive: true });

const images = [
  {
    file: "ruta-aeropuerto.webp",
    url: "https://anbariloche-s3.cdn.net.ar/s3i233/2026/09/anbariloche/images/02/77/23/2772370_d41e45199a64b02e99b8baa9bbfe8c986c3a9f333ccaf8b1adc2797258402ca8/md.webp",
  },
  {
    file: "cerro-catedral.webp",
    url: "https://anbariloche-s3.cdn.net.ar/s3i233/2026/09/anbariloche/images/02/77/16/2771632_bcedfa92a83f6a8091c432c392c30ff2f2ec3bd0b91771fdfc8b9f573caf50bb/md.webp",
  },
  {
    file: "musica-patagonica.webp",
    url: "https://anbariloche-s3.cdn.net.ar/s3i233/2025/09/anbariloche/images/02/29/51/2295188_acb82b66c640e2df57261173ba1f3b3e2d95666e2649fcfc6e3af75e09f5adb9/md.webp",
  },
  {
    file: "escuela-amuyen.webp",
    url: "https://anbariloche-s3.cdn.net.ar/s3i233/2026/09/anbariloche/images/02/77/24/2772485_eb59843f74956e5bdcfc0ad0fc8691067a830b9099d2e43368b1f70412ca5cd6/md.webp",
  },
  {
    file: "ruta-aerea.webp",
    url: "https://anbariloche-s3.cdn.net.ar/s3i233/2026/09/anbariloche/images/02/77/22/2772260_f91890138ce5ff399b92be0238a716e23c6e64ee63b13dc34d7b3199a1c2ce57/md.webp",
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed with status ${res.statusCode}`));
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      }
    ).on("error", reject);
  });
}

async function run() {
  for (const img of images) {
    const dest = path.join(dir, img.file);
    console.log(`Downloading ${img.file}...`);
    try {
      await downloadFile(img.url, dest);
      console.log(`Saved ${img.file}`);
    } catch (e) {
      console.error(`Failed ${img.file}: ${e.message}`);
    }
  }

  // Mirror to public/images/bariloche
  const publicMirror = path.join(process.cwd(), "public", "images", "bariloche");
  fs.mkdirSync(publicMirror, { recursive: true });
  fs.cpSync(dir, publicMirror, { recursive: true });
  console.log("Mirrored to public/images/bariloche!");
}

run();
