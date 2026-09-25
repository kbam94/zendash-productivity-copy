const state = {
    tasks: JSON.parse(localStorage.getItem('zendash_tasks')) || [],
    habits: JSON.parse(localStorage.getItem('zendash_habits')) || [],
    notes: localStorage.getItem('zendash_notes') || ""
};

const save = () => {
    localStorage.setItem('zendash_tasks', JSON.stringify(state.tasks));
    localStorage.setItem('zendash_habits', JSON.stringify(state.habits));
    localStorage.setItem('zendash_notes', state.notes);
    updateProgress();
};

const updateProgress = () => {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.done).length;
    const totalHabits = state.habits.length;
    const completedHabits = state.habits.filter(h => h.done).length;

    const totalItems = totalTasks + totalHabits;
    const totalDone = completedTasks + completedHabits;
    
    const percentage = totalItems === 0 ? 0 : Math.round((totalDone / totalItems) * 100);
    
    document.getElementById('progress-percent').innerText = `${percentage}%`;
    const circle = document.getElementById('progress-bar');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
};

const renderTasks = () => {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    state.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
            <span>${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;
        list.appendChild(li);
    });
};

const renderHabits = () => {
    const grid = document.getElementById('habit-grid');
    grid.innerHTML = '';
    state.habits.forEach((habit, index) => {
        const div = document.createElement('div');
        div.className = `habit-chip ${habit.done ? 'done' : ''}`;
        div.innerHTML = `
            ${habit.text}
            <button class="remove-habit" onclick="event.stopPropagation(); deleteHabit(${index})">✕</button>
        `;
        div.onclick = () => toggleHabit(index);
        grid.appendChild(div);
    });
};

window.toggleTask = (index) => {
    state.tasks[index].done = !state.tasks[index].done;
    save();
    renderTasks();
};

window.deleteTask = (index) => {
    state.tasks.splice(index, 1);
    save();
    renderTasks();
};

window.toggleHabit = (index) => {
    state.habits[index].done = !state.habits[index].done;
    save();
    renderHabits();
};

window.deleteHabit = (index) => {
    state.habits.splice(index, 1);
    save();
    renderHabits();
};

const init = () => {
    // Date & Greeting
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = now.toLocaleDateString(undefined, options);
    
    const hour = now.getHours();
    let greet = "Good Morning";
    if (hour >= 12 && hour < 17) greet = "Good Afternoon";
    if (hour >= 17) greet = "Good Evening";
    document.getElementById('greeting-text').innerText = `${greet}, User`;

    // Notes
    const notesArea = document.getElementById('notes-area');
    notesArea.value = state.notes;
    notesArea.oninput = (e) => {
        state.notes = e.target.value;
        save();
    };

    // Task Add
    document.getElementById('add-task-btn').onclick = () => {
        const input = document.getElementById('task-input');
        if (input.value.trim()) {
            state.tasks.push({ text: input.value.trim(), done: false });
            input.value = '';
            save();
            renderTasks();
        }
    };

    // Habit Add
    document.getElementById('add-habit-btn').onclick = () => {
        const input = document.getElementById('habit-input');
        if (input.value.trim()) {
            state.habits.push({ text: input.value.trim(), done: false });
            input.value = '';
            save();
            renderHabits();
        }
    };

    renderTasks();
    renderHabits();
    updateProgress();
};

init();