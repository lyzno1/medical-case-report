import { ReportGenerator } from "@/components/report-generator"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 px-4">
          病例报告生成器
        </h1>
        <ReportGenerator />
      </div>
    </main>
  )
}
