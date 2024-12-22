<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const newTodo = ref('')
const todos = ref([])

const fetchTodos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/tasks')
    console.log(response.data, ' this is the response')
    todos.value = response.data
    console.log(todos.value, ' this is the new value')
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
    alert('Failed to delete todo') // Optional error feedback
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
  <div class="container">
    <div v-if="todos.length > 0">
      <h1>Julias und Bernis Tasks</h1>
      <div class="input-container">
        <input 
          type="text" 
          v-model="newTodo" 
          @keyup.enter="addTodo"
          placeholder="Add a new todo"
        >
        <button @click="addTodo">Add</button>
      </div>
  
      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.id">
          <input 
            type="checkbox" 
            :checked="todo.completed"
            @change="toggleTodo(todo.id, todo)"
          >
          <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
          <button @click="deleteTodo(todo.id)">Delete</button>
        </li>
      </ul>
    </div>
    <div v-if="todos.length === 0"  class="no-item" >
      <h1>Nix zu tun here</h1>
      <div class="input-container">
        <input 
          type="text" 
          v-model="newTodo" 
          @keyup.enter="addTodo"
          placeholder="Add a new todo"
        >
        <button @click="addTodo">Add</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container{
  font-family: 'Roboto', sans-serif;
  display: grid;
  place-items: center;
  height: 100dvh;
  h1 {
    text-align: center;
  }
  .input-container {
    margin: 20px auto;
    display: flex;
    justify-content: center;
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
    justify-content: center;
  }
  
  .completed {
    text-decoration: line-through;
    color: #888;
  }
  
  button {
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
  .no-item{
    .input-container{
      display: flex;
      flex-direction: column;
      gap: 1rem;
      input{
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }
      button{
        margin: 0 auto;
        width: 50%;
      }
    }
  }
}
</style>