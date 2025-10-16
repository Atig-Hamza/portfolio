const gridCanvas = document.querySelector('.grid-pattern');

if (gridCanvas) {
    const stickers = gridCanvas.querySelectorAll('.sticker');

    stickers.forEach((sticker) => {
        sticker.style.touchAction = 'none';

        sticker.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;

            event.preventDefault();

            const containerRect = gridCanvas.getBoundingClientRect();
            const stickerRect = sticker.getBoundingClientRect();
            const offsetX = event.clientX - stickerRect.left;
            const offsetY = event.clientY - stickerRect.top;
            const stickerWidth = stickerRect.width;
            const stickerHeight = stickerRect.height;

            sticker.style.left = `${stickerRect.left - containerRect.left}px`;
            sticker.style.top = `${stickerRect.top - containerRect.top}px`;
            sticker.style.right = 'auto';
            sticker.style.bottom = 'auto';

            sticker.setPointerCapture(event.pointerId);

            const handlePointerMove = (moveEvent) => {
                const bounds = gridCanvas.getBoundingClientRect();
                const nextLeft = moveEvent.clientX - bounds.left - offsetX;
                const nextTop = moveEvent.clientY - bounds.top - offsetY;

                const clampedLeft = Math.min(Math.max(0, nextLeft), bounds.width - stickerWidth);
                const clampedTop = Math.min(Math.max(0, nextTop), bounds.height - stickerHeight);

                sticker.style.left = `${clampedLeft}px`;
                sticker.style.top = `${clampedTop}px`;
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
}