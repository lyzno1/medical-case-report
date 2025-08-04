# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` or `pnpm dev`
- **Build for production**: `npm run build` or `pnpm build`
- **Start production server**: `npm run start` or `pnpm start`
- **Lint code**: `npm run lint` or `pnpm lint`

## Architecture Overview

This is a Next.js 15 medical case report generator that integrates with Coze AI platform for automated report generation from medical documents and audio files.

### Core Components
- **ReportGenerator** (`components/report-generator.tsx`): Main orchestrator component managing the report generation workflow
- **UploadInterface** (`components/upload-interface.tsx`): Handles file uploads (DOCX templates, MP3 audio files)
- **ReportDisplay** (`components/report-display.tsx`): Displays generated reports with download functionality

### API Architecture
- **`/api/generate-report`**: Main endpoint that orchestrates file upload to Coze, workflow execution, and report generation
- **`/api/download-report`**: Handles report download as Word documents
- **`/api/transcribe`**: Audio transcription endpoint
- **`/api/test-coze`**: Testing endpoint for Coze API integration

### Key Libraries & Integrations
- **Coze AI Platform**: Uses `CozeClient` for file uploads and workflow execution via `https://api.coze.cn/v1` API
- **shadcn/ui**: UI component library built on Radix UI primitives
- **Tailwind CSS**: Styling framework
- **React Hook Form + Zod**: Form handling and validation

### Environment Configuration
Required environment variables (set in `.env.local`):
```bash
COZE_API_KEY=your_personal_access_token
COZE_BOT_ID=7507807163864219688
COZE_SPACE_ID=your_space_id
COZE_WORKFLOW_ID=your_workflow_id
NODE_ENV=development
```

### Coze Workflow Integration
- **Audio Parameter**: `BLaudio` (Audio type) - for MP3/audio files
- **Document Parameter**: `BLtemplate` (Doc type) - for DOCX template files
- Files are uploaded to Coze platform first, then file IDs are passed as JSON strings to workflow parameters
- Workflow execution uses retry mechanism with exponential backoff

### File Processing
- **Supported audio formats**: MP3, WAV, M4A (max 50MB)
- **Supported document formats**: DOCX, DOC (max 10MB)
- Files are validated on both client and server sides
- Error handling includes detailed debugging information

### Configuration Files
- **`lib/config.ts`**: Central configuration with validation for Coze API settings
- **`lib/coze-client.ts`**: Coze API client with file upload and workflow execution
- **`lib/debug-utils.ts`**: Debugging utilities for development
- **`next.config.mjs`**: Next.js configuration with build optimizations disabled for development

### Development Notes
- ESLint and TypeScript errors are ignored during builds (configured in `next.config.mjs`)
- Uses pnpm for package management
- Extensive logging for debugging Coze API interactions
- Mobile-responsive design with Tailwind breakpoints