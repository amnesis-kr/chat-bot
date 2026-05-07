챗봇 웹앱을 만들어줘. 아래 요구사항을 따라줘.

## 기술 스택
- Next.js 14 (App Router, 풀스택)
- Tailwind CSS 스타일링
- TypeScript

## AI 연동
- Anthropic Claude API (claude-sonnet-4-20250514) 사용
- Anthropic SDK의 스트리밍 헬퍼로 응답 스트리밍 구현
- API 키는 .env.local 파일에 ANTHROPIC_API_KEY로 저장
- API 라우트: app/api/chat/route.ts

## 기능
- 채팅 UI: 사용자 메시지는 오른쪽, 어시스턴트 메시지는 왼쪽 말풍선
- 실시간 타이핑 효과로 스트리밍 응답 표시
- 대화 히스토리를 React state로 관리하고 매 요청마다 API에 함께 전송
- "새 대화" 버튼으로 대화 초기화
- 최신 메시지로 자동 스크롤
- 스트리밍 중에는 입력창 비활성화

## UX 세부사항
- 입력창: Enter = 전송, Shift+Enter = 줄바꿈
- 첫 토큰 수신 전까지 로딩 인디케이터 표시
- 에러 발생 시 채팅 UI 안에서 친절하게 표시 (앱이 멈추지 않게)

## 프로젝트 구조
Next.js App Router 구조를 따라줘:
- app/page.tsx → 채팅 UI
- app/api/chat/route.ts → 스트리밍 API 라우트
- components/MessageBubble.tsx → 재사용 가능한 메시지 컴포넌트

## 시작 방법
프로젝트 생성 후 의존성 설치 명령어와 로컬 실행 방법을 알려줘.