const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');

// 할 일 추가
async function addTodo() {
  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;
  const priority = document.getElementById('prioritySelect').value;

  // 입력 검증
  if (!title.trim() || !description.trim()) {
    alert('제목과 내용을 추가해주세요!');
    return;
  }

  console.log('Adding Todo:', { title, description, priority });

  try {
    const response = await axios.post('/todos', { title, description, priority });
    const newTodo = response.data;
    await fetchTodos(); // 목록 다시 불러오기
  } catch (error) {
    console.error('Error adding todo:', error.response ? error.response.data : error.message);
  }

  // 입력 필드 비우기
  document.getElementById('titleInput').value = '';
  document.getElementById('descriptionInput').value = '';
}

// 폼 제출 시 할 일 추가
todoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await addTodo(); // 할 일 추가 함수 호출
});

// 할 일 목록 표시
function displayTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const todoItem = document.createElement('li');
    todoItem.textContent = `${todo.title}: ${todo.description} (우선순위: ${todo.priority})`;
    todoList.appendChild(todoItem);

    // 삭제 버튼 추가
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', async () => {
      await deleteTodo(todo._id);
    });
    todoItem.appendChild(deleteButton);
  });
}

// 할 일 목록 가져오기
async function fetchTodos() {
  try {
    const response = await axios.get('/todos');
    const todos = response.data;
    displayTodos(todos);
  } catch (error) {
    console.error('Error fetching todos:', error.response ? error.response.data : error.message);
  }
}

// 할 일 삭제
async function deleteTodo(id) {
  try {
    await axios.delete(`/todos/${id}`);
    await fetchTodos(); // 목록 다시 불러오기
  } catch (error) {
    console.error('Error deleting todo:', error.response ? error.response.data : error.message);
  }
}

// 페이지 로드 시 할 일 목록 가져오기
document.addEventListener('DOMContentLoaded', fetchTodos);