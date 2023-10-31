import styles from './app.module.css';
import React from 'react';
import { TodoList } from './components/TodoList';

export const App = () => {
	return (
		<div className={styles.app}>
			<TodoList />
		</div>
	);
};

export default App;
