$(document).ready(function () {
    var todoList = $('#todo-list');
    let token = localStorage.getItem("token");

    // Fetch all todos
    $.ajax({
        url: 'https://api-todo-list-pbw.vercel.app/todo/getAllTodos',
        type: 'GET',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function (response) {
            if (response.status) {
                response.data.forEach(function (data) {
                    let li = document.createElement("li");
                    li.innerHTML = `
                        <span>${data.text}</span>
                        <div>
                            <button class="edit-btn" onclick="editTodo(this, '${data._id}')">Edit</button>
                            <button class="delete-btn" onclick="deleteTodo(this, '${data._id}')">Hapus</button>
                        </div>
                    `;
                    document.getElementById("todo-list").appendChild(li);
                });
            } else {
                $('.response').html("Error: " + response.pesan);
            }
        },
    });
});

function addTodo() {
    let todo = $("#todo-input").val();
    let token = localStorage.getItem("token");

    if (!todo) {
        return alert("harus diisi terlebih dahulu!");
    }

    $.ajax({
        url: 'https://api-todo-list-pbw.vercel.app/todo/createTodo',
        type: 'POST',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        contentType: "application/json",
        data: JSON.stringify({
            text: todo
        }),
        beforeSend: function () {
            $("#btn-tambah").text("Mohon tunggu...");
        },
        success: function (response) {
            $("#btn-tambah").text("Tambah");
            if (response.status) {
                let li = document.createElement("li");
                li.innerHTML = `
                    <span>${todo}</span>
                    <div>
                        <button class="edit-btn" onclick="editTodo(this, '${response.data._id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteTodo(this, '${response.data._id}')">Hapus</button>
                    </div>
                `;
                document.getElementById("todo-list").appendChild(li);
                $("#todo-input").val('');
            } else {
                $('.response').html("Error: " + response.pesan);
            }
        },
        error: function (xhr, status, error) {
            $("#btn-tambah").text("Tambah");
            console.log("Error Response:", xhr.responseText);
            $('.response').html('Error: ' + xhr.status + ' ' + error);
        }
    });
}

function deleteTodo(button, id) {
    let token = localStorage.getItem("token");

    if (!id) {
        alert("ID tidak ditemukan.");
        return;
    }

    $.ajax({
        url: `https://api-todo-list-pbw.vercel.app/todo/deleteTodo/${id}`,
        type: 'DELETE',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function (response) {
            if (response.status) {
                let li = button.parentElement.parentElement;
                li.remove();
            } else {
                alert(response.pesan);
            }
        },
        error: function (xhr, status, error) {
            console.log("Error Response:", xhr.responseText);
            alert('Error: ' + xhr.status + ' ' + error);
        }
    });
}

function editTodo(button, id) {
    if (!id) {
        alert("ID tidak ditemukan.");
        return;
    }
    let li = button.parentElement.parentElement;
    let span = li.querySelector("span");
    let currentText = span.textContent;

    span.innerHTML = `<input type="text" value="${currentText}" />`;
    button.textContent = "Simpan";
    button.setAttribute("onclick", `saveTodo(this, '${id}')`);
}

function saveTodo(button, id) {
    let li = button.parentElement.parentElement;
    let input = li.querySelector("input");
    let newText = input.value.trim();
    let token = localStorage.getItem("token");

    if (newText === "") {
        return alert("Harap diisi terlebih dahulu!");
    }


    let fromData = new FormData();
    fromData.append('text', newText);
    fromData.append('onCheckList', false)

    $.ajax({
        url: `https://api-todo-list-pbw.vercel.app/todo/updateTodo/${id}`,
        type: 'PUT',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        data: JSON.stringify({
            text: newText,
            onCheckList: true
          }),
        processData: false,        // penting: jangan ubah jadi query string
        contentType: false,        // penting: biar FormData bikin header-nya sendiri
        beforeSend: function () {
            button.textContent = "Mohon tunggu...";
        },
        success: function (response) {
            if (response.status) {
                li.querySelector("span").textContent = newText;
                button.textContent = "Edit";
                button.setAttribute("onclick", `editTodo(this, '${id}')`);
            } else {
                alert(response.message || "Gagal mengupdate");
            }
        },
        error: function (xhr, status, error) {
            console.log("Error Response:", xhr.responseText);
            alert('Error: ' + xhr.status + ' ' + error);
        }
    });
}

function addTodo() {
    const input = document.getElementById("todo-input");
    const value = input.value.trim();
    if (value === "") return;

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${value}</span>
        <div class="actions">
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(this)">Hapus</button>
            <button class="done-btn" onclick="markAsDone(this)">Selesai</button>
        </div>
    `;

    document.getElementById("todo-list").appendChild(li);
    input.value = "";
}

function markAsDone(button) {
    const li = button.closest("li");
    const taskText = li.querySelector(".task-text").textContent;

    if (confirm(`Tandai tugas "${taskText}" sebagai selesai?`)) {
        // Tambahkan ikon checklist dan disable tombol
        if (!li.querySelector(".check-icon")) {
            const checkIcon = document.createElement("span");
            checkIcon.textContent = "✅";
            checkIcon.classList.add("check-icon");
            li.querySelector(".task-text").prepend(checkIcon);
        }
        button.disabled = true;
    }
}


function logout() {
    localStorage.clear();
                window.location.href = 'index.html';
}
    

