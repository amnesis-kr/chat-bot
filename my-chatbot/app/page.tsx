"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "@/components/MessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("응답 오류");
      setIsLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
              법
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">한국노무법인</div>
              <div className="text-xs text-gray-500">Korea Labor Law Firm</div>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-gray-600 font-medium">
            <a href="#about" className="hover:text-blue-700 transition-colors">사무소 소개</a>
            <a href="#services" className="hover:text-blue-700 transition-colors">업무 분야</a>
            <a href="#team" className="hover:text-blue-700 transition-colors">노무사 소개</a>
            <a href="#contact" className="hover:text-blue-700 transition-colors">상담 신청</a>
          </nav>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            AI 법률 상담
          </button>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-200 text-sm font-medium mb-3 tracking-widest uppercase">전문 노무사 상담</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            근로자의 권리를<br />확실하게 지켜드립니다
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            20년 경력의 공인 노무사가 부당해고, 임금체불, 산재보상 등<br />
            모든 노동법 문제를 신속하게 해결해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-blue-800 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              AI 근로기준법 상담 시작
            </button>
            <a
              href="#contact"
              className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              전문가 직접 상담
            </a>
          </div>
        </div>
      </section>

      {/* 주요 지표 */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "20년+", label: "업무 경력" },
            { num: "3,000+", label: "상담 해결 건" },
            { num: "98%", label: "고객 만족도" },
            { num: "24시간", label: "AI 상담 가능" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-3xl font-bold text-blue-700 mb-1">{item.num}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 업무 분야 */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">업무 분야</h2>
          <p className="text-center text-gray-500 mb-12 text-sm">다양한 노동법 분야에서 전문적인 서비스를 제공합니다</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "⚖️", title: "부당해고 구제", desc: "억울한 해고에 맞서 복직 또는 손해배상을 받을 수 있도록 도와드립니다." },
              { icon: "💰", title: "임금체불 해결", desc: "밀린 임금, 퇴직금, 연장근로수당 등 미지급 금품을 받을 수 있도록 지원합니다." },
              { icon: "🏥", title: "산재보상 신청", desc: "업무상 재해로 인한 상해·질병에 대해 산업재해보상 절차를 대행합니다." },
              { icon: "📋", title: "취업규칙 작성", desc: "법적 요건에 맞는 취업규칙, 근로계약서, 사규 작성을 지원합니다." },
              { icon: "🤝", title: "노사관계 컨설팅", desc: "노사 분쟁 예방 및 원만한 노사관계 형성을 위한 전략을 제시합니다." },
              { icon: "📊", title: "임금체계 설계", desc: "최저임금, 통상임금, 연장근로 등 적법한 임금체계 설계를 도와드립니다." },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI 상담 배너 */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">AI 근로기준법 상담</h2>
          <p className="text-gray-600 mb-6">
            근로기준법 전문을 학습한 AI가 24시간 즉시 답변해드립니다.<br />
            연장근로, 연차휴가, 해고 요건 등 궁금한 것을 물어보세요.
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            지금 바로 상담하기
          </button>
        </div>
      </section>

      {/* 노무사 소개 */}
      <section id="team" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">노무사 소개</h2>
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center text-6xl flex-shrink-0">
              👨‍💼
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">김노무 공인노무사</h3>
              <p className="text-blue-700 text-sm font-medium mb-4">대표 노무사 · 공인노무사 제12345호</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 고용노동부 근로감독관 출신 (10년 경력)</li>
                <li>• 한국공인노무사회 정회원</li>
                <li>• 부당해고 구제 승소율 94%</li>
                <li>• 중소기업 노무 컨설팅 500개사 이상</li>
                <li>• 저서: 「근로자를 위한 노동법 가이드」</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 상담 신청 */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">전문가 상담 신청</h2>
          <p className="text-center text-gray-500 text-sm mb-10">접수 후 1영업일 이내 연락드립니다</p>
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">성함</label>
                <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="홍길동" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input type="tel" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="010-0000-0000" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">상담 분야</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>부당해고 구제</option>
                <option>임금체불 해결</option>
                <option>산재보상 신청</option>
                <option>취업규칙 작성</option>
                <option>기타</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">상담 내용</label>
              <textarea rows={4} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" placeholder="상담하실 내용을 간략히 적어주세요." />
            </div>
            <button className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors">
              상담 신청하기
            </button>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>📞 대표전화: 02-1234-5678 | 평일 09:00 ~ 18:00</p>
            <p className="mt-1">📍 서울특별시 강남구 테헤란로 123 노무빌딩 5층</p>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-sm">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-semibold text-white mb-2">한국노무법인</p>
          <p>대표 공인노무사: 김노무 | 사업자등록번호: 123-45-67890</p>
          <p className="mt-1">서울특별시 강남구 테헤란로 123 노무빌딩 5층 | 02-1234-5678</p>
          <p className="mt-4 text-xs text-gray-600">© 2025 한국노무법인. All rights reserved.</p>
        </div>
      </footer>

      {/* 플로팅 채팅 버튼 */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-700 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-800 transition-colors z-50"
          title="AI 근로기준법 상담"
        >
          💬
        </button>
      )}

      {/* 챗봇 패널 */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* 채팅 헤더 */}
          <div className="bg-blue-700 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">⚖️</div>
              <div>
                <div className="font-semibold text-sm">AI 근로기준법 상담</div>
                <div className="text-xs text-blue-200">근로기준법 전문 기반 답변</div>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/70 hover:text-white text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {messages.length === 0 && (
              <div className="text-center mt-8">
                <div className="text-4xl mb-3">⚖️</div>
                <p className="text-gray-500 text-sm font-medium">근로기준법 AI 상담사</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">궁금한 노동법 문제를 물어보세요</p>
                <div className="space-y-2">
                  {["연장근로 한도가 어떻게 되나요?", "연차휴가는 언제 발생하나요?", "부당해고 기준이 뭔가요?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="block w-full text-left text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력창 */}
          <div className="border-t px-3 py-3 flex gap-2">
            <textarea
              className="flex-1 resize-none border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
              rows={1}
              placeholder="질문을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="bg-blue-700 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
