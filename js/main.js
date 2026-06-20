/**
 * 守护地球 — 保护濒危动物 主脚本
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== 导航栏滚动效果 ====================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function updateNavbar() {
        const scrollY = window.scrollY;

        // 导航栏阴影
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 返回顶部按钮
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    // ==================== 导航链接激活状态 ====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ==================== 汉堡菜单 (移动端) ====================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击菜单项后关闭
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 点击其他区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ==================== 动物名录筛选 ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const animalCards = document.querySelectorAll('.animal-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // 筛选卡片
            animalCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    // 添加动画
                    card.style.animation = 'none';
                    card.offsetHeight; // 触发回流
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==================== 数据统计数字动画 ====================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.getElementById('statistics');
        const sectionTop = statsSection.offsetTop;
        const sectionHeight = statsSection.offsetHeight;
        const scrollY = window.scrollY + window.innerHeight * 0.8;

        if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
            statsAnimated = true;

            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 2000; // 2秒
                const startTime = performance.now();
                const startValue = 0;

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // easeOutExpo 缓动函数
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                    let currentValue;
                    if (target >= 1000) {
                        currentValue = Math.floor(eased * target);
                        // 格式化为带逗号的数字
                        el.textContent = currentValue.toLocaleString();
                    } else {
                        currentValue = Math.floor(eased * target);
                        el.textContent = currentValue;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        if (target >= 1000) {
                            el.textContent = target.toLocaleString();
                        } else {
                            el.textContent = target;
                        }
                    }
                }

                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateStats, { passive: true });
    // 初始检查（可能在视口内）
    animateStats();

    // ==================== 联系表单 ====================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // 简单验证
        if (!name || !email || !message) {
            showToast('请填写所有必填字段 ✏️', 'warning');
            return;
        }

        if (!isValidEmail(email)) {
            showToast('请输入有效的邮箱地址 📧', 'warning');
            return;
        }

        // 模拟发送（实际项目中替换为 API 请求）
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('消息发送成功！我们会尽快回复您 🎉', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // ==================== 资讯订阅 ====================
    const newsletterForm = document.getElementById('newsletterForm');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (!isValidEmail(email)) {
            showToast('请输入有效的邮箱地址 📧', 'warning');
            return;
        }

        const btn = newsletterForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '...';
        btn.disabled = true;

        setTimeout(() => {
            showToast('订阅成功！感谢您的关注 💚', 'success');
            newsletterForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1000);
    });

    // ==================== 平滑滚动 ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight + 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== 返回顶部 ====================
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==================== Toast 提示 ====================
    function showToast(message, type = 'success') {
        // 移除已有的 toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 触发动画
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // 自动移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==================== 工具函数 ====================
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ==================== 添加页面加载动画 ====================
    // 给动物卡片添加逐个出现的动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 逐个延迟出现
                const cards = entry.target.querySelectorAll('.animal-card, .endangered-card, .about-card, .help-card, .stat-card');
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08}s`;

                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察各区块
    document.querySelectorAll('.animals-grid, .endangered-grid, .about-grid, .help-grid, .stats-grid').forEach(grid => {
        observer.observe(grid);
    });

});
