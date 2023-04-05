import Head from 'next/head'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import { useState } from 'react';
import { UserButton } from "@clerk/nextjs";
import ReactMarkdown from 'react-markdown';

import styles from '@/styles/Chat.module.css'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'

function NavBar() {
  return (
    <div className={styles.navbar}>
      <div>GPT UI</div>
      <UserButton />
    </div>
  );
}

type ChatMessage = {
  content: string;
  role: "user" | "assistant";
}

export default function Chat() {
 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const fetchCompletion = async (oldMessages: ChatMessage[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(oldMessages),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newMessages = await response.json();
    setMessages([...oldMessages, ...newMessages]);
    setWaitingForResponse(false);
  };

  const onSend = async (innerHtml: string, textContent: string, innerText: string, nodes: NodeList) => {
    setWaitingForResponse(true);
    const newMessages: ChatMessage[] = [...messages, {role: "user", content: textContent}];
    setMessages(newMessages);
    await fetchCompletion(newMessages);
  }


  type MarkdownProps = {
    content: string
  }
  const MarkDown = ({ content }: MarkdownProps) => {
    return (
      <ReactMarkdown
        children={content} //eslint-disable-line
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')} //eslint-disable-line
                language={match[1]}
                PreTag="div"
                {...props}
                style={solarizedlight}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      />
    )
  } 


  return (
    <>
      <Head>
        <title>GPT UI</title>
        <meta name="description" content="Like Chat GPT but cheaper" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <NavBar />
        <MainContainer>
          <ChatContainer>       
            <MessageList>
              {messages.map((msg: ChatMessage, index) => (
                <Message key={index} model={{
                  type: "custom",
                  direction: msg.role === "assistant" ? "incoming" : "outgoing",
                  position: "single",
                  }}>
                    <Message.CustomContent>
                      <MarkDown content={msg.content} />
                    </Message.CustomContent>
                  </Message>
              ))}
            </MessageList>
            <MessageInput
              attachButton={false}
              sendButton={true}
              placeholder="What would you like to know?"
              onSend={onSend}
              sendDisabled={waitingForResponse}
              sendOnReturnDisabled={waitingForResponse}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  )
}
