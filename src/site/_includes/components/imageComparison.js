module.exports = function imageComparison(imageA, imageB, size = [150, 150]) {
    const [width, height] = size
    return /*html*/`<div class="image-comparison" data-image-comparison style="--width: ${width}px; --height: ${height}px">
        <image width="${width}" height="${height}" class="image-comparison__imageA" src="${imageA}"/>
        <image width="${width}" height="${height}" class="image-comparison__imageB" src="${imageB}"/>
    </div>`
}