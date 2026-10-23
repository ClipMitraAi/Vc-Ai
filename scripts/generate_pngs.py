import zlib
import struct
import math
import os

def create_hud_png(width, height, output_path):
    # Generates a PNG with dark navy background, circular cyan reactor and glowing core
    raw_rows = []
    cx = width / 2.0
    cy = height / 2.0
    max_r = width / 2.0

    for y in range(height):
        row = bytearray([0]) # filter type 0 (None)
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx * dx + dy * dy)
            
            # Base dark obsidian background
            r, g, b, a = 4, 10, 22, 255
            
            # Outer circular ring at 75%
            ring1 = abs(dist - (width * 0.38))
            if ring1 < 3:
                r, g, b = 0, 240, 255
            elif ring1 < 8:
                glow = (8 - ring1) / 8.0
                r = int(r * (1 - glow) + 0 * glow)
                g = int(g * (1 - glow) + 200 * glow)
                b = int(b * (1 - glow) + 255 * glow)
                
            # Inner circle at 25%
            ring2 = abs(dist - (width * 0.22))
            if ring2 < 3:
                r, g, b = 56, 189, 248
            elif ring2 < 7:
                glow = (7 - ring2) / 7.0
                r = int(r * (1 - glow) + 0 * glow)
                g = int(g * (1 - glow) + 240 * glow)
                b = int(b * (1 - glow) + 255 * glow)

            # Central glowing core
            if dist < (width * 0.12):
                glow = (1 - (dist / (width * 0.12)))
                r = int(255 * glow)
                g = int(235 * glow + 10)
                b = 255

            r = max(0, min(255, int(r)))
            g = max(0, min(255, int(g)))
            b = max(0, min(255, int(b)))
            row.extend([r, g, b, a])
        raw_rows.append(bytes(row))

    raw_data = b"".join(raw_rows)
    compressed_data = zlib.compress(raw_data)

    def chunk(chunk_type, data):
        return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xffffffff)

    png_header = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(png_header)
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", compressed_data))
        f.write(chunk(b"IEND", b""))

print("Generating PNG icons...")
create_hud_png(192, 192, "public/pwa-192x192.png")
create_hud_png(512, 512, "public/pwa-512x512.png")
create_hud_png(512, 512, "public/pwa-maskable-512x512.png")
create_hud_png(180, 180, "public/apple-touch-icon.png")
print("PNG icons created successfully.")
