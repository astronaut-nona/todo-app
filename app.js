var taskInput = document.getElementById("task-input");
var todos = document.getElementById("todos");
var taskList = [];
var editId = 0;
var isEdit = false;
var filters = document.querySelectorAll(".filters span");  

if(localStorage.getItem("tasks")){
    taskList = JSON.parse( localStorage.getItem("tasks"));
    printTasks();
}
document.getElementById('toggle-dark-mode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });
  

function printTasks(filter = "all") {
    var litags ="";
    taskList.forEach( function(task , index) {
        var checked ="";
        if (task.status === "completed") {
            checked="checked";
        }
        if (filter === task.status || filter === "all" ) {
            litags += `<li class="task">
     <label id="${index}">
        <input type="checkbox" ${checked} onclick="changeStatus(this)"/>
        <p class="${checked}">${task.title}</p>
     </label>
        <div class="settings">
        <svg class="pencil_edit" onclick="editTask( ${index} , '${task.title}')" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
          <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
      </svg>
        <svg id="crash" onclick="deleteTask(${index})" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"></path>
</svg>
       
        </div>
    </li>`;}
    //متنی که به باتن اولی میدی توی ادیت تسک باید  داخل 'تک استرینگ' باشه
        });
        todos.innerHTML = litags
    var clearAll = document.getElementById("clear-all")
    if (taskList.length) {
    clearAll.classList.add("active");
    } else {
    clearAll.classList.remove("active");
    }
    };

function changeStatus(input){
        var ptag = input.parentElement.lastElementChild;
        var itemIndex = input.parentElement.id;
    if (input.checked) {
        ptag.classList.add("checked");
        taskList[itemIndex].status = "completed"
    }else{
        ptag.classList.remove("checked");
        taskList[itemIndex].status = "pending"
    }
    parsisdata();
};

function addTask (e) {
    var taskValue = taskInput.value.trim(); 
    if (e.key ==="Enter" && taskValue) {
        if (!isEdit) {   
            var taskInfo = { title: taskValue , status:"pending"};
            taskList.push(taskInfo);
        }else{
            taskList[editId].title = taskValue ;
            isEdit = false;
        }
        taskInput.value = "";
        printTasks();
        parsisdata();
    }
};

function editTask(id, title) {
    isEdit = true;
    editId = id;
    taskInput.value = title;
    taskInput.focus();
  }

  function deleteTask(id) {
    taskList.splice(id , 1)
    printTasks();
    parsisdata();
  }

  function clearAllTask() {
    taskList= [];
    printTasks();
    parsisdata();
  }

  filters.forEach(function (btn) {
btn.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    printTasks(btn.id)
})
  });

  function parsisdata(params) {
    localStorage.setItem("tasks" , JSON.stringify(taskList));}

    function deleteTask(id) {
        var taskElement = document.getElementById(id).parentElement;
        taskElement.classList.add('removing');
        setTimeout(function() {
          taskList.splice(id, 1);
          printTasks();
          parsisdata();
        }, 500); 
      }
      function allowDrop(event) {
        event.preventDefault();
      }
      
      function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
      }
      
      function drop(event) {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var draggedElement = document.getElementById(data);
        var dropTarget = event.target.closest('li');
        if (dropTarget && dropTarget !== draggedElement) {
          todos.insertBefore(draggedElement, dropTarget.nextSibling);
          updateTaskOrder();
        }
      }
      
      function updateTaskOrder() {
        var updatedTaskList = [];
        document.querySelectorAll('.task-box .task').forEach(function(taskElement) {
          var taskId = taskElement.querySelector('label').id;
          updatedTaskList.push(taskList[taskId]);
        });
        taskList = updatedTaskList;
        parsisdata();
      }