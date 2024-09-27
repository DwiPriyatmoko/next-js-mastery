'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Form from '@components/Form';

const EditPrompt = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const promptId = searchParams.get('id');

	const [submitting, setSubmitting] = useState(false);
	const [post, setPost] = useState({
		prompt: '',
		tag: '',
	});

	useEffect(() => {
		if (!promptId) return;

		const getPromptDetails = async () => {
			try {
				const response = await fetch(`/api/prompt/${promptId}`);
				if (response.ok) {
					const data = await response.json();
					setPost({
						prompt: data.prompt,
						tag: data.tag,
					});
				} else {
					// Log response detail for debugging
					console.error(
						'Failed to fetch prompt details:',
						response.status,
						response.statusText
					);
				}
			} catch (error) {
				console.error('Error fetching prompt details', error);
			}
		};

		getPromptDetails();
	}, [promptId]);

	const UpdatePrompt = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		if (!promptId) {
			alert('Prompt ID not found');
			setSubmitting(false);
			return;
		}

		try {
			const response = await fetch(`/api/prompt/${promptId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt: post.prompt,
					tag: post.tag,
				}),
			});

			if (response.ok) {
				router.push('/');
			} else {
				// Provide detailed error information
				console.error(
					'Failed to update prompt:',
					response.status,
					response.statusText
				);
			}
		} catch (error) {
			console.error('Error updating prompt', error);
		} finally {
			setSubmitting(false);
		}
	};
	return (
		<Form
			type="Edit"
			post={post}
			setPost={setPost}
			submitting={submitting}
			handleSubmit={UpdatePrompt}
		/>
	);
};

export default EditPrompt;
