document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskName = document.getElementById('task-name');
    const taskDesc = document.getElementById('task-desc');
    const taskDate = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    let editIndex = null;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = '') {
        taskList.innerHTML = '';
        tasks
            .filter(task => task.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach((task, index) => {
                const tr = document.createElement('tr');
                if (task.completed) tr.classList.add('completed');

                tr.innerHTML = `
                    <td>${task.name}</td>
                    <td>${task.desc}</td>
                    <td>${task.date || ''}</td>
                    <td>
                        <button class="complete-btn">${task.completed ? '✅' : '✔️'}</button>
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </td>
                `;

                // Completar/tachar
                tr.querySelector('.complete-btn').onclick = () => {
                    tasks[index].completed = !tasks[index].completed;
                    saveTasks();
                    renderTasks(searchInput.value);
                };
                // Editar
                tr.querySelector('.edit-btn').onclick = () => {
                    taskName.value = task.name;
                    taskDesc.value = task.desc;
                    taskDate.value = task.date;
                    editIndex = index;
                };
                // Eliminar
                tr.querySelector('.delete-btn').onclick = () => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks(searchInput.value);
                };

                taskList.appendChild(tr);
            });
    }

    taskForm.onsubmit = e => {
        e.preventDefault();
        const name = taskName.value.trim();
        if (!name) return;
        const desc = taskDesc.value.trim();
        const date = taskDate.value;

        if (editIndex !== null) {
            tasks[editIndex] = { ...tasks[editIndex], name, desc, date };
            editIndex = null;
        } else {
            tasks.push({ name, desc, date, completed: false });
        }
        saveTasks();
        renderTasks(searchInput.value);
        taskForm.reset();
    };

    searchInput.oninput = () => renderTasks(searchInput.value);

    renderTasks();
});