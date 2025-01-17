const menuToggle = document.querySelectorAll('.menu-toggle');
const sidebar = document.getElementById('sidebar');
let isSidebarOpen = false; 

// ✅ วนลูปเพิ่ม event ให้ทุกปุ่ม
menuToggle?.forEach(button => {
    button.addEventListener("click", () => {
        if (isSidebarOpen) {
            sidebar.style.width = '0';
            isSidebarOpen = false;
        } else {
            sidebar.style.width = '250px';
            isSidebarOpen = true;
        }
    });
});

// ฟังก์ชันตรวจสอบขนาดหน้าจอ
const handleResize = () => {
    if (window.innerWidth <= 768) { // หากขนาดหน้าจอน้อยกว่าหรือเท่ากับ 768px
        sidebar.style.width = '0'; // ซ่อน Sidebar
        isSidebarOpen = false; // อัปเดตสถานะให้ Sidebar ปิด
    }
};

const handleResizeMin = () => {
    if (window.innerWidth >= 768) { // หากขนาดหน้าจอน้อยกว่าหรือเท่ากับ 768px
        sidebar.style.width = '250'; // ซ่อน Sidebar
        isSidebarOpen = false; // อัปเดตสถานะให้ Sidebar ปิด
    }
};

// เรียกใช้งาน handleResize เมื่อหน้าจอเปลี่ยนขนาด
window.addEventListener('resize', handleResize);
window.addEventListener('resize', handleResizeMin);

// เรียกใช้งานครั้งแรกเมื่อโหลดหน้าเว็บ
handleResize();
handleResizeMin();

// const userAvatar = document.querySelector('.profiel-header');
// const userMenu = document.querySelector('.profileCard-header');

// userAvatar?.addEventListener('mouseenter', () => {
//     userMenu.classList.remove('hidden');  // แสดงเมนูเมื่อ hover
// });

// userAvatar?.addEventListener('mouseleave', () => {
//     userMenu.classList.add('hidden');  // ซ่อนเมนูเมื่อไม่ hover
// });

const openPopups  = document.querySelectorAll(".openPopup");
const closePopup = document.getElementById("closePopup");
const popup = document.getElementById("popup");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const tabIndicator = document.getElementById("tabIndicator");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const registersuccess = document.getElementById("registersuccess");

// ✅ วนลูปเพิ่ม event ให้ทุกปุ่ม
openPopups?.forEach(button => {
    button.addEventListener("click", () => {
        popup.classList.remove("hidden");
    });
});

// ✅ ปิด Popup
closePopup?.addEventListener("click", () => {
    popup.classList.add("hidden");
});

// ปิด Popup เมื่อกดพื้นที่ด้านนอก
// popup?.addEventListener("click", (e) => {
//     if (e.target === popup) {
//         popup.classList.add("hidden");
//     }
// });

// เปลี่ยนแท็บ Login/Register
function switchTab(tab) {
    activeTab = tab; // บันทึกแท็บที่เลือก

    if (tab === "login") {
        loginTab.classList.add("text-blue-500");
        registerTab.classList.remove("text-blue-500");

        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

        tabIndicator.style.transform = "translateX(0%)"; // เลื่อน Indicator ไป Login
    } else {
        registerTab.classList.add("text-blue-500");
        loginTab.classList.remove("text-blue-500");

        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");

        tabIndicator.style.transform = "translateX(100%)"; // เลื่อน Indicator ไป Register
    }
}
// ตั้งค่าเริ่มต้นให้ Login Tab Active
switchTab("login");

// ฟังก์ชันสำหรับ Hover Effect
function hoverTab(tab) {
    tabIndicator.style.transform = tab === "login" ? "translateX(0%)" : "translateX(100%)";
}


loginTab?.addEventListener("click", () => switchTab("login"));
registerTab?.addEventListener("click", () => switchTab("register"));

// ✅ Hover Effect
loginTab?.addEventListener("mouseenter", () => hoverTab("login"));
registerTab?.addEventListener("mouseenter", () => hoverTab("register"));

// ✅ คืนค่า Indicator กลับแท็บที่เลือกเมื่อนำเมาส์ออก
loginTab?.addEventListener("mouseleave", () => hoverTab(activeTab));
registerTab?.addEventListener("mouseleave", () => hoverTab(activeTab));

// ฟังก์ชันส่งข้อมูลไปยัง API
async function sendData(url, formData) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        return { success: false, data: { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" } };
    }
}

// ✅ จัดการฟอร์มเข้าสู่ระบบ
document.getElementById("loginFormElement")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const { success, data } = await sendData("/api/v2/auth/login", formData);
    console.log("📌 Response:", data); // 🔹 Debugging

    if (!success || !data.success) {
        loginError.innerText = data.error;
        loginError.classList.remove("hidden");
        return;
    }

    /// ✅ เก็บ Token ใน localStorage
    localStorage.setItem("authToken", data.th_nightkun);

    console.log("📌 Redirecting to:", `${data.returnTo}?login_success=true`);
    window.location.href = `${data.returnTo}?login_success=true`;

});


// ✅ จัดการฟอร์มสมัครสมาชิก
document.getElementById("registerFormElement")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const { success, data } = await sendData("/api/v2/auth/register", formData);
        console.log("📌 Response:", data); // 🔹 Debugging

        if (!success || !data.success) {
            registerError.innerText = data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่";
            registerError.classList.remove("hidden");
            registersuccess.classList.add("hidden");
            return;
        }

        // alert("✅ " + data.message);
        registersuccess.innerText = data.message
        registersuccess.classList.remove("hidden");
        registerError.classList.add("hidden");
        switchTab("login");
        // window.location.href = "/?register_success=true"; // Redirect หลังสมัครสำเร็จ

    } catch (err) {
        console.error("❌ Error:", err);
        registerError.innerText = "เกิดข้อผิดพลาด กรุณาลองใหม่";
        registerError.classList.remove("hidden");
    }
});


// ✅ แสดงข้อความเมื่อสมัครสมาชิกสำเร็จ
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("register_success" || urlParams.get("login_success")) === "true") {
    alert("✅ สมัครสมาชิกสำเร็จ!");
    switchTab("login"); // สลับไปที่แท็บล็อกอินอัตโนมัติ
}
