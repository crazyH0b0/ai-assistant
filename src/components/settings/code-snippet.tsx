'use client';

import React from 'react';
import { useToast } from '../ui/use-toast';
import Section from '../section-label';
import { Copy } from 'lucide-react';

interface Props {
  id: string;
}
const CodeSnippet = ({ id }: Props) => {
  const { toast } = useToast();
  let snippet = `
    const iframe = document.createElement("iframe");
    
    const iframeStyles = (styleString) => {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
    }
    
    iframeStyles('
        .chat-frame {
            position: fixed;
            bottom: 50px;
            right: 50px;
            border: none;
            }
            ')
            
          
    iframe.src = "https://ai-assistant-pts3.vercel.app/chatbot"

    iframe.classList.add('chat-frame')
    document.body.appendChild(iframe)
    
    window.addEventListener("message", (e) => {
        if(e.origin !== "https://ai-assistant-pts3.vercel.app") return null
        let dimensions = JSON.parse(e.data)
        iframe.width = dimensions.width
        iframe.height = dimensions.height
        iframe.contentWindow.postMessage("${id}", "https://ai-assistant-pts3.vercel.app/")
    })`;
  // process.env.PRO_URL
  return (
    <div className="mt-10 flex flex-col gap-5 items-start">
      <Section
        label="复制代码"
        message="把该段代码复制到第三方网站的 header 标签中 (注意：部分编辑器报错需要手动添加“``”（反引号）)"
      />
      <div className="bg-cream px-10 rounded-lg inline-block relative">
        <Copy
          className="absolute top-5 right-5 text-gray-400 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(snippet);
            toast({
              title: '已复制到粘贴板',
              description: '你现在可以将该代码粘贴到你的网站中',
            });
          }}
        />
        <pre>
          <code className="text-gray-500">{snippet}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeSnippet;
