const openBtn = document.getElementById('openMenu');
const closeBtn = document.getElementById('closeMenu');
const menu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-list a');

if (openBtn) {
    openBtn.onclick = () => {
        menu.classList.add('open');
        if(overlay) overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    }
}

const closeAll = () => {
    menu.classList.remove('open');
    if(overlay) overlay.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

if (closeBtn) closeBtn.onclick = closeAll;
if (overlay) overlay.onclick = closeAll;
mobileLinks.forEach(link => {
    link.onclick = closeAll;
});

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

document.addEventListener("DOMContentLoaded", function() {
    const globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.about-visuals, .about-info, .q-card, .service-card, .benefit-card, .video-wrapper-premium, .why-us-content, .contact-details, .quote-card, .info-card');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        globalObserver.observe(el);
    });
});

const modal = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const requestBtns = document.querySelectorAll('.btn-request');

const forms = {
    default: document.querySelector('.request-form'),
    maintenance: document.getElementById('maintenanceForm'),
    engineering: document.getElementById('engineeringForm'),
    safety: document.getElementById('safetyPlanForm'),
    supply: document.getElementById('supplyInstallForm'),
    rehab: document.getElementById('rehabForm'),
    extinguisher: document.getElementById('extinguisherForm'),
    header: document.querySelector('.modal-header')
};

if (requestBtns.length > 0) {
    requestBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            Object.values(forms).forEach(f => { if(f) f.style.display = 'none'; });

            if (index <= 2) { 
                forms.default.style.display = 'block'; 
                forms.header.style.display = 'block';
                const card = btn.closest('.service-card');
                document.getElementById('modalTitle').innerText = "طلب خدمة: " + card.querySelector('h3').innerText;
                document.getElementById('modalSubtitle').innerText = card.querySelector('p').innerText;
            } 
            else if (index === 3) forms.maintenance.style.display = 'block';
            else if (index === 4) forms.engineering.style.display = 'block';
            else if (index === 5) forms.safety.style.display = 'block';
            else if (index === 6) forms.supply.style.display = 'block';
            else if (index === 7) forms.rehab.style.display = 'block';
            else if (index === 8) forms.extinguisher.style.display = 'block';

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
}

function handleFormSubmit(formElement, serviceTitle) {
    formElement.onsubmit = function(e) {
        e.preventDefault();
        let message = `*طلب خدمة: ${serviceTitle}*%0A%0A`;
        const elements = formElement.querySelectorAll('input, select, textarea');
        
        elements.forEach(el => {
            if (el.type !== 'submit' && el.type !== 'file') {
                const label = el.parentElement.querySelector('label')?.innerText || "البيان";
                message += `*${label}:* ${el.value}%0A`;
            }
        });

        const phoneNumber = "966567442759";
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };
}

if(forms.default) handleFormSubmit(forms.default, "تقارير فنية وشهادات");
if(forms.maintenance) handleFormSubmit(forms.maintenance, "عقد صيانة");
if(forms.engineering) handleFormSubmit(forms.engineering, "مخطط هندسي");
if(forms.safety) handleFormSubmit(forms.safety, "مخطط سلامة");
if(forms.supply) handleFormSubmit(forms.supply, "توريد وتركيب");
if(forms.rehab) handleFormSubmit(forms.rehab, "إعادة تأهيل");
if(forms.extinguisher) handleFormSubmit(forms.extinguisher, "صيانة طفايات");

const quoteForm = document.querySelector('.actual-form');
if(quoteForm) handleFormSubmit(quoteForm, "عرض سعر جديد");

if (closeModal) closeModal.onclick = () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
window.onclick = (event) => { if (event.target == modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; } }
const systemsContainer = document.getElementById('systemsDynamicContainer');
const addSystemBtn = document.getElementById('addNewSystemRow');

if (addSystemBtn) {
    addSystemBtn.addEventListener('click', () => {
        const newRow = document.createElement('div');
        newRow.className = 'systems-row';
        newRow.style.marginTop = '10px'; 
        newRow.innerHTML = `
            <div class="form-group">
                <label>النظام</label>
                <select name="system[]">
                    <option>نظام انذار مبكر</option>
                    <option>نظام الرش الالي و صناديق الحريق</option>
                    <option>نظام FM-200</option>
                    <option>نظام نوفيك 1230</option>
                    <option>نظام co2</option>
                    <option>نظام فاير برو</option>
                    <option>نظام كيتشن هود</option>
                </select>
            </div>
            <div class="form-group">
                <label>الحالة</label>
                <select name="status[]">
                    <option>اختر الحالة</option>
                    <option>لا يعمل</option>
                    <option>يعمل و لكن يحتاج صيانة</option>
                </select>
            </div>
            <button type="button" class="remove-btn" style="background:#c62828; color:white; border:none; width:45px; height:45px; border-radius:10px; cursor:pointer;">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        systemsContainer.appendChild(newRow);
        newRow.querySelector('.remove-btn').addEventListener('click', function() {
            newRow.remove();
        });
    });
}