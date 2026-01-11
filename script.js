// --- 1. Mobile Menu Logic ---
const openBtn = document.getElementById('openMenu');
const closeBtn = document.getElementById('closeMenu');
const menu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

if (openBtn) {
    openBtn.onclick = () => {
        menu.classList.add('open');
        overlay.style.display = 'block';
    }
}

if (closeBtn) {
    closeBtn.onclick = overlay.onclick = () => {
        menu.classList.remove('open');
        overlay.style.display = 'none';
    }
}

// --- 2. Slider Logic ---
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const dotsBox = document.getElementById('dots');
let current = 0;

if (dotsBox && slides.length > 0) {
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => move(i);
        dotsBox.appendChild(dot);
    });
}

function move(n) {
    if (slides.length === 0) return;
    slides[current].classList.remove('active');
    const dots = document.querySelectorAll('.dot');
    if (dots.length > 0) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots.length > 0) dots[current].classList.add('active');
}

if (nextBtn) nextBtn.onclick = () => move(current + 1);
if (prevBtn) prevBtn.onclick = () => move(current - 1);

setInterval(() => { if (nextBtn) nextBtn.click(); }, 5000);

// --- 3. Scroll Spy (Active Links) ---
window.onscroll = () => {
    let currentPos = "";
    document.querySelectorAll("section").forEach(s => {
        if (window.pageYOffset >= s.offsetTop - 150) currentPos = s.getAttribute("id");
    });
    document.querySelectorAll(".nav-link").forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href").includes(currentPos)) a.classList.add("active");
    });
};

// --- 4. Global Reveal Animation (تم دمج الأوبزرفر هنا لحل المشكلة) ---
document.addEventListener("DOMContentLoaded", function() {
    const globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });

    // تحديد كل العناصر التي تحتاج أنميشن في كل السكاشن
    const revealElements = document.querySelectorAll('.about-visuals, .about-info, .q-card, .service-card, .benefit-item, .video-container-glass, .why-us-content, .contact-details, .quote-card, .info-card');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        globalObserver.observe(el);
    });
});

// --- 5. Modal Logic (الخدمات) ---
const modal = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const requestBtns = document.querySelectorAll('.btn-request');

const defaultForm = document.querySelector('.request-form');
const maintenanceForm = document.getElementById('maintenanceForm');
const engineeringForm = document.getElementById('engineeringForm');
const safetyPlanForm = document.getElementById('safetyPlanForm');
const supplyInstallForm = document.getElementById('supplyInstallForm');
const rehabForm = document.getElementById('rehabForm');
const extinguisherForm = document.getElementById('extinguisherForm');
const globalHeader = document.querySelector('.modal-header');

if (requestBtns.length > 0) {
    requestBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // إخفاء الكل
            const allForms = [defaultForm, maintenanceForm, engineeringForm, safetyPlanForm, supplyInstallForm, rehabForm, extinguisherForm];
            allForms.forEach(form => { if(form) form.style.display = 'none'; });
            if(globalHeader) globalHeader.style.display = 'none';

            // التوزيع بناء على الترتيب الجديد
            if (index === 0 || index === 1 || index === 2) {
                if(defaultForm) defaultForm.style.display = 'block';
                if(globalHeader) globalHeader.style.display = 'block';
                const card = btn.closest('.service-card');
                document.getElementById('modalTitle').innerText = "طلب خدمة: " + card.querySelector('h3').innerText;
                document.getElementById('modalSubtitle').innerText = card.querySelector('p').innerText;
            } 
            else if (index === 3) { if(maintenanceForm) maintenanceForm.style.display = 'block'; }
            else if (index === 4) { if(engineeringForm) engineeringForm.style.display = 'block'; }
            else if (index === 5) { if(safetyPlanForm) safetyPlanForm.style.display = 'block'; }
            else if (index === 6) { if(supplyInstallForm) supplyInstallForm.style.display = 'block'; }
            else if (index === 7) { if(rehabForm) rehabForm.style.display = 'block'; }
            else if (index === 8) { if(extinguisherForm) extinguisherForm.style.display = 'block'; }

            if(modal) modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
}

if (closeModal) {
    closeModal.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
// --- وظيفة إرسال البيانات للواتساب ---

// 1. ربط فورم الخدمات العادية (تقارير فنية / شهادات)
const defaultFormSubmit = document.querySelector('.request-form');
defaultFormSubmit.onsubmit = function(e) {
    e.preventDefault();
    const serviceName = document.getElementById('modalTitle').innerText;
    let message = `*طلب ${serviceName}*%0A%0A`;
    
    // تجميع كل الحقول اللي جوه الفورم
    const inputs = defaultFormSubmit.querySelectorAll('input');
    inputs.forEach(input => {
        const label = input.parentElement.querySelector('label').innerText;
        const value = input.value;
        message += `*${label}:* ${value}%0A`;
    });

    sendToWhatsApp(message);
};

// 2. ربط فورم عقد الصيانة
const maintenanceFormSubmit = document.getElementById('maintenanceForm');
maintenanceFormSubmit.onsubmit = function(e) {
    e.preventDefault();
    let message = `*طلب عقد صيانة*%0A%0A`;
    
    const fields = maintenanceFormSubmit.querySelectorAll('input, select');
    fields.forEach(field => {
        const label = field.parentElement.querySelector('label')?.innerText || "بيانات أخرى";
        message += `*${label}:* ${field.value}%0A`;
    });

    sendToWhatsApp(message);
};

// 3. ربط فورم إعادة تأهيل الأنظمة
const rehabFormSubmit = document.getElementById('rehabForm');
rehabFormSubmit.onsubmit = function(e) {
    e.preventDefault();
    let message = `*طلب إعادة تأهيل أنظمة*%0A%0A`;
    
    const name = rehabFormSubmit.querySelector('input[placeholder="الاسم بالكامل"]').value;
    const phone = rehabFormSubmit.querySelector('input[placeholder="05XXXXXXXX"]').value;
    const address = rehabFormSubmit.querySelector('input[placeholder="العنوان بالتفصيل"]').value;

    message += `*الاسم:* ${name}%0A*الجوال:* ${phone}%0A*العنوان:* ${address}`;
    sendToWhatsApp(message);
};

// 4. ربط فورم صيانة الطفايات
const extinguisherFormSubmit = document.getElementById('extinguisherForm');
extinguisherFormSubmit.onsubmit = function(e) {
    e.preventDefault();
    let message = `*طلب صيانة وتعبئة طفايات*%0A%0A`;
    
    const name = extinguisherFormSubmit.querySelector('input[placeholder="الاسم بالكامل"]').value;
    const phone = extinguisherFormSubmit.querySelector('input[placeholder="05XXXXXXXX"]').value;
    
    message += `*الاسم:* ${name}%0A*الجوال:* ${phone}%0A%0A*تفاصيل الطفايات:*%0A`;
    
    const selects = extinguisherFormSubmit.querySelectorAll('select');
    const count = extinguisherFormSubmit.querySelector('input[type="number"]').value;
    
    message += `*النوع:* ${selects[0].value}%0A*الوزن:* ${selects[1].value}%0A*العدد:* ${count}%0A*الخدمة:* ${selects[2].value}`;

    sendToWhatsApp(message);
};

// 5. ربط نموذج عرض السعر (اللي في سكشن تواصل معنا)
const quoteFormSubmit = document.querySelector('.actual-form');
quoteFormSubmit.onsubmit = function(e) {
    e.preventDefault();
    let message = `*طلب عرض سعر جديد*%0A%0A`;
    
    const name = quoteFormSubmit.querySelectorAll('input')[0].value;
    const phone = quoteFormSubmit.querySelectorAll('input')[1].value;
    const details = quoteFormSubmit.querySelector('textarea').value;

    message += `*الاسم:* ${name}%0A*الجوال:* ${phone}%0A*التفاصيل:* ${details}`;
    sendToWhatsApp(message);
};

// الدالة المسؤولة عن فتح الرابط
function sendToWhatsApp(message) {
    const phoneNumber = "966567442759";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
}