import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';
import { Check, Copy } from 'lucide-react';
import mermaid from 'mermaid';
import { Lightbox } from './Lightbox';

interface MarkdownRendererProps {
  markdown: string;
}

interface LightboxState {
  isOpen: boolean;
  content: {
    type: 'image' | 'mermaid';
    data: string;
    alt?: string;
  } | null;
  originRect: DOMRect | null;
}

const MermaidDiagram = ({ chart, onZoom }: { chart: string; onZoom: (svg: string, rect: DOMRect) => void }) => {
  const [svg, setSvg] = useState('');
  const id = useMemo(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Mermaid rendering failed:', error);
        setSvg(`<div class="text-red-500 text-sm p-2 border border-red-500/20 rounded bg-red-500/10">Mermaid Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`);
      }
    };

    renderChart();
  }, [chart, id]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onZoom(svg, rect);
  };

  return (
    <div
      className="mermaid-diagram my-8 flex justify-center overflow-x-auto bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm cursor-zoom-in transition-all hover:shadow-md"
      dangerouslySetInnerHTML={{ __html: svg }}
      onClick={handleClick}
    />
  );
};

const CodeBlock = ({ language, children, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-lg border border-white/5">
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-4">
          {language && (
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            title="Copy code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="!m-0 !p-0 !bg-transparent !shadow-none">
          <code className={`${className} !bg-transparent !p-0 font-mono text-sm`} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    content: null,
    originRect: null,
  });

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setLightbox({
      isOpen: true,
      content: {
        type: 'image',
        data: img.src,
        alt: img.alt,
      },
      originRect: img.getBoundingClientRect(),
    });
  };

  const handleMermaidZoom = (svg: string, rect: DOMRect) => {
    setLightbox({
      isOpen: true,
      content: {
        type: 'mermaid',
        data: svg,
      },
      originRect: rect,
    });
  };

  return (
    <>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex]}
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                className="cursor-zoom-in"
                onClick={handleImageClick}
              />
            ),
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : '';
              
              if (!inline && language === 'mermaid') {
                return <MermaidDiagram chart={String(children).replace(/\n$/, '')} onZoom={handleMermaidZoom} />;
              }

              return !inline && match ? (
                <CodeBlock language={language} className={className} {...props}>
                  {children}
                </CodeBlock>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
        content={lightbox.content}
        originRect={lightbox.originRect}
      />
    </>
  );
};

export default MarkdownRenderer;