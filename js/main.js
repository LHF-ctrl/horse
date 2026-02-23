// 主逻辑模块 - 处理用户交互和应用功能

import { generateMessage, generateImage, downloadImage } from './api.js';

// DOM元素
let elements;

// 当前生成的贺词
let currentMessage = '';

// 初始化应用
function initApp() {
    // 在DOM完全加载后获取元素
    elements = {
        generateBtn: document.getElementById('generate-btn'),
        copyBtn: document.getElementById('copy-btn'),
        imageBtn: document.getElementById('image-btn'),
        regenerateBtn: document.getElementById('regenerate-btn'),
        loading: document.getElementById('loading'),
        result: document.getElementById('result'),
        message: document.getElementById('message')
    };
    bindEventListeners();
}

// 绑定事件监听器
function bindEventListeners() {
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.copyBtn.addEventListener('click', handleCopy);
    elements.imageBtn.addEventListener('click', handleImage);
    elements.regenerateBtn.addEventListener('click', handleGenerate);
}

// 处理生成贺词
async function handleGenerate() {
    showLoading();
    hideResult();

    try {
        currentMessage = await generateMessage();
        displayMessage(currentMessage);
        hideLoading();
        showResult();
    } catch (error) {
        console.error('处理生成贺词失败:', error);
        hideLoading();
        showError('生成贺词失败，请稍后重试');
    }
}

// 处理复制贺词
function handleCopy() {
    if (!currentMessage) return;

    navigator.clipboard.writeText(currentMessage)
        .then(() => {
            showToast('贺词已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制');
        });
}

// 处理生成图片
async function handleImage() {
    if (!currentMessage) return;

    showLoading('正在生成图片...');

    try {
        const imageUrl = await generateImage(currentMessage);
        hideLoading();
        downloadImage(imageUrl);
    } catch (error) {
        console.error('生成图片失败:', error);
        hideLoading();
        showToast('生成图片失败，请稍后重试');
    }
}

// 显示加载状态
function showLoading(text = '正在生成贺词...') {
    elements.loading.querySelector('p').textContent = text;
    elements.loading.classList.remove('hidden');
}

// 隐藏加载状态
function hideLoading() {
    elements.loading.classList.add('hidden');
}

// 显示结果
function showResult() {
    elements.result.classList.remove('hidden');
}

// 隐藏结果
function hideResult() {
    elements.result.classList.add('hidden');
}

// 显示错误信息
function showError(message) {
    elements.message.textContent = message;
    elements.message.style.color = '#cc0000';
    showResult();
}

// 显示贺词
function displayMessage(message) {
    elements.message.textContent = message;
    elements.message.style.color = '#333';
}

// 显示提示信息
function showToast(message) {
    // 创建Toast元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加样式
    Object.assign(toast.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '25px',
        fontSize: '1rem',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(toast);

    // 显示Toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);

    // 3秒后隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // 隐藏页面加载动画
        setTimeout(() => {
            const pageLoader = document.getElementById('page-loader');
            if (pageLoader) {
                pageLoader.classList.add('hidden');
            }
            initApp();
        }, 1000);
    });
} else {
    // 隐藏页面加载动画
    setTimeout(() => {
        const pageLoader = document.getElementById('page-loader');
        if (pageLoader) {
            pageLoader.classList.add('hidden');
        }
        initApp();
    }, 1000);
}

// 性能优化：图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        images.forEach(function(image) {
            imageObserver.observe(image);
        });
    }
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}