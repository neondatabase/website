export default function createMetaImagePath(image, siteUrl) {
  if (!image) return null;
  return siteUrl + image.localFile.childImageSharp.gatsbyImageData.images.fallback.src;
}
