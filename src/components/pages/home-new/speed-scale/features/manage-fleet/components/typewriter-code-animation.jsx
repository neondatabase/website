import clsx from 'clsx';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const TypewriterCodeAnimation = ({ targetText, codeClassName, isActive, duration }) => {
  const parsedContent = useMemo(() => {
    const preElement = targetText;
    const codeElement = preElement.props.children;

    if (!codeElement || !codeElement.props.children) {
      return { lines: [], totalWords: 0, preProps: {}, codeProps: {} };
    }

    const lines = [];
    let wordCount = 0;

    // Get all line spans from code element
    const lineElements = Array.isArray(codeElement.props.children)
      ? codeElement.props.children
      : [codeElement.props.children];

    // Process each line span
    lineElements.forEach((lineElement) => {
      if (!lineElement || !lineElement.props) return;

      const lineData = {
        dataLine: lineElement.props['data-line'],
        className: lineElement.props.className,
        tokens: [],
      };

      // Get all token spans from line
      const tokenElements = Array.isArray(lineElement.props.children)
        ? lineElement.props.children
        : [lineElement.props.children];

      // Process each token span
      tokenElements.forEach((tokenElement) => {
        if (!tokenElement || !tokenElement.props) return;

        const { children: text, style } = tokenElement.props;

        // Check if token contains letters (is a word)
        const hasLetters = /[a-zA-Z]/.test(text);

        lineData.tokens.push({
          text,
          style,
          wordIndex: wordCount,
        });
        if (hasLetters) {
          wordCount += 1;
        }
      });

      lines.push(lineData);
    });

    return {
      lines,
      totalWords: wordCount,
      preProps: {
        className: preElement.props.className,
        style: preElement.props.style,
        tabIndex: preElement.props.tabIndex,
        'data-language': preElement.props['data-language'],
      },
      codeProps: {
        className: clsx(codeClassName, codeElement.props.className),
      },
    };
  }, [targetText, codeClassName]);

  // Calculate delay per word based on duration
  const delayPerWord = duration / parsedContent.totalWords;

  return (
    <pre {...parsedContent.preProps}>
      <code
        {...parsedContent.codeProps}
        style={{
          '--shiki-token-keyword': 'white',
          '--shiki-token-function': 'white',
          '--shiki-foreground': '#34D59A',
          '--shiki-token-constant': '#FFA574',
        }}
      >
        {parsedContent.lines.map((line, lineIndex) => (
          <span key={`line-${line.dataLine || lineIndex}`} data-line={line.dataLine}>
            {line.tokens.map((token, tokenIndex) => (
              <m.span
                key={`${lineIndex}-${tokenIndex}-${token.wordIndex}`}
                style={token.style}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  duration: 0.1,
                  delay: isActive ? token.wordIndex * delayPerWord : 0,
                }}
              >
                {token.text}
              </m.span>
            ))}
          </span>
        ))}
      </code>
    </pre>
  );
};

TypewriterCodeAnimation.propTypes = {
  targetText: PropTypes.node.isRequired,
  codeClassName: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
};

export default TypewriterCodeAnimation;
