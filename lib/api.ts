export async function generateReport(text: string) {
  try {
    const response = await fetch("/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate report")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in generateReport:", error)
    throw error
  }
}
