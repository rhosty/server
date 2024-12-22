<script setup>

</script>
<template>
  <RouterView />
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