'use client'

import { useState, useRef, useEffect } from 'react'
import { useGenerateStore } from '@/store/generateStore'
import { Card, Spinner } from '@/components/common'

export default function Chatbot() {
  const { messages, isLoading, sendMessage, clearChat } = useGenerateStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const question = input
    setInput('')
    await sendMessage(question)
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="pb-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">💬 문서 DB 챗봇</h3>
            <p className="text-xs text-gray-400 mt-1">
              문서와 용어에 대해 질문하세요
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <div className="text-4xl">💬</div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                문서에 대해 무엇이든 물어보세요
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>예: "셔터 버튼이 뭐야?"</p>
                <p>예: "노출 설정 방법은?"</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-background-dark'
                      : 'bg-surface-dark text-gray-300'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Sources */}
                  {message.role === 'assistant' && message.sources && (
                    <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
                      <p className="text-xs text-gray-500 font-medium">
                        📚 출처:
                      </p>
                      {message.sources.map((source) => (
                        <div
                          key={source.id}
                          className="text-xs p-2 bg-surface-dark/50 rounded space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              📄 {source.docName}
                            </span>
                            <span className="text-gray-500">
                              Line {source.line}
                            </span>
                          </div>
                          <p className="text-gray-500 italic">
                            "{source.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg p-3 bg-surface-dark">
                  <Spinner size="sm" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문을 입력하세요..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-surface-dark border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-primary text-background-dark font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍
          </button>
        </div>
      </form>
    </Card>
  )
}

