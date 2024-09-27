'use client';
import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
	return (
		<div className="mt-16 prompt_layout">
			{data.map((post) => (
				<PromptCard
					key={post._id}
					post={post}
					handleTagClick={handleTagClick}
				/>
			))}
		</div>
	);
};

const Feed = () => {
	const [searchText, setSearchText] = useState('');
	const [posts, setPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);

	const handleSearchChange = (e) => {
		const searchTerm = e.target.value;
		setSearchText(searchTerm);
		filterPosts(searchTerm);
	};

	const handleTagClick = (tag) => {
		setSearchText(tag);
		filterPosts(tag);
	};

	const filterPosts = (searchTerm) => {
		const searchTextLower = searchTerm.toLowerCase();
		const filtered = posts.filter((post) => {
			const postContentMatch = post.content
				?.toLowerCase()
				.includes(searchTextLower);
			const tagsMatch = post.tags?.some((tag) =>
				tag.toLowerCase().includes(searchTextLower)
			);
			const usernameMatch = post.username
				?.toLowerCase()
				.includes(searchTextLower);
			return postContentMatch || tagsMatch || usernameMatch;
		});
		setFilteredPosts(filtered);
	};

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch('/api/prompt');
			const data = await response.json();
			setPosts(data);
			setFilteredPosts(data); // Initialize filteredPosts with all posts
		};

		fetchPosts();
	}, []);

	return (
		<section className="feed">
			<form className="relative w-full flex-center">
				<input
					type="text"
					placeholder="Search for a tag, username, or prompt"
					value={searchText}
					onChange={handleSearchChange}
					required
					className="search_input peer"
				/>
			</form>
			<PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
		</section>
	);
};

export default Feed;
