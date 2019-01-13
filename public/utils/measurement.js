export function measurement(stackCard, handCard) {
    console.log(stackCard, handCard);
    var oldTransform = stackCard.style.transform;
    var oldTransformOrigin = stackCard.style.transformOrigin;

    var iterations = 2, x = 0, y = 0;

    stackCard.style.transform = 'rotateX(-45deg)';
    stackCard.style.removeProperty('transform-origin');
    stackCard.style.setProperty('transition', 'none');

    var handCardRect = handCard.getBoundingClientRect();
    stackCard.style.width = handCardRect.width + 'px';
    stackCard.style.height = handCardRect.height + 'px';

    for (var itr = 0; itr < iterations; itr++) {
        var stackCardRect = stackCard.getBoundingClientRect();
        x += handCardRect.x - stackCardRect.x;
        y += handCardRect.y - stackCardRect.y;
        stackCard.style.transform = `rotateX(-45deg) translate(${x}px,${y}px)`
    }
    /*clean up*/
    stackCard.style.setProperty('transform',oldTransform);
    stackCard.style.setProperty('transform-origin',oldTransformOrigin);

    /*save conclusion*/
    stackCard.style.setProperty('--correctionX',x +'px');
    stackCard.style.setProperty('--correctionY',y +'px');
    stackCard.style.setProperty('--origin',oldTransformOrigin);

    stackCard.classList.add('put-card');
}
