/* eslint-disable no-case-declarations */
import clsx from 'clsx';
import parse, { attributesToProps, domToReact } from 'html-react-parser';
import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import Image from 'next/image';

import EmbedTweet from 'components/shared/embed-tweet';
import Link from 'components/shared/link';

import AnchorHeading from '../components/shared/anchor-heading';
import ImageZoom from '../components/shared/image-zoom';

function isBooleanString(string) {
  return string === 'true' || string === 'false';
}

function isJSON(string) {
  if (typeof string !== 'string') return false;
  if (isBooleanString(string)) return false;

  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }

  return true;
}

function toCamelCase(string) {
  return string.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

function transformValue(value) {
  if (isJSON(value)) {
    const parsedJSON = JSON.parse(value);

    if (Array.isArray(parsedJSON)) return parsedJSON.map((item) => transformProps(item));
    if (typeof parsedJSON === 'object' && parsedJSON !== null) return transformProps(parsedJSON);

    return parsedJSON;
  }

  if (Array.isArray(value)) return value.map((item) => transformProps(item));
  if (typeof value === 'object' && value !== null) return transformProps(value);

  if (isBooleanString(value)) return value === 'true';

  return value;
}

function transformProps(props) {
  const transformedProps = {};

  Object.keys(props).forEach((propName) => {
    const transformedValue = transformValue(props[propName]);
    if (!transformedValue && isEmpty(transformedValue) && !isBoolean(transformedValue)) return;
    transformedProps[toCamelCase(propName)] = transformedValue;
  });

  return transformedProps;
}

const sharedComponents = {
  h2: AnchorHeading('h2'),
  img: (props) => {
    const { src, className, width, height, alt, isPriority } = props;
    const urlWithoutSize = src.replace(/-\d+x\d+/i, '');

    return (
      <ImageZoom src={urlWithoutSize} isDark>
        <Image
          className={clsx('rounded-md', className)}
          src={urlWithoutSize}
          width={width || 975}
          height={height || 512}
          quality={85}
          alt={alt || 'Post image'}
          priority={isPriority || false}
          sizes="(max-width: 767px) 100vw"
        />
      </ImageZoom>
    );
  },
  a: (props) => {
    const { href, ...otherProps } = props;
    return <Link to={href} {...otherProps} />;
  },
};

export default function getReactContentWithLazyBlocks(content, pageComponents, includeBaseTags) {
  if (content === null || content === undefined) {
    return null;
  }

  // https://github.com/remarkablemark/html-react-parser#htmlparser2
  // The library does parsing on client side differently from server side
  // it results in having a need of passing htmlparser2 to adjust behavior
  // according to the client side behavior
  let isFirstImage = true;
  const components = {
    ...sharedComponents,
    ...pageComponents,
  };

  // Here we remove anything that can come from WordPress but should not be rendered.
  // For now it's only <meta charset="utf-8"> that can come in a value of a field with type Rich Text or Classic Editor
  const cleanedContent = content.replace(/&lt;meta charset=\\&quot;utf-8\\&quot;&gt;/gim, '');

  return parse(cleanedContent, {
    htmlparser2: {
      lowerCaseAttributeNames: true,
    },
    replace: (domNode) => {
      if (domNode.type === 'tag') {
        if (domNode.attribs?.class?.includes('wp-block-lazyblock')) {
          const element =
            domNode.children[0].type === 'tag' ? domNode.children[0] : domNode.children[1];

          const Component = components[element.name];
          if (!Component) return <></>;

          const props = transformProps(attributesToProps(element.attribs));

          return <Component {...props} />;
        }

        if (domNode.attribs?.class?.includes('wp-block-image')) {
          const element =
            domNode.children[0].type === 'tag' ? domNode.children[0] : domNode.children[1];
          const Component = components[element.name];

          if (!Component) return <></>;

          if (domNode.children[0].name === 'img') {
            const isPriority = isFirstImage;
            isFirstImage = false;
            const props = transformProps(attributesToProps({ ...element.attribs, isPriority }));
            const { className: imgClassName, ...otherImgProps } = props;
            const captionProps = transformProps(attributesToProps(element?.next?.attribs));
            const { className: captionClassName, ...otherCaptionProps } = captionProps;
            const caption = element?.next?.children;

            return caption ? (
              <figure>
                <Component className={clsx('my-0', imgClassName)} {...otherImgProps} />
                <figcaption
                  className={clsx('flex justify-center text-center', captionClassName)}
                  {...otherCaptionProps}
                >
                  {domToReact(caption)}
                </figcaption>
              </figure>
            ) : (
              <Component {...props} />
            );
          }

          if (element.name === 'a' && element.children[0].name === 'img') {
            const linkProps = transformProps(attributesToProps(element?.attribs));
            const { href: linkHref, ...otherLinkProps } = linkProps;
            const imgProps = transformProps(attributesToProps(element?.children[0]?.attribs));
            const { className: imgClassName, ...otherImgProps } = imgProps;
            const captionProps = transformProps(attributesToProps(element?.next?.attribs));
            const { className: captionClassName, ...otherCaptionProps } = captionProps;

            const caption = element?.next?.children;

            const Component = components[element?.children[0]?.name];
            return (
              <figure className="image-with-link">
                <Link to={linkHref} {...otherLinkProps}>
                  <Component className={clsx('my-0', imgClassName)} {...otherImgProps} />
                  {caption && (
                    <figcaption
                      className={clsx('flex justify-center text-center', captionClassName)}
                      {...otherCaptionProps}
                    >
                      {domToReact(caption)}
                    </figcaption>
                  )}
                </Link>
              </figure>
            );
          }
        }

        if (domNode.attribs?.class?.includes('wp-block-embed-twitter')) {
          const props = transformProps(attributesToProps(domNode.attribs));

          const { children } = domNode.children[0];

          children.forEach((child) => {
            if (child.type === 'tag' && child.name === 'blockquote') {
              child.attribs['data-theme'] = 'dark';
            }
          });

          return <EmbedTweet {...props}>{domToReact(children)}</EmbedTweet>;
        }

        if (domNode.attribs?.class?.includes('wp-block-heading')) {
          return AnchorHeading(domNode.name)({
            children: domToReact(domNode.children),
            className: `${domNode.attribs.class}`,
          });
        }

        if (domNode.name === 'video') {
          const props = transformProps(attributesToProps(domNode.attribs));
          const children = domToReact(domNode.children);
          return (
            <video {...props} crossOrigin="anonymous">
              {children}
            </video>
          );
        }

        if (!includeBaseTags) return <></>;
      }
    },
  });
}
