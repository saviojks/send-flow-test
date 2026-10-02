export const skeletonArray = (length: number = 5) => {
  return Array.from({ length }, (_, index) => index)
}