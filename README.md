# ShopSecure POS - ระบบจัดการร้านค้าและสินค้า

ระบบ ShopSecure POS เป็นแอปพลิเคชันสำหรับจัดการร้านค้า สินค้า การขาย และการซื้อสินค้า โดยรองรับการทำงานบน Ubuntu Server + Caddy Webserver + PostgreSQL

## คุณสมบัติหลัก

- **จัดการสินค้า**: เพิ่ม แก้ไข ลบ และค้นหาสินค้า
- **จัดการหมวดหมู่**: จัดระเบียบสินค้าด้วยระบบหมวดหมู่
- **บันทึกการขาย**: สร้างและจัดการบิลขาย พร้อมพิมพ์ใบเสร็จ
- **บันทึกการซื้อ**: จัดการการสั่งซื้อสินค้าและสต็อก
- **ระบบรับประกัน**: ติดตามการรับประกันสินค้า
- **รายงาน**: ดูรายงานยอดขาย กำไร และสินค้าคงเหลือ
- **ระบบผู้ใช้**: จัดการผู้ใช้และสิทธิ์การเข้าถึง
- **ความปลอดภัย**: ระบบป้องกัน CAPTCHA ด้วย Cloudflare Turnstile

## โครงสร้างโปรเจค

```
shopsecure-pos/
├── src/                    # โค้ดต้นฉบับ
│   ├── api/                # API สำหรับเชื่อมต่อกับฐานข้อมูล
│   │   ├── routes/         # เส้นทาง API แยกตามหมวดหมู่
│   │   │   ├── auth.js     # API สำหรับการยืนยันตัวตน
│   │   │   ├── categories.js # API สำหรับหมวดหมู่
│   │   │   ├── customers.js # API สำหรับลูกค้า
│   │   │   ├── products.js # API สำหรับสินค้า
│   │   │   ├── purchases.js # API สำหรับการซื้อ
│   │   │   ├── reports.js  # API สำหรับรายงาน
│   │   │   ├── sales.js    # API สำหรับการขาย
│   │   │   ├── suppliers.js # API สำหรับผู้จัดจำหน่าย
│   │   │   └── warranties.js # API สำหรับการรับประกัน
│   │   └── index.js        # ไฟล์หลักของ API
│   ├── components/         # React Components
│   ├── config/             # ไฟล์การตั้งค่าต่างๆ
│   ├── hooks/              # React Hooks
│   ├── lib/                # ไลบรารีและ utilities
│   ├── models/             # โมเดลข้อมูล
│   ├── pages/              # หน้าต่างๆ ของแอปพลิเคชัน
│   ├── services/           # บริการต่างๆ
│   ├── types/              # TypeScript type definitions
│   └── utils/              # ฟังก์ชันช่วยเหลือ
├── public/                 # ไฟล์สาธารณะ
├── server.js               # เซิร์ฟเวอร์ Express
├── database.sql            # SQL สำหรับสร้างฐานข้อมูล
├── Caddyfile               # ไฟล์ตั้งค่า Caddy Webserver
├── .env.example            # ตัวอย่างไฟล์ตั้งค่าสภาพแวดล้อม
└── package.json            # ข้อมูลโปรเจคและ dependencies
```

## เทคโนโลยีที่ใช้

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **ฐานข้อมูล**: PostgreSQL
- **Web Server**: Caddy
- **Authentication**: JWT (JSON Web Tokens)
- **ความปลอดภัย**: Cloudflare Turnstile (CAPTCHA), bcrypt (การเข้ารหัสรหัสผ่าน)

## การติดตั้งและการใช้งาน

### ความต้องการของระบบ

- Node.js 18.x หรือใหม่กว่า
- PostgreSQL 14.x หรือใหม่กว่า
- Ubuntu Server 22.04 หรือใหม่กว่า (สำหรับการติดตั้งบนเซิร์ฟเวอร์)
- Caddy Webserver 2.x (สำหรับการติดตั้งบนเซิร์ฟเวอร์)

### การติดตั้งสำหรับการพัฒนา (Local Development)

1. **โคลนโปรเจค**:
   ```bash
   git clone https://github.com/your-username/shopsecure-pos.git
   cd shopsecure-pos
   ```

2. **ติดตั้ง Dependencies**:
   ```bash
   npm install
   ```

3. **ตั้งค่าไฟล์ .env**:
   ```bash
   cp .env.example .env
   ```
   
   แก้ไขไฟล์ .env ให้ตรงกับการตั้งค่าของคุณ:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # PostgreSQL Configuration
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=shopsecure
   
   # JWT Secret for Authentication
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   # Cloudflare Turnstile Configuration
   TURNSTILE_SITE_KEY=your_turnstile_site_key
   TURNSTILE_SECRET_KEY=your_turnstile_secret_key
   ```

4. **ตั้งค่าฐานข้อมูล PostgreSQL**:
   - ติดตั้ง PostgreSQL บนเครื่องของคุณ
   - สร้างฐานข้อมูลใหม่:
     ```sql
     CREATE DATABASE shopsecure;
     ```
   - นำเข้าโครงสร้างฐานข้อมูล:
     ```bash
     psql -U your_postgres_user -d shopsecure -f database.sql
     ```

5. **รันแอปพลิเคชันในโหมดพัฒนา**:
   ```bash
   npm run dev
   ```
   
   หรือรันเฉพาะเซิร์ฟเวอร์:
   ```bash
   node server.js
   ```

6. **เข้าถึงแอปพลิเคชัน**:
   - เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`

### การติดตั้งสำหรับการใช้งานจริง (Production)

1. **เตรียม Ubuntu Server**:
   ```bash
   # อัปเดตแพ็คเกจ
   sudo apt update
   sudo apt upgrade -y
   ```

2. **ติดตั้ง Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **ติดตั้ง PostgreSQL**:
   ```bash
   sudo apt-get install -y postgresql postgresql-contrib
   ```

4. **ตั้งค่าฐานข้อมูล**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE shopsecure;
   CREATE USER shopsecureuser WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE shopsecure TO shopsecureuser;
   \q
   ```

5. **ติดตั้ง Caddy**:
   ```bash
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy
   ```

6. **ดาวน์โหลดและติดตั้งแอปพลิเคชัน**:
   ```bash
   git clone https://github.com/your-username/shopsecure-pos.git
   cd shopsecure-pos
   npm install
   ```

7. **ตั้งค่าไฟล์ .env**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   ตัวอย่างไฟล์ .env สำหรับ Production:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=production
   
   # PostgreSQL Configuration
   POSTGRES_USER=shopsecureuser
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=shopsecure
   
   # JWT Secret for Authentication
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   # Cloudflare Turnstile Configuration
   TURNSTILE_SITE_KEY=your_turnstile_site_key
   TURNSTILE_SECRET_KEY=your_turnstile_secret_key
   ```

8. **สร้างฐานข้อมูล**:
   ```bash
   psql -U shopsecureuser -d shopsecure -f database.sql
   ```

9. **Build แอปพลิเคชัน**:
   ```bash
   npm run build
   ```

10. **ตั้งค่า Caddy**:
    ```bash
    sudo cp Caddyfile /etc/caddy/Caddyfile
    sudo systemctl restart caddy
    ```

11. **เริ่มต้นแอปพลิเคชันด้วย PM2** (แนะนำสำหรับ Production):
    ```bash
    # ติดตั้ง PM2
    npm install -g pm2
    
    # เริ่มต้นแอปพลิเคชัน
    pm2 start server.js --name "shopsecure-pos"
    
    # ตั้งค่าให้เริ่มต้นอัตโนมัติเมื่อรีบูตเซิร์ฟเวอร์
    pm2 startup
    pm2 save
    ```

12. **ตรวจสอบสถานะแอปพลิเคชัน**:
    ```bash
    pm2 status
    pm2 logs
    ```

### การอัปเดต Dependencies

หากคุณต้องการอัปเดตหรือติดตั้ง dependencies เพิ่มเติม สามารถทำได้ดังนี้:

1. **ติดตั้ง Dependencies หลัก**:
   ```bash
   npm install express cors pg dotenv bcryptjs jsonwebtoken uuid node-fetch
   ```

2. **ติดตั้ง Dependencies สำหรับการพัฒนา**:
   ```bash
   npm install --save-dev nodemon typescript @types/node @types/express
   ```

3. **อัปเดต package.json**:
   หากคุณติดตั้ง dependencies ใหม่และต้องการอัปเดตไฟล์ package.json ให้ใช้คำสั่ง:
   ```bash
   npm install <package-name> --save
   ```
   คำสั่งนี้จะติดตั้งแพ็คเกจและอัปเดตไฟล์ package.json โดยอัตโนมัติ

### การแก้ไขปัญหาที่พบบ่อย

1. **ปัญหาการเชื่อมต่อฐานข้อมูล**:
   - ตรวจสอบว่า PostgreSQL กำลังทำงานอยู่:
     ```bash
     sudo systemctl status postgresql
     ```
   - ตรวจสอบการตั้งค่าในไฟล์ .env ว่าถูกต้อง
   - ตรวจสอบว่าผู้ใช้ฐานข้อมูลมีสิทธิ์เข้าถึงฐานข้อมูลที่ระบุ

2. **ปัญหา ES Modules**:
   - ตรวจสอบว่าใช้ Node.js เวอร์ชัน 18 หรือใหม่กว่า
   - ตรวจสอบว่าไฟล์ package.json มีการตั้งค่า "type": "module"
   - ตรวจสอบว่าการนำเข้าโมดูล CommonJS ใช้รูปแบบที่ถูกต้อง:
     ```javascript
     import pkg from 'pg';
     const { Pool } = pkg;
     ```

3. **ปัญหา Cloudflare Turnstile**:
   - ตรวจสอบว่าได้ตั้งค่า TURNSTILE_SITE_KEY และ TURNSTILE_SECRET_KEY ในไฟล์ .env
   - ตรวจสอบว่าโดเมนของคุณได้รับอนุญาตในการตั้งค่า Turnstile บน Cloudflare Dashboard

## การใช้งานระบบ

### การเข้าสู่ระบบ

1. เปิดเบราว์เซอร์และไปที่ URL ของเซิร์ฟเวอร์
2. ใช้ข้อมูลเข้าสู่ระบบเริ่มต้น:
   - ชื่อผู้ใช้: `adminpot`
   - รหัสผ่าน: `147258369`

### การจัดการสินค้า

1. คลิกที่เมนู "สินค้า"
2. สามารถเพิ่ม แก้ไข หรือลบสินค้าได้
3. กำหนดราคาขาย ราคาทุน และจำนวนสินค้าคงเหลือ

### การบันทึกการขาย

1. คลิกที่เมนู "ขายสินค้า"
2. เลือกสินค้าที่ต้องการขาย
3. กรอกข้อมูลลูกค้า
4. บันทึกการขาย
5. พิมพ์ใบเสร็จ

### การตรวจสอบการรับประกัน

1. คลิกที่เมนู "ตรวจสอบการรับประกัน"
2. กรอกรหัสสินค้าหรือข้อมูลการรับประกัน
3. ระบบจะแสดงข้อมูลการรับประกันของสินค้า

## API Endpoints

ระบบมี API Endpoints ดังนี้:

### Authentication API
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/verify-token` - ตรวจสอบความถูกต้องของ token
- `POST /api/auth/forgot-password` - ขอรีเซ็ตรหัสผ่าน
- `POST /api/auth/reset-password` - รีเซ็ตรหัสผ่าน

### Categories API
- `GET /api/categories` - ดึงข้อมูลหมวดหมู่ทั้งหมด
- `GET /api/categories/:id` - ดึงข้อมูลหมวดหมู่ตาม ID
- `POST /api/categories` - สร้างหมวดหมู่ใหม่
- `PUT /api/categories/:id` - อัปเดตข้อมูลหมวดหมู่
- `DELETE /api/categories/:id` - ลบหมวดหมู่

### Customers API
- `GET /api/customers` - ดึงข้อมูลลูกค้าทั้งหมด
- `GET /api/customers/:id` - ดึงข้อมูลลูกค้าตาม ID
- `GET /api/customers/:id/purchases` - ดึงประวัติการซื้อของลูกค้า
- `POST /api/customers` - สร้างข้อมูลลูกค้าใหม่
- `PUT /api/customers/:id` - อัปเดตข้อมูลลูกค้า
- `DELETE /api/customers/:id` - ลบข้อมูลลูกค้า

### Products API
- `GET /api/products` - ดึงข้อมูลสินค้าทั้งหมด
- `GET /api/products/:id` - ดึงข้อมูลสินค้าตาม ID
- `POST /api/products` - สร้างสินค้าใหม่
- `PUT /api/products/:id` - อัปเดตข้อมูลสินค้า
- `DELETE /api/products/:id` - ลบสินค้า

### Purchases API
- `GET /api/purchases` - ดึงข้อมูลการซื้อทั้งหมด
- `GET /api/purchases/:id` - ดึงข้อมูลการซื้อตาม ID
- `POST /api/purchases` - สร้างการซื้อใหม่
- `PUT /api/purchases/:id` - อัปเดตข้อมูลการซื้อ
- `DELETE /api/purchases/:id` - ลบข้อมูลการซื้อ

### Reports API
- `GET /api/reports/sales/summary` - รายงานสรุปยอดขาย
- `GET /api/reports/sales/daily` - รายงานยอดขายรายวัน
- `GET /api/reports/sales/monthly` - รายงานยอดขายรายเดือน
- `GET /api/reports/inventory/value` - รายงานมูลค่าสินค้าคงเหลือ
- `GET /api/reports/inventory/low-stock` - รายงานสินค้าใกล้หมด
- `GET /api/reports/products/top-selling` - รายงานสินค้าขายดี

### Sales API
- `GET /api/sales` - ดึงข้อมูลการขายทั้งหมด
- `GET /api/sales/:id` - ดึงข้อมูลการขายตาม ID
- `POST /api/sales` - สร้างการขายใหม่
- `PUT /api/sales/:id` - อัปเดตข้อมูลการขาย
- `DELETE /api/sales/:id` - ลบข้อมูลการขาย

### Suppliers API
- `GET /api/suppliers` - ดึงข้อมูลผู้จัดจำหน่ายทั้งหมด
- `GET /api/suppliers/:id` - ดึงข้อมูลผู้จัดจำหน่ายตาม ID
- `GET /api/suppliers/:id/purchases` - ดึงประวัติการซื้อจากผู้จัดจำหน่าย
- `POST /api/suppliers` - สร้างข้อมูลผู้จัดจำหน่ายใหม่
- `PUT /api/suppliers/:id` - อัปเดตข้อมูลผู้จัดจำหน่าย
- `DELETE /api/suppliers/:id` - ลบข้อมูลผู้จัดจำหน่าย

### Warranties API
- `GET /api/warranties` - ดึงข้อมูลการรับประกันทั้งหมด
- `GET /api/warranties/:id` - ดึงข้อมูลการรับประกันตาม ID
- `GET /api/warranties/verify/:code` - ตรวจสอบการรับประกันตามรหัส
- `POST /api/warranties` - สร้างการรับประกันใหม่
- `PUT /api/warranties/:id` - อัปเดตข้อมูลการรับประกัน
- `DELETE /api/warranties/:id` - ลบข้อมูลการรับประกัน

## การใช้งาน Cloudflare Turnstile

ระบบใช้ Cloudflare Turnstile เพื่อป้องกันการโจมตีแบบอัตโนมัติ โดยมีการใช้งานในส่วนต่างๆ ดังนี้:

1. **การเข้าสู่ระบบ**: ป้องกันการพยายามเข้าสู่ระบบแบบ brute force
2. **การลงทะเบียน**: ป้องกันการสร้างบัญชีผู้ใช้จำนวนมากโดยอัตโนมัติ
3. **การรีเซ็ตรหัสผ่าน**: ป้องกันการโจมตีระบบรีเซ็ตรหัสผ่าน
4. **การตรวจสอบการรับประกัน**: ป้องกันการตรวจสอบข้อมูลการรับประกันจำนวนมากโดยอัตโนมัติ

### การตั้งค่า Cloudflare Turnstile

1. สมัครใช้งาน Cloudflare และเข้าสู่ [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. ไปที่ "Turnstile" และสร้าง site key ใหม่
3. นำ site key และ secret key ที่ได้ไปกรอกในไฟล์ .env:
   ```
   TURNSTILE_SITE_KEY=your_turnstile_site_key
   TURNSTILE_SECRET_KEY=your_turnstile_secret_key
   ```

## การแก้ไขปัญหาเบื้องต้น

### ปัญหาการเชื่อมต่อฐานข้อมูล

- ตรวจสอบว่า PostgreSQL กำลังทำงานอยู่
- ตรวจสอบข้อมูลการเชื่อมต่อในไฟล์ .env
- ตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล

### ปัญหา Caddy Webserver

- ตรวจสอบไฟล์ Caddyfile
- ตรวจสอบ log ของ Caddy: `sudo journalctl -u caddy`

### ปัญหา API

- ตรวจสอบว่า API กำลังทำงานอยู่: `curl http://localhost:3000/api`
- ตรวจสอบ log ของ API: `pm2 logs` หรือ `node server.js`

## การอัปเดตระบบ

```bash
# ดึงโค้ดล่าสุด
git pull

# ติดตั้ง dependencies ที่อาจมีการเปลี่ยนแปลง
npm install

# Build โปรเจคใหม่
npm run build

# รีสตาร์ท API server
pm2 restart server.js
```

## ผู้พัฒนา

- ทีมพัฒนา ShopSecure POS
