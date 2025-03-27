# ShopSecure POS - คู่มือการติดตั้งบน Ubuntu + Caddy + PostgreSQL

คู่มือนี้อธิบายวิธีการติดตั้งและ deploy ระบบ ShopSecure POS บน Ubuntu Server โดยใช้ Caddy เป็น Web Server และ PostgreSQL เป็นฐานข้อมูล

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Node.js และ npm

```bash
# ติดตั้ง Node.js เวอร์ชันล่าสุด
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# ตรวจสอบเวอร์ชัน
node -v
npm -v
```

### 2. ติดตั้ง PostgreSQL

```bash
# ติดตั้ง PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# เริ่มการทำงานของ PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# เข้าสู่ PostgreSQL shell
sudo -u postgres psql

# สร้างฐานข้อมูลและผู้ใช้
CREATE DATABASE shopsecure;
CREATE USER shopsecureuser WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shopsecure TO shopsecureuser;
\q
```

### 3. ติดตั้ง Caddy Web Server

```bash
# ติดตั้ง Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### 4. Clone โปรเจคและติดตั้ง Dependencies

```bash
# Clone โปรเจค (หรือใช้วิธีอัพโหลดไฟล์ไปยังเซิร์ฟเวอร์)
git clone https://github.com/your-username/shopsecure-pos.git
cd shopsecure-pos

# ติดตั้ง dependencies
npm install
```

### 5. สร้างไฟล์ .env

```bash
# สร้างไฟล์ .env จาก .env.example
cp .env.example .env

# แก้ไขไฟล์ .env ตามความเหมาะสม
nano .env
```

### 6. สร้างฐานข้อมูลและตาราง

```bash
# นำเข้าไฟล์ SQL เพื่อสร้างตาราง
psql -U shopsecureuser -d shopsecure -f database.sql
```

### 7. Build โปรเจค

```bash
# Build โปรเจค
npm run build
```

### 8. ตั้งค่า Caddy

```bash
# แก้ไขไฟล์ Caddyfile
sudo nano /etc/caddy/Caddyfile
```

เพิ่มการตั้งค่าดังนี้:

```
your-domain.com {
    # Enable HTTPS automatically
    tls internal

    # Reverse proxy for API requests
    handle /api/* {
        reverse_proxy localhost:3000
    }

    # Serve static files for frontend
    handle {
        root * /path/to/shopsecure-pos/dist
        try_files {path} /index.html
        file_server
    }

    # Enable compression
    encode gzip

    # Enable logging
    log {
        output file /var/log/caddy/shopsecure.log
    }
}
```

### 9. ตั้งค่า PM2 เพื่อจัดการ Node.js Process

```bash
# ติดตั้ง PM2 globally
sudo npm install -g pm2

# เริ่มต้นแอปพลิเคชันด้วย PM2
pm2 start server.js --name "shopsecure-api"

# ตั้งค่าให้ PM2 เริ่มต้นอัตโนมัติเมื่อระบบบูต
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-username --hp /home/your-username
pm2 save
```

### 10. รีสตาร์ท Caddy

```bash
sudo systemctl restart caddy
```

## การอัปเดตระบบ

เมื่อต้องการอัปเดตระบบ ให้ทำตามขั้นตอนดังนี้:

```bash
# ดึงโค้ดล่าสุด (หรืออัปโหลดไฟล์ใหม่)
git pull

# ติดตั้ง dependencies ที่อาจมีการเปลี่ยนแปลง
npm install

# Build โปรเจคใหม่
npm run build

# รีสตาร์ท API server
pm2 restart shopsecure-api
```

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อฐานข้อมูล

ตรวจสอบการเชื่อมต่อฐานข้อมูล:

```bash
# ตรวจสอบสถานะ PostgreSQL
sudo systemctl status postgresql

# ตรวจสอบการเชื่อมต่อ
psql -U shopsecureuser -d shopsecure -c "SELECT 'Connection successful' AS result;"
```

### ปัญหา Caddy

ตรวจสอบ log ของ Caddy:

```bash
sudo journalctl -u caddy
cat /var/log/caddy/shopsecure.log
```

### ปัญหา Node.js API

ตรวจสอบ log ของ PM2:

```bash
pm2 logs shopsecure-api
```
