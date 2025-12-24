<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { chatAPI, type Message } from '$lib/api/chat';
	import { sessionStore } from '$lib/stores/session';

	let isOpen = false;
	let messages: Message[] = [];
	let inputMessage = '';
	let isTyping = false;
	let error: string | null = null;
	let messagesContainer: HTMLDivElement;
	let sessionId: string | null = null;

	// Subscribe to session store
	sessionStore.subscribe((value) => {
		sessionId = value;
	});

	onMount(async () => {
		await initializeSession();
	});

	async function initializeSession() {
		try {
			if (!sessionId) {
				// Create new session
				const response = await chatAPI.createSession();
				sessionId = response.data.sessionId;
				sessionStore.set(sessionId);
			} else {
				// Load existing chat history
				const history = await chatAPI.getChatHistory(sessionId);
				messages = history.data.messages;
				await scrollToBottom();
			}
		} catch (err: any) {
			error = 'Failed to initialize chat session';
			console.error(err);
		}
	}

	function toggleChat() {
		isOpen = !isOpen;
		if (isOpen) {
			setTimeout(() => scrollToBottom(), 100);
		}
	}

	async function scrollToBottom() {
		await tick();
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	async function sendMessage() {
		if (!inputMessage.trim() || !sessionId || isTyping) return;

		const userMessage = inputMessage.trim();
		inputMessage = '';
		error = null;

		// Add user message to UI immediately
		const tempUserMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: userMessage,
			createdAt: new Date().toISOString()
		};
		messages = [...messages, tempUserMessage];
		await scrollToBottom();

		// Show typing indicator
		isTyping = true;

		try {
			const response = await chatAPI.sendMessage(sessionId, userMessage);

			// Add AI response
			const aiMessage: Message = {
				id: response.data.messageId,
				role: 'assistant',
				content: response.data.reply,
				createdAt: new Date().toISOString()
			};
			messages = [...messages, aiMessage];
			await scrollToBottom();
		} catch (err: any) {
			error = err.message || 'Failed to send message';
			console.error(err);
			// Remove the user message if sending failed
			messages = messages.filter((m) => m.id !== tempUserMessage.id);
		} finally {
			isTyping = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function formatTime(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
	}
</script>

<!-- Chat Button -->
{#if !isOpen}
	<button
		on:click={toggleChat}
		class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-50"
		aria-label="Open chat"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
			/>
		</svg>
	</button>
{/if}

<!-- Chat Widget -->
{#if isOpen}
	<div
		class="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-slideIn"
	>
		<!-- Header -->
		<div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
				<h3 class="font-semibold">AI Assistant</h3>
			</div>
			<button
				on:click={toggleChat}
				class="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
				aria-label="Close chat"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		<!-- Messages -->
		<div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
			{#if messages.length === 0 && !isTyping}
				<div class="text-center text-gray-500 mt-20">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-16 w-16 mx-auto mb-4 text-gray-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
					<p class="text-sm">Start a conversation!</p>
					<p class="text-xs mt-1">Ask me anything</p>
				</div>
			{/if}

			{#each messages as message}
				<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[80%] rounded-lg p-3 {message.role === 'user'
							? 'bg-blue-600 text-white'
							: 'bg-white border border-gray-200 text-gray-800'}"
					>
						<p class="text-sm whitespace-pre-wrap break-words">{message.content}</p>
						<p
							class="text-xs mt-1 {message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}"
						>
							{formatTime(message.createdAt)}
						</p>
					</div>
				</div>
			{/each}

			{#if isTyping}
				<div class="flex justify-start">
					<div class="bg-white border border-gray-200 rounded-lg p-3">
						<div class="flex space-x-2">
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]">
							</div>
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]">
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
					<p class="font-semibold">Error</p>
					<p>{error}</p>
				</div>
			{/if}
		</div>

		<!-- Input -->
		<div class="p-4 border-t border-gray-200 bg-white rounded-b-lg">
			<div class="flex space-x-2">
				<input
					type="text"
					bind:value={inputMessage}
					on:keypress={handleKeyPress}
					disabled={isTyping}
					placeholder="Type your message..."
					class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
				/>
				<button
					on:click={sendMessage}
					disabled={!inputMessage.trim() || isTyping}
					class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
					aria-label="Send message"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slideIn {
		animation: slideIn 0.3s ease-out;
	}
</style>
