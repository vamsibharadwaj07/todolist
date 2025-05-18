let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        function saveTasks() {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        function addTask() {
            const title = document.getElementById("title").value.trim();
            const priority = document.getElementById("priority").value;
            const deadline = document.getElementById("deadline").value;

            if (!title || !deadline) {
                alert("Please fill all fields.");
                return;
            }

            const task = {
                id: Date.now(),
                title,
                priority,
                deadline,
                status: "Pending"
            };

            tasks.push(task);
            saveTasks();
            renderTasks();

            document.getElementById("title").value = "";
            document.getElementById("deadline").value = "";
        }

        function renderTasks() {
            const list = document.getElementById("task-list");
            const statusFilter = document.getElementById("status-filter").value;
            const priorityFilter = document.getElementById("priority-filter").value;
            list.innerHTML = "";

            const today = new Date().toISOString().split("T")[0];

            tasks
                .filter(task =>
                    (statusFilter === "All" || task.status === statusFilter) &&
                    (priorityFilter === "All" || task.priority === priorityFilter)
                )
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .forEach(task => {
                    const card = document.createElement("div");
                    card.className = `task-card ${task.deadline < today && task.status === "Pending" ? 'overdue' : ''}`;

                    const badgeClass = task.priority.toLowerCase();
                    const remaining = getCountdown(task.deadline);

                    card.innerHTML = `
        <div class="task-left">
          <input type="checkbox" ${task.status === "Completed" ? "checked" : ""}
            onclick="toggleStatus(${task.id})">
          <div class="task-info ${task.status === "Completed" ? 'completed' : ''}">
            <strong>${task.title}</strong>
            <div>
              <span class="badge ${badgeClass}">${task.priority}</span>
              ${task.deadline} &nbsp;
              <small>${remaining}</small>
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button onclick="editTask(${task.id})"><i class="fa-regular fa-pen-to-square"></i></button>
          <button onclick="deleteTask(${task.id})"><i class="fa-regular fa-trash-can"></i></button>
        </div>
      `;

                    list.appendChild(card);
                });
        }

        function getCountdown(deadline) {
            const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
            if (days < 0) return "Overdue";
            if (days === 0) return "Due Today";
            return `Due in ${days} day${days !== 1 ? "s" : ""}`;
        }

        function toggleStatus(id) {
            const task = tasks.find(t => t.id === id);
            task.status = task.status === "Pending" ? "Completed" : "Pending";
            saveTasks();
            renderTasks();
        }

        function deleteTask(id) {
            if (confirm("Delete this task?")) {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
            }
        }

        function editTask(id) {
            const task = tasks.find(t => t.id === id);
            const newTitle = prompt("Edit Title:", task.title);
            if (newTitle !== null) task.title = newTitle;
            saveTasks();
            renderTasks();
        }

        renderTasks();
