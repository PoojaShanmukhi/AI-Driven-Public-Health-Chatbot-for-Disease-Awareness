import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-teal-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer" />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc pl-5 my-2 space-y-1" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal pl-5 my-2 space-y-1" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="my-0.5" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-semibold text-slate-900" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-lg font-bold mt-4 mb-2 text-slate-800" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
