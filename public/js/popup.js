function showAuthPopup() {
    document.getElementById("authPopup").classList.remove("hidden");
    showLoginForm(); // แสดงฟอร์มเข้าสู่ระบบเมื่อเปิด popup
}

// ฟังก์ชันปิด popup
function hideAuthPopup() {
    document.getElementById("authPopup").classList.add("hidden");
}

// ฟังก์ชันแสดงฟอร์มเข้าสู่ระบบ
function showLoginForm() {
    document.getElementById("formLogin").classList.remove("hidden");
    document.getElementById("formRegister").classList.add("hidden");
    document.getElementById("tapLogin").classList.add("border-b-2", "border-blue-400");
    document.getElementById("tapRegister").classList.remove("border-b-2", "border-blue-400");
}

// ฟังก์ชันแสดงฟอร์มสมัครสมาชิก
function showRegisterForm() {
    document.getElementById("formLogin").classList.add("hidden");
    document.getElementById("formRegister").classList.remove("hidden");
    document.getElementById("tapRegister").classList.add("border-b-2", "border-blue-400");
    document.getElementById("tapLogin").classList.remove("border-b-2", "border-blue-400");
    
    // เพิ่ม animation สำหรับการเลื่อน
    const tapRegister = document.getElementById("tapRegister");
    tapRegister.classList.add("animate-slideIn");

    // ลบ class หลังจาก animation เสร็จสิ้น
    setTimeout(() => {
        tapRegister.classList.remove("animate-slideIn");
    }, 300); // 300 ms เป็นระยะเวลาของแอนิเมชัน
}


// ปิดเมนูโปรไฟล์เมื่อคลิกนอกเมนู
window.addEventListener("click", function (event) {
    const profileMenu = document.getElementById("profileMenu");
    if (!event.target.matches('#profileButton') && !profileMenu.contains(event.target)) {
        profileMenu.classList.add("hidden");
    }
});

  // เปิด/ปิดเมนูโปรไฟล์เมื่อคลิกที่ไอคอนโปรไฟล์
  document.getElementById("profileButton").addEventListener("click", function () {
    const profileMenu = document.getElementById("profileMenu");
    profileMenu.classList.toggle("hidden");
});


const toggleMenuButton = document.getElementById('toggleMenu');
const sidebar = document.getElementById('sidebar');
const layoutContent = document.getElementById('layout-content');

toggleMenuButton.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
  layoutContent.classList.toggle('lg:ml-0');
});

// เพิ่ม event listeners ให้กับแท็บ
document.getElementById("tapLogin").addEventListener("click", showLoginForm);
document.getElementById("tapRegister").addEventListener("click", showRegisterForm);