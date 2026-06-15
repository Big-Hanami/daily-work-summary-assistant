# Daily Work Summary Assistant

แอปช่วยสร้างข้อความสรุปงานประจำวันแบบเรียงลำดับอัตโนมัติ

## วิธีรัน

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Package

```bash
npm run electron:pack
npm run android:apk
```

ไฟล์ที่แพ็กแล้วอยู่ในโฟลเดอร์ `release`

- `Daily Work Summary Assistant 1.0.0.exe`
- `Daily Work Summary Assistant 1.0.0.apk`

## Deploy to GitHub Pages

โปรเจคนี้มี GitHub Actions workflow สำหรับ deploy ไป GitHub Pages แล้ว

1. สร้าง repository บน GitHub แบบ Public
2. Push โปรเจคนี้ขึ้น branch `main`
3. ไปที่ repository Settings > Pages
4. ตั้ง Source เป็น GitHub Actions
5. รอ workflow `Deploy to GitHub Pages` ทำงานจบ

เว็บจะอยู่ที่ `https://<username>.github.io/<repository-name>/`

## ฟีเจอร์

- เลือกวันที่
- แสดงหัวข้อ `สรุปการทำงาน DD/MM/YYYY`
- เพิ่มงานเป็นเลขลำดับอัตโนมัติ
- วางข้อความหลายบรรทัดเพื่อเพิ่มหลายรายการพร้อมกัน
- จำวันที่และรายการงานไว้ในเครื่องด้วย localStorage
- กด Enter เพื่อส่งข้อมูล
- Shift + Enter เพื่อขึ้นบรรทัดใหม่ในช่องกรอก
- Copy ข้อความทั้งหมด
- Clear ล้างรายการ
- Font ในช่องแสดงผลปรับขนาดตามความยาวข้อความ
