import React, { useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { debounce } from 'lodash';

export const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [sortAlphabetically, setSortAlphabetically] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [initialTodos, setInitialTodos] = useState([]);

	const requestAddTodo = (todo) => {
		if (!todo.text || /^\s*$/.test(todo.text)) {
			return;
		}

		fetch('http://localhost:3003/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(todo),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Ошибка при добавлении задачи');
				}
				return response.json();
			})
			.then((data) => {
				setTodos([...todos, data]);
				setInitialTodos([...initialTodos, data]);
			})
			.catch((error) => {
				console.error('Ошибка:', error);
			});
	};

	const requestUpdateTodo = (todoId, newValue) => {
		if (!newValue.text || /^\s*$/.test(newValue.text)) {
			return;
		}

		fetch(`http://localhost:3003/todos/${todoId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(newValue),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Ошибка при обновлении задачи');
				}
				return response.json();
			})
			.then((data) => {
				setTodos((prevTodos) =>
					prevTodos.map((todo) => (todo.id === todoId ? data : todo)),
				);
			})
			.catch((error) => {
				console.error('Ошибка:', error);
			});
	};

	const requestRemoveTodo = (id) => {
		fetch(`http://localhost:3003/todos/${id}`, {
			method: 'DELETE',
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Ошибка при удалении задачи');
				}
			})
			.then(() => {
				setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
			})
			.catch((error) => {
				console.error('Ошибка:', error);
			});
	};

	const debouncedSearch = debounce((searchTerm) => {
		handleSearch(searchTerm);
	}, 300);

	const handleSearch = () => {
		const filteredTodos = todos.filter((todo) => {
			if (searchTerm) {
				return todo.text.toLowerCase().includes(searchTerm.toLowerCase());
			} else {
				return true;
			}
		});

		setTodos(filteredTodos);
	};

	const handleResetSearch = () => {
		setSearchTerm('');
		setTodos(initialTodos);
	};

	const handleSort = () => {
		if (sortAlphabetically) {
			const sortedTodos = [...todos].sort((a, b) => a.text.localeCompare(b.text));
			setTodos(sortedTodos);
		} else {
			setSortAlphabetically(!sortAlphabetically);
			setTodos([...todos]);
		}
	};

	return (
		<>
			<h1>Какие планы на сегодня?</h1>
			<button onClick={handleSort}>
				{sortAlphabetically ? 'Сортировать по алфавиту' : 'Сбросить сортировку'}
			</button>
			<TodoForm
				onSubmit={requestAddTodo}
				todos={todos}
				onSearch={debouncedSearch}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				handleResetSearch={handleResetSearch}
			/>
			<Todo
				todos={todos}
				requestRemoveTodo={requestRemoveTodo}
				requestUpdateTodo={requestUpdateTodo}
			/>
		</>
	);
};
