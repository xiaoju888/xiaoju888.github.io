// 可以在这里添加交互功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('个人网页加载完成');
    
    // 返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    
    // 显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    // 平滑滚动到顶部
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    function setupMobileMenu() {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;
        if (navContainer.querySelector('.menu-toggle')) return; // 已初始化
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', '切换菜单');
        navContainer.appendChild(menuToggle);
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
            });
        });
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const navLinks = document.querySelector('.nav-links');
                if (!navLinks) return;
                if (window.innerWidth > 992) {
                    navLinks.classList.remove('active');
                    navLinks.style.display = 'flex';
                    menuToggle.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                } else {
                    navLinks.style.display = navLinks.classList.contains('active') ? 'flex' : 'none';
                }
            }, 250);
        });
    }

    function markActiveNav() {
        const path = window.location.pathname.replace(/\\/g,'/');
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(a => a.classList.remove('active'));
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            if (href === '/' && (path === '/' || path.endsWith('/index.html'))) a.classList.add('active');
            else if (href !== '/' && path.indexOf(href) !== -1) a.classList.add('active');
        });
    }

    // 动态注入公共导航
    const navbarMount = document.getElementById('navbar-mount');
    if (navbarMount) {
        fetch('/partials/navbar.html', { cache: 'no-cache' })
            .then(resp => resp.text())
            .then(html => { navbarMount.innerHTML = html; setupMobileMenu(); markActiveNav(); })
            .catch(err => console.warn('加载导航失败', err));
    } else {
        // 静态存在时初始化
        setupMobileMenu(); markActiveNav();
    }
    
    // 文章卡片动画
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.post-card, .sidebar-widget');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in-up');
            }
        });
    };
    
    // 初始加载时触发一次
    animateOnScroll();
    
    // 滚动时触发动画
    window.addEventListener('scroll', animateOnScroll);
    
    // 搜索功能
    const searchForm = document.querySelector('.search-box');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // 这里可以添加搜索逻辑，例如跳转到搜索页面或显示搜索结果
                alert('搜索: ' + searchTerm);
                // window.location.href = '/search?q=' + encodeURIComponent(searchTerm);
            }
        });
    }
    
    // 图片懒加载
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    console.log('博客交互功能已加载');

    // 动态注入公共页脚
    const footerMount = document.getElementById('footer-mount');
    if (footerMount) {
        fetch('/partials/footer.html', { cache: 'no-cache' })
            .then(function(resp) { return resp.text(); })
            .then(function(html) { footerMount.innerHTML = html; })
            .catch(function(err) { console.warn('加载页脚失败', err); });
    }
});