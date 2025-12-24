<script lang="ts">
	// This is a demo page to show the chat widget in action
</script>

<svelte:head>
	<title>AI Chat Agent</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
	<div class="max-w-4xl mx-auto">
		<div class="bg-white rounded-lg shadow-xl p-8">
			<h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to AI Chat Agent</h1>
			<p class="text-lg text-gray-600 mb-6">
				This is a full-stack AI chat application built with SvelteKit, Express, Prisma, and Google
				Gemini AI.
			</p>

			<div class="space-y-4">
				<div class="bg-blue-50 border-l-4 border-blue-500 p-4">
					<h2 class="text-xl font-semibold text-blue-800 mb-2">Features:</h2>
					<ul class="list-disc list-inside text-gray-700 space-y-1">
						<li>Floating chat widget in the bottom-right corner</li>
						<li>Persistent conversation history</li>
						<li>Real-time typing indicators</li>
						<li>Auto-scrolling messages</li>
						<li>Error handling with user-friendly messages</li>
						<li>Session management with localStorage</li>
					</ul>
				</div>

				<div class="bg-green-50 border-l-4 border-green-500 p-4">
					<h2 class="text-xl font-semibold text-green-800 mb-2">How to use:</h2>
					<ol class="list-decimal list-inside text-gray-700 space-y-1">
						<li>Click the chat button in the bottom-right corner</li>
						<li>Type your message and press Enter or click Send</li>
						<li>Wait for the AI to respond</li>
						<li>Continue the conversation naturally</li>
					</ol>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
					<h2 class="text-xl font-semibold text-yellow-800 mb-2">Tech Stack:</h2>
					<div class="grid grid-cols-2 gap-4 text-gray-700 mt-2">
						<div>
							<h3 class="font-semibold">Frontend:</h3>
							<ul class="list-disc list-inside ml-4">
								<li>SvelteKit</li>
								<li>Tailwind CSS</li>
								<li>TypeScript</li>
							</ul>
						</div>
						<div>
							<h3 class="font-semibold">Backend:</h3>
							<ul class="list-disc list-inside ml-4">
								<li>Express.js</li>
								<li>Prisma ORM</li>
								<li>Google Gemini AI</li>
								<li>PostgreSQL</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
