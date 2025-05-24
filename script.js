function interpretColor(rgb) {
  const { r, g, b } = rgb;

  if (r > 80 && r < 130 && g < 60 && b < 60) {
    return "Sangat Layak Dikonsumsi";
  } else if (r > 130 && g > 80 && b < 60) {
    return "Masih Layak Dikonsumsi";
  } else if (r > 180 && g > 180 && b < 100) {
    return "Kurang Layak Dikonsumsi";
  }
  return "Tidak Dikenali";
}

function getPriceByQuality(quality) {
  switch(quality) {
    case "Sangat Layak Dikonsumsi": return "Rp 25.000";
    case "Masih Layak Dikonsumsi": return "Rp 10.000";
    case "Kurang Layak Dikonsumsi": return "Rp 7.000";
    default: return "Harga tidak tersedia";
  }
}

function updateDisplay(rgb) {
  const quality = interpretColor(rgb);
  const price = getPriceByQuality(quality);
  document.getElementById("quality").innerText = "Kualitas: " + quality;
  document.getElementById("price").innerText = "Harga: " + price;
  document.getElementById("colorSample").style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function extractRGBFromQR(text) {
  try {
    const rgb = JSON.parse(text);
    if (rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined) {
      updateDisplay(rgb);
    }
  } catch (e) {
    document.getElementById("quality").innerText = "Format QR tidak sesuai.";
  }
}

const html5QrCode = new Html5Qrcode("reader");
Html5Qrcode.getCameras().then(devices => {
  if (devices && devices.length) {
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        html5QrCode.stop();
        extractRGBFromQR(decodedText);
      }
    );
  }
}).catch(err => {
  document.getElementById("quality").innerText = "Error: " + err;
});

function generateQR() {
  const r = parseInt(document.getElementById("r").value);
  const g = parseInt(document.getElementById("g").value);
  const b = parseInt(document.getElementById("b").value);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    alert("Harap masukkan nilai RGB yang valid (0-255)");
    return;
  }

  const qr = new QRious({
    element: document.getElementById("qrCanvas"),
    size: 200,
    value: JSON.stringify({ r, g, b })
  });
}

document.getElementById("imageInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById("colorCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const centerX = Math.floor(img.width / 2);
      const centerY = Math.floor(img.height / 2);
      const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;

      const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
      updateDisplay(rgb);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
