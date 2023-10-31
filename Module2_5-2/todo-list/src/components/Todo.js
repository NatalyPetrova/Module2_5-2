import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, requestRemoveTodo, requestUpdateTodo }) => {
	const [edit, setEdit] = useState('');
	console.log('edit:', edit);

	const submitUpdate = (value) => {
		requestUpdateTodo(edit.id, value);
		setEdit('');
	};

	if (edit.id) {
		return <TodoForm edit={edit} onSubmit={submitUpdate} />;
	}

	return todos.map((todo, index) => (
		<div className={'todo-row'} key={index}>
			<div key={todo.id}>{todo.text}</div>
			<div className="icons">
				<RiCloseCircleLine
					onClick={() => requestRemoveTodo(todo.id)}
					className="delete-icon"
				/>
				<TiEdit
					onClick={() => setEdit({ id: todo.id, value: todo.text })}
					className="edit-icon"
				/>
			</div>
		</div>
	));
};

export default Todo;
