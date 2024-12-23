<!-- filepath: /Users/Kulis/server/todo/src/components/ToDoList.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const newTodo = ref('')
const todos = ref([])
const router = useRouter()

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const fetchTodos = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    const response = await axios.get(`${apiBaseUrl}/tasks`, {
      headers: {
        'Authorization': token
      }
    })
    todos.value = response.data
  } catch (error) {
    console.error('Error fetching todos:', error)
    if (error.response && error.response.status === 401) {
      router.push('/')
    }
  }
}

// Add new todo
const addTodo = async () => {
  if (!newTodo.value.trim()) return
  
  try {
    const token = localStorage.getItem('token')
    await axios.post(`${apiBaseUrl}/tasks`, {
      text: newTodo.value,
      completed: false,
    }, {
      headers: {
        'Authorization': token
      }
    })
    newTodo.value = ''
    await fetchTodos()
  } catch (error) {
    console.error('Error adding todo:', error)
    if (error.response && error.response.status === 401) {
      router.push('/')
    }
  }
}

const deleteTodo = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${apiBaseUrl}/tasks/${id}`, {
      headers: {
        'Authorization': token
      }
    })
    await fetchTodos()
  } catch (error) {
    console.error('Error deleting todo:', error)
    alert('Failed to delete todo') // Optional error feedback
    if (error.response && error.response.status === 401) {
      router.push('/')
    }
  }
}

const toggleTodo = async (id, todo) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`${apiBaseUrl}/tasks/${id}`, {
      ...todo,
      completed: !todo.completed
    }, {
      headers: {
        'Authorization': token
      }
    })
    await fetchTodos()
  } catch (error) {
    console.error('Error updating todo:', error)
    if (error.response && error.response.status === 401) {
      router.push('/')
    }
  }
}

onMounted(() => {
  fetchTodos()
})

const logOut = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<template>
  <div class="logout-container">
    <button class="log-out-button" @click="logOut">log out</button>
  </div>
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
          <div class="todo-left">
            <input 
              type="checkbox" 
              :checked="todo.completed"
              @change="toggleTodo(todo.id, todo)"
            >
            <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
          </div>
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
.logout-container{
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  button{
    padding: 5px 10px;
    background-color: #ff4444;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;

  }
}
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
  .todo-left{
    display: flex;
    align-items: center;
    gap: 10px;
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
    justify-content: space-between;
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