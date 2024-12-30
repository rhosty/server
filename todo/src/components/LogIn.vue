<!-- filepath: /Users/Kulis/server/todo/src/components/LogIn.vue -->
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const isRegistering = ref(false)
const router = useRouter()

const apiBaseUrl = 'https://serverlienz.netlify.app/'
console.log('API base URL:', apiBaseUrl)

const handleLogin = async () => {
  console.log(`${apiBaseUrl}/api/login`)
  try {
    const response = await axios.post(`${apiBaseUrl}/api/login`, {
      username: username.value,
      password: password.value
    })
    localStorage.setItem('token', response.data.token)
    router.push('/todo')
  } catch (error) {
    console.log('Login failed:', error)
    alert('Login failed. Please try again.')
  }
}

const handleRegister = async () => {
  try {
    await axios.post(`${apiBaseUrl}/api/register`, {
      username: username.value,
      password: password.value
    })
    alert('Registration successful! Please log in.')
    isRegistering.value = false
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>

<template>
  <div class="login-container">
  berni
    <h1>{{ isRegistering ? 'Register' : 'Login' }}</h1>
    <div class="input-container">
      <input type="text" v-model="username" placeholder="Username" />
    </div>
    <div class="input-container">
      <input type="password" v-model="password" placeholder="Password" />
    </div>
    <button @click="isRegistering ? handleRegister() : handleLogin()">
      {{ isRegistering ? 'Register' : 'Log In' }}
    </button>
    <!-- <p @click="isRegistering = !isRegistering">
      {{ isRegistering ? 'Already have an account? Log in' : 'Don\'t have an account? Register' }}
    </p> -->
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 300px;
  margin: 0 auto;
  h1{
    color: #ff4444;
  }
  .button-wrapper{
    display: flex;
    gap: 1rem;
    width: 100%;
    margin-top: 2rem;
    margin-bottom: 3rem;
  }
}

.input-container {
  margin: 10px 0;
}

input {
  padding: 10px;
  font-size: 16px;
  width: 300px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ff4444;
  color: white;
  border: white 1px solid;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease-in-out;
;
}

button:hover {
  background-color: white;
    color: #ff4444;
    border: #ff4444 1px solid;
}
</style>