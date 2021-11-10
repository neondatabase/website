// seo-component-specific function that creates correct path for the og:image
export default function createMetaImagePath(image, siteUrl) {
  return siteUrl + image.localFile.childImageSharp.fixed.src;
}
