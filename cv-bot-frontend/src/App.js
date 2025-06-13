import React, { useState } from "react";
import {
	Sparkles,
	FileText,
	Briefcase,
	ChevronRight,
	Loader2,
} from "lucide-react";
// Import marked for markdown rendering
import { marked } from "marked";

// Main App component
const App = () => {
	const [cvText, setCvText] = useState("");
	const [jobDescriptionText, setJobDescriptionText] = useState("");
	const [analysisResult, setAnalysisResult] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// Function to handle the analysis request
	const handleAnalyze = async () => {
		setError("");
		setAnalysisResult("");
		setIsLoading(true);

		try {
			// IMPORTANT: Ensure your Spring Boot backend is running on this URL.
			// If your backend is on a different port or host, update this URL.
			const response = await fetch("http://localhost:8080/api/cv/analyze", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ cvText, jobDescriptionText }),
			});

			if (!response.ok) {
				// Attempt to read error message from backend
				const errorText = await response.text();
				throw new Error(
					`HTTP error! Status: ${response.status}. Message: ${errorText}`
				);
			}

			const result = await response.text(); // Assuming the backend returns plain text/markdown
			setAnalysisResult(result);
		} catch (err) {
			console.error("Failed to fetch:", err);
			setError(
				`Failed to get analysis: ${err.message}. Please ensure your backend is running.`
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Component to safely render Markdown content
	// Uses 'marked' library to convert markdown to HTML
	const MarkdownRenderer = ({ content }) => {
		// marked.parse will convert the markdown string into HTML
		const htmlContent = marked.parse(content);
		return (
			// dangerouslySetInnerHTML is used here because the content is coming from
			// a trusted source (your own backend which calls Gemini API).
			// For untrusted sources, always sanitize HTML before using dangerouslySetInnerHTML.
			<div
				className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-800"
				dangerouslySetInnerHTML={{ __html: htmlContent }}
			/>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 font-inter">
			<div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-6 md:p-8 lg:p-10 my-8">
				<h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
					<Sparkles className="text-purple-600 w-8 h-8 md:w-10 md:h-10" /> AI CV
					Analyzer
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* CV Input Textarea */}
					<div className="flex flex-col">
						<label
							htmlFor="cvText"
							className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"
						>
							<FileText className="w-5 h-5 text-indigo-500" /> Your CV Details
						</label>
						<textarea
							id="cvText"
							className="w-full h-40 md:h-60 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition duration-200 resize-y text-gray-800 shadow-sm"
							placeholder="Paste your CV text here (e.g., 'Spring Boot developer with 2 years experience in building REST APIs...')"
							value={cvText}
							onChange={(e) => setCvText(e.target.value)}
						></textarea>
					</div>

					{/* Job Description Input Textarea */}
					<div className="flex flex-col">
						<label
							htmlFor="jobDescriptionText"
							className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"
						>
							<Briefcase className="w-5 h-5 text-purple-500" /> Job Description
						</label>
						<textarea
							id="jobDescriptionText"
							className="w-full h-40 md:h-60 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition duration-200 resize-y text-gray-800 shadow-sm"
							placeholder="Paste the job description here (e.g., 'Looking for a backend developer experienced in Spring Boot, AWS, microservices, and cloud infrastructure.')"
							value={jobDescriptionText}
							onChange={(e) => setJobDescriptionText(e.target.value)}
						></textarea>
					</div>
				</div>

				{/* Analyze Button */}
				<div className="flex justify-center mb-10">
					<button
						onClick={handleAnalyze}
						disabled={isLoading || !cvText || !jobDescriptionText} // Disable button if loading or inputs are empty
						className={`
              px-8 py-3 text-lg font-bold rounded-full shadow-lg transition-all duration-300
              flex items-center gap-2
              ${
								isLoading
									? "bg-gray-400 text-gray-700 cursor-not-allowed" // Styling when disabled/loading
									: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 active:scale-95" // Styling when active
							}
            `}
						aria-label="Analyze CV and Job Description"
					>
						{isLoading ? (
							<>
								<Loader2 className="animate-spin" aria-hidden="true" />{" "}
								Analyzing...
							</>
						) : (
							<>
								Analyze My CV{" "}
								<ChevronRight className="w-5 h-5" aria-hidden="true" />
							</>
						)}
					</button>
				</div>

				{/* Error Display Area */}
				{error && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6"
						role="alert"
					>
						<strong className="font-bold">Error!</strong>
						<span className="block sm:inline ml-2">{error}</span>
					</div>
				)}

				{/* Analysis Result Display Area */}
				{analysisResult && (
					<div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
						<h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
							<Sparkles className="text-green-500 w-6 h-6" aria-hidden="true" />{" "}
							Analysis Results
						</h2>
						{/* Render the markdown content */}
						<MarkdownRenderer content={analysisResult} />
					</div>
				)}
			</div>
			{/* Footer */}
			<footer className="text-center text-gray-600 text-sm mt-8 pb-4">
				Crafting futures ~ Arkam Ahamed 🚀
			</footer>
		</div>
	);
};

export default App;
