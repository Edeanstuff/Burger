$(document).ready(function() {
  // Getting a reference to the input field where user adds a new todo
  var $newItemInput = $("input.new-item");
  // Our new todos will go inside the todoContainer
  var $todoContainer = $(".burg-container");
  // Adding event listeners for deleting, editing, and adding todos
  $(document).on("click", "button.delete", deleteBurg);
  $(document).on("click", "button.eaten", toggleEaten);
  $(document).on("click", ".burg-item", editBurg);
  $(document).on("keyup", ".burg-item", finishEdit);
  $(document).on("blur", ".burg-item", cancelEdit);
  $(document).on("submit", "#burg-form", insertBurg);

  // Our initial todos array
  var burgs = [];

  // Getting todos from database when page loads
  getBurgers();

  // This function resets the todos displayed with new todos from the database
  function initializeRows() {
    $todoContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < burgs.length; i++) {
      rowsToAdd.push(createNewRow(burgs[i]));
    }
    $todoContainer.prepend(rowsToAdd);
  }

  // This function grabs todos from the database and updates the view
  function getBurgers() {
    $.get("/api/burgs", function(data) {
      burgs = data;
      initializeRows();
    });
  }

  // This function deletes a todo when the user clicks the delete button
  function deleteBurg(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/burgs/" + id
    }).then(getBurgers);
  }

  // This function handles showing the input box for a user to edit a todo
  function editBurg() {
    var curBurg = $(this).data("burg");
    $(this).children().hide();
    $(this).children("input.edit").val(curBurg.burger);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  // Toggles complete status
  function toggleEaten(event) {
    event.stopPropagation();
    var burg = $(this).parent().data("burg");
    burg.eaten = !burg.eaten;
    updateBurger(burg);
  }

  // This function starts updating a todo in the database if a user hits the "Enter Key"
  // While in edit mode
  function finishEdit(event) {
    var updatedBurg = $(this).data("burg");
    if (event.which === 13) {
      updatedBurg.burger = $(this).children("input").val().trim();
      $(this).blur();
      updateBurg(updatedBurg);
    }
  }

  // This function updates a todo in our database
  function updateBurg(burg) {
    $.ajax({
      method: "PUT",
      url: "/api/burgs",
      data: burg
    }).then(getBurgers);
  }

  // This function is called whenever a todo item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var currentBurg = $(this).data("burg");
    if (currentBurg) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentBurg.burger);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  // This function constructs a todo-item row
  function createNewRow(burg) {
    var $newInputRow = $(
      [
        "<li class='list-group-item burg-item'>",
        "<span>",
        burg.burger,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='delete btn btn-danger'>x</button>",
        "<button class='eaten btn btn-primary'>✓</button>",
        "</li>"
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", burg.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("burg", burg);
    if (burg.eaten) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }

  // This function inserts a new todo into our database and then updates the view
  function insertBurg(event) {
    event.preventDefault();
    var burg = {
      burger: $newItemInput.val().trim(),
      eaten: false
    };

    $.post("/api/burgs", burg, getBurgers);
    $newItemInput.val("");
  }
});
