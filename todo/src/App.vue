<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const newTodo = ref('')
const todos = ref([])

// Get all todos
const fetchTodos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/tasks')
    todos.value = response.data
  } catch (error) {
    console.error('Error fetching todos:', error)
  }
}

// Add new todo
const addTodo = async () => {


  if (!newTodo.value.trim()) return
  
  try {
    await axios.post('http://localhost:3000/api/tasks', {
      text: newTodo.value,
      completed: false,
    })
    newTodo.value = ''
    await fetchTodos()
  } catch (error) {
    console.error('Error adding todo:', error)
  }
}

const deleteTodo = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/tasks/${id}`)
    await fetchTodos()
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}

const toggleTodo = async (id, todo) => {
  try {
    await axios.put(`http://localhost:3000/api/tasks/${id}`, {
      ...todo,
      completed: !todo.completed
    })
    await fetchTodos()
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

onMounted(() => {
  fetchTodos()
})
</script>

<template>
  <div>
    <h1>Julis und Bernis Tasks</h1>
    <div class="input-container">
      <input 
        type="text" 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        placeholder="Add a new todo"
      >
      <button @click="addTodo">Add</button>
      <pre>{{ newTodo }}</pre>
    </div>

    <ul class="todo-list">
      <li v-for="(todo, index) in todos" :key="index">
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="toggleTodo(index, todo)"
        >
        <span>{{ todo.id }}</span>
        <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
        <button @click="deleteTodo(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.input-container {
  margin: 20px 0;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

button {
  margin-left: auto;
  padding: 5px 10px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

input[type="text"] {
  padding: 5px;
  margin-right: 10px;
}
</style>