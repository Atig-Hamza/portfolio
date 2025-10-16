const gridCanvas = document.querySelector('.grid-pattern');

if (gridCanvas) {
    const stickers = gridCanvas.querySelectorAll('.sticker');
    const shapes = document.querySelector('.shapes');

    stickers.forEach((sticker) => {
        sticker.style.touchAction = 'none';

        sticker.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            event.preventDefault();

            const gridRect = gridCanvas.getBoundingClientRect();
            const shapesRect = shapes.getBoundingClientRect();
            const stickerRect = sticker.getBoundingClientRect();

            // pointer offset inside the sticker
            const offsetX = event.clientX - stickerRect.left;
            const offsetY = event.clientY - stickerRect.top;
            const stickerWidth = stickerRect.width;
            const stickerHeight = stickerRect.height;

            // compute scaling if shapes are transformed
            const scaleX = shapes.offsetWidth / shapesRect.width;
            const scaleY = shapes.offsetHeight / shapesRect.height;

            sticker.setPointerCapture(event.pointerId);

            const handlePointerMove = (moveEvent) => {
                const newShapesRect = shapes.getBoundingClientRect();

                // fix: include shapes offset (top/left movement)
                const relativeX =
                    (moveEvent.clientX - newShapesRect.left - offsetX) * scaleX;
                const relativeY =
                    (moveEvent.clientY - newShapesRect.top - offsetY) * scaleY;

                const maxLeft = newShapesRect.width - stickerWidth;
                const maxTop = newShapesRect.height - stickerHeight;

                const clampedLeft = Math.min(Math.max(0, relativeX), maxLeft);
                const clampedTop = Math.min(Math.max(0, relativeY), maxTop);

                sticker.style.left = `${clampedLeft}px`;
                sticker.style.top = `${clampedTop}px`;
                sticker.style.right = 'auto';
                sticker.style.bottom = 'auto';
            };

            const endDrag = (endEvent) => {
                if (sticker.hasPointerCapture(endEvent.pointerId)) {
                    sticker.releasePointerCapture(endEvent.pointerId);
                }
                sticker.removeEventListener('pointermove', handlePointerMove);
                sticker.removeEventListener('pointerup', endDrag);
                sticker.removeEventListener('pointercancel', endDrag);
            };

            sticker.addEventListener('pointermove', handlePointerMove);
            sticker.addEventListener('pointerup', endDrag);
            sticker.addEventListener('pointercancel', endDrag);
        });
    });

    // Responsive scaling
    const querys = [
        { query: '(max-width: 430px)', top: '-10%', left: '-105%' },
        { query: '(max-width: 500px)', top: '-7%', left: '-105%' },
        { query: '(max-width: 520px)', top: '-7%', left: '-100%' },
        { query: '(max-width: 550px)', top: '-7%', left: '-97%' },
        { query: '(max-width: 570px)', top: '-7%', left: '-90%' },
        { query: '(max-width: 600px)', top: '-7%', left: '-86%' },
        { query: '(max-width: 640px)', top: '-7%', left: '-76%' },
        { query: '(max-width: 767px)', top: '-7%', left: '-71%' },
        { query: '(max-width: 1024px)', top: '0%', left: '-49%' },
        { query: '(max-width: 1279px)', top: '0%', left: '-27%' },
        { query: '(max-width: 1534px)', top: '0%', left: '-10%' },
        { query: '(min-width: 1534px)', top: '0%', left: '0%' }
    ];

    const applyStyles = () => {
        if (!shapes) return;

        let scale = 1;
        // if (window.innerWidth < 420) scale = 0.6;
        // else if (window.innerWidth < 500) scale = 0.7;
        // else if (window.innerWidth < 600) scale = 0.8;

        for (const config of querys) {
            const mediaQuery = window.matchMedia(config.query);
            if (mediaQuery.matches) {
                shapes.style.top = config.top;
                shapes.style.left = config.left;
                shapes.style.transform = `scale(${scale})`;
                shapes.style.transformOrigin = 'top left'; // key fix
                break;
            }
        }
    };

    applyStyles();
    window.addEventListener('resize', applyStyles);
}


//click on designner text to change letter color 
const designerText = document.getElementById('designer-text');
const word = 'DESIGNER';
const colors = ['#FFD138', '#FF5E84', '#6ADBCB', '#98E23B', '#FF8438', '#F2EBE3'];

designerText.innerHTML = word.split('').map((letter, index) =>
    `<span class="cursor-pointer inline-block transition-colors duration-300" data-index="${index}">${letter}</span>`
).join('');

designerText.querySelectorAll('span').forEach(span => {
    span.addEventListener('click', function () {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.style.color = randomColor;
    });
});