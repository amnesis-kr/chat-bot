# PDF 기반 업무 어시스턴트 챗봇

## 프로젝트 개요

PDF 문서를 읽고 사용자 질문에 답변하는 챗봇 웹앱. Vercel에 배포.

## 기술 스택

- **서버**: Node.js + Express
- **프론트엔드**: HTML / CSS / JavaScript
- **AI**: Claude API (Anthropic) — `claude-haiku-4-5` 모델
- **배포**: Vercel

## 프로젝트 구조

```
my-pdf-chatbot/
├── docs/          # PDF 문서 보관 폴더
├── public/        # 프론트엔드 정적 파일 (HTML, CSS, JS)
├── server.js      # Express 서버 진입점
├── .env           # 환경변수 (Git 추가 금지)
├── .gitignore
└── CLAUDE.md
```

## 환경변수

`.env` 파일에 아래 항목을 설정한다. 이 파일은 절대 Git에 추가하지 않는다.

```
ANTHROPIC_API_KEY=your_api_key_here
```

## 핵심 규칙

- `.env` 파일은 절대 수정하거나 Git에 커밋하지 않는다.
- API 키는 서버(Express)에서만 처리한다. 프론트엔드 코드에 노출하지 않는다.
- PDF 파일은 반드시 `docs/` 폴더에 보관한다.
- 모든 주석은 한국어로 작성한다.

## 로컬 실행

```bash
npm install
node server.js
```

## 배포 (Vercel)

```bash
vercel deploy
```

Vercel 환경변수 설정에서 `ANTHROPIC_API_KEY`를 별도로 등록해야 한다.
