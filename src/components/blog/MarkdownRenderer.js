import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter style={docco} language={language} showLineNumbers>
      {value}
    </SyntaxHighlighter>
  );
};

const MarkdownRenderer = ({ markdown }) => {
  return (
    <ReactMarkdown
      skipHtml={false}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
          ) : (
            <code {...props}>{children}</code>
          );
        },
        a({ node, ...props }) {
          return <a {...props}>{props.children}</a>;
        }        
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
