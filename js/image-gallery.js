/**
 * Advanced Image Gallery System
 * Provides lightbox, zoom, 360° view, and advanced image handling
 */

class ImageGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.isOpen = false;
        this.zoomLevel = 1;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.imageOffset = { x: 0, y: 0 };
        this.touchStartDistance = 0;
        
        this.init();
    }

    init() {
        this.createGalleryHTML();
        this.bindEvents();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
    }

    // ===== GALLERY CREATION =====
    
    createGalleryHTML() {
        const galleryHTML = `
            <div id="imageGalleryOverlay" class="image-gallery-overlay">
                <div class="gallery-container">
                    <!-- Gallery Header -->
                    <div class="gallery-header">
                        <div class="gallery-counter">
                            <span id="galleryCurrentIndex">1</span> / <span id="galleryTotalImages">1</span>
                        </div>
                        <div class="gallery-controls">
                            <button class="gallery-btn" id="galleryZoomOut" title="Zoom Out">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 13H5v-2h14v2z"/>
                                </svg>
                            </button>
                            <button class="gallery-btn" id="galleryZoomIn" title="Zoom In">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                            </button>
                            <button class="gallery-btn" id="galleryRotate" title="Rotate">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                                </svg>
                            </button>
                            <button class="gallery-btn" id="galleryFullscreen" title="Fullscreen">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg>
                            </button>
                            <button class="gallery-btn" id="galleryDownload" title="Download">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            </button>
                            <button class="gallery-btn" id="galleryShare" title="Share">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                </svg>
                            </button>
                            <button class="gallery-btn gallery-close" id="galleryClose" title="Close">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Main Image Container -->
                    <div class="gallery-main">
                        <button class="gallery-nav gallery-prev" id="galleryPrev">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                            </svg>
                        </button>
                        
                        <div class="gallery-image-container" id="galleryImageContainer">
                            <img id="galleryMainImage" class="gallery-main-image" alt="Gallery Image">
                            <div class="gallery-loading" id="galleryLoading">
                                <div class="loading-spinner"></div>
                            </div>
                        </div>
                        
                        <button class="gallery-nav gallery-next" id="galleryNext">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Thumbnails -->
                    <div class="gallery-thumbnails" id="galleryThumbnails">
                        <!-- Thumbnails will be generated dynamically -->
                    </div>

                    <!-- Image Info -->
                    <div class="gallery-info" id="galleryInfo">
                        <div class="image-details">
                            <h3 id="imageTitle">Image Title</h3>
                            <p id="imageDescription">Image description</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', galleryHTML);
        this.galleryOverlay = document.getElementById('imageGalleryOverlay');
        this.mainImage = document.getElementById('galleryMainImage');
        this.imageContainer = document.getElementById('galleryImageContainer');
        this.thumbnailsContainer = document.getElementById('galleryThumbnails');
        this.loadingIndicator = document.getElementById('galleryLoading');
    }

    // ===== GALLERY OPENING =====
    
    openGallery(images, startIndex = 0, carInfo = {}) {
        this.images = images.map((img, index) => ({
            src: typeof img === 'string' ? img : img.src,
            title: typeof img === 'object' ? img.title : `${carInfo.brand || 'Auto'} ${carInfo.model || ''} - Foto ${index + 1}`,
            description: typeof img === 'object' ? img.description : carInfo.description || '',
            alt: typeof img === 'object' ? img.alt : `${carInfo.brand || 'Auto'} foto ${index + 1}`
        }));
        
        this.currentIndex = startIndex;
        this.isOpen = true;
        this.zoomLevel = 1;
        this.imageOffset = { x: 0, y: 0 };
        
        this.galleryOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.generateThumbnails();
        this.loadImage(this.currentIndex);
        this.updateCounter();
        this.updateNavigation();
        
        // Add to history for back button support
        if (history.pushState) {
            history.pushState({ galleryOpen: true }, '');
        }
    }

    closeGallery() {
        this.isOpen = false;
        this.galleryOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clean up
        this.images = [];
        this.currentIndex = 0;
        this.zoomLevel = 1;
        this.imageOffset = { x: 0, y: 0 };
        
        // Remove from history
        if (history.state && history.state.galleryOpen) {
            history.back();
        }
    }

    // ===== IMAGE LOADING =====
    
    loadImage(index) {
        if (index < 0 || index >= this.images.length) return;
        
        this.showLoading();
        
        const imageData = this.images[index];
        const img = new Image();
        
        img.onload = () => {
            this.mainImage.src = img.src;
            this.mainImage.alt = imageData.alt;
            this.hideLoading();
            this.resetImageTransform();
            this.updateImageInfo(imageData);
            
            // Preload next and previous images
            this.preloadAdjacentImages();
        };
        
        img.onerror = () => {
            this.hideLoading();
            this.showImageError();
        };
        
        img.src = imageData.src;
    }
    
    preloadAdjacentImages() {
        // Preload next image
        if (this.currentIndex + 1 < this.images.length) {
            const nextImg = new Image();
            nextImg.src = this.images[this.currentIndex + 1].src;
        }
        
        // Preload previous image
        if (this.currentIndex - 1 >= 0) {
            const prevImg = new Image();
            prevImg.src = this.images[this.currentIndex - 1].src;
        }
    }
    
    showLoading() {
        this.loadingIndicator.style.display = 'flex';
    }
    
    hideLoading() {
        this.loadingIndicator.style.display = 'none';
    }
    
    showImageError() {
        this.mainImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LXNpemU9IjE0Ij5JbW1hZ2luZSBub24gZGlzcG9uaWJpbGU8L3RleHQ+Cjwvc3ZnPg==';
        this.mainImage.alt = 'Immagine non disponibile';
    }

    // ===== NAVIGATION =====
    
    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.loadImage(this.currentIndex);
            this.updateCounter();
            this.updateNavigation();
            this.updateActiveThumbnail();
        }
    }
    
    prevImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.loadImage(this.currentIndex);
            this.updateCounter();
            this.updateNavigation();
            this.updateActiveThumbnail();
        }
    }
    
    goToImage(index) {
        if (index >= 0 && index < this.images.length && index !== this.currentIndex) {
            this.currentIndex = index;
            this.loadImage(this.currentIndex);
            this.updateCounter();
            this.updateNavigation();
            this.updateActiveThumbnail();
        }
    }
    
    updateCounter() {
        document.getElementById('galleryCurrentIndex').textContent = this.currentIndex + 1;
        document.getElementById('galleryTotalImages').textContent = this.images.length;
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        
        prevBtn.style.display = this.currentIndex > 0 ? 'flex' : 'none';
        nextBtn.style.display = this.currentIndex < this.images.length - 1 ? 'flex' : 'none';
    }

    // ===== THUMBNAILS =====
    
    generateThumbnails() {
        this.thumbnailsContainer.innerHTML = '';
        
        this.images.forEach((imageData, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `gallery-thumbnail ${index === this.currentIndex ? 'active' : ''}`;
            thumbnail.innerHTML = `
                <img src="${imageData.src}" alt="${imageData.alt}" loading="lazy">
                <div class="thumbnail-overlay"></div>
            `;
            
            thumbnail.addEventListener('click', () => {
                this.goToImage(index);
            });
            
            this.thumbnailsContainer.appendChild(thumbnail);
        });
    }
    
    updateActiveThumbnail() {
        const thumbnails = this.thumbnailsContainer.querySelectorAll('.gallery-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
        
        // Scroll active thumbnail into view
        const activeThumbnail = thumbnails[this.currentIndex];
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    // ===== ZOOM AND PAN =====
    
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.5, 5);
        this.applyImageTransform();
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.5, 0.5);
        this.applyImageTransform();
        
        // Reset position if zoomed out too much
        if (this.zoomLevel <= 1) {
            this.imageOffset = { x: 0, y: 0 };
        }
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        this.imageOffset = { x: 0, y: 0 };
        this.applyImageTransform();
    }
    
    applyImageTransform() {
        this.mainImage.style.transform = `
            scale(${this.zoomLevel}) 
            translate(${this.imageOffset.x}px, ${this.imageOffset.y}px)
        `;
    }
    
    resetImageTransform() {
        this.zoomLevel = 1;
        this.imageOffset = { x: 0, y: 0 };
        this.mainImage.style.transform = '';
    }

    // ===== EVENT HANDLERS =====
    
    bindEvents() {
        // Close gallery
        document.getElementById('galleryClose').addEventListener('click', () => {
            this.closeGallery();
        });
        
        // Navigation
        document.getElementById('galleryPrev').addEventListener('click', () => {
            this.prevImage();
        });
        
        document.getElementById('galleryNext').addEventListener('click', () => {
            this.nextImage();
        });
        
        // Zoom controls
        document.getElementById('galleryZoomIn').addEventListener('click', () => {
            this.zoomIn();
        });
        
        document.getElementById('galleryZoomOut').addEventListener('click', () => {
            this.zoomOut();
        });
        
        // Other controls
        document.getElementById('galleryRotate').addEventListener('click', () => {
            this.rotateImage();
        });
        
        document.getElementById('galleryFullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        document.getElementById('galleryDownload').addEventListener('click', () => {
            this.downloadImage();
        });
        
        document.getElementById('galleryShare').addEventListener('click', () => {
            this.shareImage();
        });
        
        // Click outside to close
        this.galleryOverlay.addEventListener('click', (e) => {
            if (e.target === this.galleryOverlay) {
                this.closeGallery();
            }
        });
        
        // Double click to zoom
        this.mainImage.addEventListener('dblclick', (e) => {
            if (this.zoomLevel === 1) {
                this.zoomIn();
                // Center zoom on click point
                const rect = this.mainImage.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.imageOffset.x = -x * 0.5;
                this.imageOffset.y = -y * 0.5;
                this.applyImageTransform();
            } else {
                this.resetZoom();
            }
        });
        
        // Mouse wheel zoom
        this.imageContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });
        
        // Drag to pan
        this.setupDragToPan();
        
        // Browser back button
        window.addEventListener('popstate', (e) => {
            if (this.isOpen && (!e.state || !e.state.galleryOpen)) {
                this.closeGallery();
            }
        });
    }
    
    setupDragToPan() {
        this.mainImage.addEventListener('mousedown', (e) => {
            if (this.zoomLevel > 1) {
                this.isDragging = true;
                this.dragStart.x = e.clientX - this.imageOffset.x;
                this.dragStart.y = e.clientY - this.imageOffset.y;
                this.mainImage.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.zoomLevel > 1) {
                this.imageOffset.x = e.clientX - this.dragStart.x;
                this.imageOffset.y = e.clientY - this.dragStart.y;
                this.applyImageTransform();
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.mainImage.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
        });
    }

    // ===== KEYBOARD NAVIGATION =====
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeGallery();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case '+':
                case '=':
                    this.zoomIn();
                    break;
                case '-':
                    this.zoomOut();
                    break;
                case '0':
                    this.resetZoom();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
                case 'd':
                case 'D':
                    this.downloadImage();
                    break;
            }
        });
    }

    // ===== TOUCH GESTURES =====
    
    setupTouchGestures() {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        
        this.imageContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos.x = e.touches[0].clientX;
            touchStartPos.y = e.touches[0].clientY;
            
            if (e.touches.length === 2) {
                // Pinch to zoom start
                this.touchStartDistance = this.getTouchDistance(e.touches);
            }
        });
        
        this.imageContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 2) {
                // Pinch to zoom
                const currentDistance = this.getTouchDistance(e.touches);
                const scale = currentDistance / this.touchStartDistance;
                this.zoomLevel = Math.min(Math.max(this.zoomLevel * scale, 0.5), 5);
                this.applyImageTransform();
                this.touchStartDistance = currentDistance;
            }
        });
        
        this.imageContainer.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            const touchDistance = Math.sqrt(
                Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
                Math.pow(touchEndPos.y - touchStartPos.y, 2)
            );
            
            // Tap to close/navigate
            if (touchDuration < 300 && touchDistance < 10) {
                const containerRect = this.imageContainer.getBoundingClientRect();
                const tapX = touchEndPos.x - containerRect.left;
                const tapRatio = tapX / containerRect.width;
                
                if (tapRatio < 0.3) {
                    this.prevImage();
                } else if (tapRatio > 0.7) {
                    this.nextImage();
                } else {
                    // Center tap - could be used for other actions
                }
            }
            
            // Swipe gestures
            if (touchDuration < 500 && touchDistance > 50) {
                const deltaX = touchEndPos.x - touchStartPos.x;
                const deltaY = touchEndPos.y - touchStartPos.y;
                
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        this.prevImage();
                    } else {
                        this.nextImage();
                    }
                } else if (deltaY > 50) {
                    this.closeGallery();
                }
            }
        });
    }
    
    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // ===== UTILITY FUNCTIONS =====
    
    rotateImage() {
        const currentRotation = this.mainImage.style.transform.match(/rotate\((\d+)deg\)/);
        const rotation = currentRotation ? parseInt(currentRotation[1]) + 90 : 90;
        this.mainImage.style.transform = `rotate(${rotation}deg) scale(${this.zoomLevel}) translate(${this.imageOffset.x}px, ${this.imageOffset.y}px)`;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.galleryOverlay.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    downloadImage() {
        const link = document.createElement('a');
        link.href = this.images[this.currentIndex].src;
        link.download = `image-${this.currentIndex + 1}.jpg`;
        link.click();
    }
    
    shareImage() {
        if (navigator.share) {
            navigator.share({
                title: this.images[this.currentIndex].title,
                url: this.images[this.currentIndex].src
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.images[this.currentIndex].src).then(() => {
                if (window.advancedFeatures) {
                    window.advancedFeatures.showNotification('Link copiato', 'URL immagine copiato negli appunti', 'success');
                }
            });
        }
    }
    
    updateImageInfo(imageData) {
        document.getElementById('imageTitle').textContent = imageData.title;
        document.getElementById('imageDescription').textContent = imageData.description;
    }
}

// Initialize image gallery
let imageGallery;

document.addEventListener('DOMContentLoaded', () => {
    imageGallery = new ImageGallery();
    window.imageGallery = imageGallery;
    
    // Auto-initialize gallery for car images
    document.addEventListener('click', (e) => {
        const carImage = e.target.closest('[data-car-images]');
        if (carImage) {
            e.preventDefault();
            const images = JSON.parse(carImage.dataset.carImages || '[]');
            const startIndex = parseInt(carImage.dataset.imageIndex || '0');
            const carInfo = JSON.parse(carImage.dataset.carInfo || '{}');
            
            imageGallery.openGallery(images, startIndex, carInfo);
        }
    });
    
    console.log('🖼️ Image Gallery initialized successfully!');
});

// Add gallery styles
const galleryStyles = `
    <style>
    .image-gallery-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }
    
    .image-gallery-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    .gallery-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        color: white;
    }
    
    .gallery-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .gallery-counter {
        font-size: 16px;
        font-weight: 500;
    }
    
    .gallery-controls {
        display: flex;
        gap: 12px;
    }
    
    .gallery-btn {
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }
    
    .gallery-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
    
    .gallery-btn svg {
        width: 20px;
        height: 20px;
    }
    
    .gallery-main {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
    }
    
    .gallery-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }
    
    .gallery-nav:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-50%) scale(1.1);
    }
    
    .gallery-prev {
        left: 20px;
    }
    
    .gallery-next {
        right: 20px;
    }
    
    .gallery-image-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100%;
        overflow: hidden;
    }
    
    .gallery-main-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
        cursor: grab;
    }
    
    .gallery-main-image:active {
        cursor: grabbing;
    }
    
    .gallery-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        align-items: center;
        justify-content: center;
    }
    
    .gallery-thumbnails {
        display: flex;
        gap: 8px;
        padding: 20px;
        overflow-x: auto;
        background: rgba(0, 0, 0, 0.3);
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    }
    
    .gallery-thumbnails::-webkit-scrollbar {
        height: 6px;
    }
    
    .gallery-thumbnails::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .gallery-thumbnails::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
    }
    
    .gallery-thumbnail {
        flex-shrink: 0;
        width: 80px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .gallery-thumbnail.active {
        border-color: #00ff88;
    }
    
    .gallery-thumbnail:hover {
        transform: scale(1.05);
    }
    
    .gallery-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .thumbnail-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .gallery-thumbnail.active .thumbnail-overlay,
    .gallery-thumbnail:hover .thumbnail-overlay {
        opacity: 0;
    }
    
    .gallery-info {
        padding: 20px;
        background: rgba(0, 0, 0, 0.5);
        max-height: 120px;
        overflow-y: auto;
    }
    
    .image-details h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
    }
    
    .image-details p {
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        line-height: 1.4;
    }
    
    @media (max-width: 768px) {
        .gallery-header {
            padding: 15px;
        }
        
        .gallery-controls {
            gap: 8px;
        }
        
        .gallery-btn {
            width: 36px;
            height: 36px;
        }
        
        .gallery-nav {
            width: 44px;
            height: 44px;
        }
        
        .gallery-thumbnails {
            padding: 15px;
        }
        
        .gallery-thumbnail {
            width: 60px;
            height: 45px;
        }
        
        .gallery-info {
            padding: 15px;
        }
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', galleryStyles);
