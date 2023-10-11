/* eslint-disable no-case-declarations */
import parse, { attributesToProps, domToReact } from 'html-react-parser';
import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import Image from 'next/image';

import EmbedTweet from 'components/shared/embed-tweet';

import AnchorHeading from '../components/shared/anchor-heading';

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
    const urlWithoutSize = props.src.replace(/-\d+x\d+/i, '');

    return (
      <Image
        className="rounded-md"
        src={urlWithoutSize}
        width={props.width || 975}
        height={props.height || 512}
        quality={85}
        alt={props.alt || 'Post image'}
        priority={props.isPriority || false}
        sizes="(max-width: 767px) 100vw"
      />
    );
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
        if (
          domNode.attribs?.class?.includes('wp-block-lazyblock') ||
          domNode.attribs?.class?.includes('wp-block-image')
        ) {
          const element =
            domNode.children[0].type === 'tag' ? domNode.children[0] : domNode.children[1];

          const Component = components[element.name];
          if (!Component) return <></>;

          if (
            domNode.attribs?.class?.includes('wp-block-image') &&
            domNode.children[0].name === 'img'
          ) {
            const isPriority = isFirstImage;
            isFirstImage = false;
            const props = transformProps(attributesToProps({ ...element.attribs, isPriority }));
            return <Component {...props} />;
          }

          const props = transformProps(attributesToProps(element.attribs));

          return <Component {...props} />;
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
            className: `${domNode.attribs.class} scroll-mt-20 lg:scroll-mt-5`,
          });
        }

        if (!includeBaseTags) return <></>;
      }
    },
  });
}
