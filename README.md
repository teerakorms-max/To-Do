# แอปรายการงาน (Todo App)

React + Vite + Tailwind CSS + lucide-react — UI ภาษาไทย, รองรับมือถือและโหมดมืด
ข้อมูลอยู่ใน React state เท่านั้น (ไม่ใช้ localStorage) รีเฟรชแล้วข้อมูลจะรีเซ็ต

## เริ่มใช้งาน

    npm install
    npm run dev       # เปิด http://localhost:5173
    npm run build     # สร้างไฟล์ production ใน dist/
    npm run preview   # ดูผล build

## โครงสร้าง

    src/
      App.jsx               # state, ฟอร์มเพิ่มงาน, แท็บกรอง, ตัวนับ
      components/TodoItem.jsx  # แถวงาน: ติ๊ก, แก้ไขแบบ inline, ลบ, ป้ายความสำคัญ
      constants.js          # ป้ายชื่อความสำคัญและตัวกรอง
      index.css             # Tailwind + ธีมสีสว่าง/มืด
