export function handleImageFallback(event) {
  const image = event.currentTarget
  image.onerror = null
  image.src = '/mtb-image-fallback.svg'
}
