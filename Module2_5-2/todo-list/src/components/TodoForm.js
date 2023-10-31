import React, { useState, useEffect, useRef } from 'react';

const TodoForm = (props) => {
	const [todoText, setTodoText] = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();

		fetch('http://localhost:3003/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				if (loadedTodos.length > 0) {
					setTodoText(loadedTodos[0].text);
				}
			});
	}, []);

	const handleChange = (e) => {
		setTodoText(e.target.value);
	};

	console.log(props.todos);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (props.edit) {
			props.onSubmit({
				id: props.edit.id,
				text: todoText,
			});
		} else {
			props.onSubmit({
				id: Math.floor(Math.random() * 10000),
				text: todoText,
			});
		}

		setTodoText('');
	};

	// const debouncedSearch = debounce((searchTerm) => {
	// 	handleSearch(searchTerm);
	// }, 300);

	return (
		<div className="todo-form">
			<form onSubmit={handleSubmit}>
				{props.edit ? (
					<>
						<input
							placeholder="Измените задачу"
							value={todoText}
							onChange={handleChange}
							name="text"
							ref={inputRef}
							className="todo-input edit"
						/>
						<button onClick={handleSubmit} className="todo-button edit">
							Обновить
						</button>
					</>
				) : (
					<>
						<input
							placeholder="Добавьте задачу"
							value={todoText}
							onChange={handleChange}
							name="text"
							className="todo-input"
							ref={inputRef}
						/>
						<button onClick={handleSubmit} className="todo-button">
							Добавить
						</button>
					</>
				)}
			</form>
			<input
				type="text"
				placeholder="Поиск"
				value={props.searchTerm}
				onChange={(e) => props.setSearchTerm(e.target.value)}
			/>
			<button onClick={() => props.onSearch(props.searchTerm)}>Искать</button>
			<button
				onClick={() => {
					props.setSearchTerm('');
					props.handleResetSearch();
				}}
			>
				Сбросить
			</button>
		</div>
	);
};

export default TodoForm;
