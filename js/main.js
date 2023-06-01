updateShoppingList();
updateCartList();
makeCategoriesList();

function addNewIngredients() {
    let ingredientsList = JSON.parse(localStorage.getItem("ingredientsList"));
    let id = parseInt(localStorage.getItem("id"));

    let ingredientsId = id;
    let ingredientsName = document.getElementById("ingredients-name").value;
    let ingredientsQuantity = document.getElementById("ingredients-quantity").value;
    let ingredientsCategory = document.querySelector('#ingredients-category').value;

    if (ingredientsCategory === "売り場を選択") {
        ingredientsCategory = "不明";
    }

    let newIngredients = {
        id: ingredientsId,
        name: ingredientsName,
        category: ingredientsCategory,
        quantity: ingredientsQuantity
    };

    ingredientsList.push(newIngredients);

    localStorage.setItem("id", id + 1);
    localStorage.setItem("ingredientsList", JSON.stringify(ingredientsList));

    updateShoppingList();
    makeCategoriesList();
    clearForm();
}

function updateShoppingList() {
    let generatedHtml = "";

    let ingredientsList = JSON.parse(localStorage.getItem("ingredientsList"));
    if (ingredientsList === null) {
        localStorage.setItem("ingredientsList", JSON.stringify([]));
        localStorage.setItem("id", "1");
        return;
    }

    let selectedCategory = document.getElementById('category-options').value;

    for (let i = 0; i < ingredientsList.length; i++) {
        let ingredient = ingredientsList[i];
        if (selectedCategory == ingredient.category || selectedCategory == 0) {
        let listRow =
            `<div id="row-${ingredient.id}" class="list-row">
            <div id="name-${ingredient.name}" class="list-cell">${ingredient.name}</div>
            <div class="list-cell">${ingredient.category}</div>
            <div class="list-cell">${ingredient.quantity}</div>
            <div class="list-cell">
                <img src="./img/main/ok.png" alt="done" class="in-cart pointer" id="done-${ingredient.id}">
                <img src="./img/main/edit.png" alt="edit" class="edit pointer" id="edit-${ingredient.id}">
                <img src="./img/main/trash.png" alt="edit" class="delete pointer" id="delete-${ingredient.id}">
            </div>
            </div>`;
        generatedHtml += listRow;
        }
    }

    let tbodyElement = document.getElementById("ingredients-list");
    tbodyElement.innerHTML = generatedHtml;

    activateDeleteButtons();
    activateInCartButtons();
    activateEditButtons();
}

function clearForm() {
    document.getElementById("ingredients-name").value = "";
    document.getElementById("ingredients-quantity").value = "";
    document.querySelector('#ingredients-category').value = "売り場を選択";
    }

    function activateDeleteButtons() {
    let deleteButtons = document.getElementsByClassName("delete");
    for (let i = 0; i < deleteButtons.length; i++) {
        let deleteBtn = deleteButtons[i];
        deleteBtn.addEventListener("click", function () {
        if (confirm("本当に消去しますか？")) {
            deleteIngredientsFromStorage(deleteBtn.id, "ingredientsList");
        }
        });
    }
}

function activateCartDeleteButtons() {
    let deleteButtons = document.getElementsByClassName("cart-delete");
    for (let i = 0; i < deleteButtons.length; i++) {
        let deleteBtn = deleteButtons[i];
        deleteBtn.addEventListener("click", function () {
        if (confirm("本当に消去しますか？")) {
            deleteIngredientsFromStorage(deleteBtn.id, "cartIngredientsList");
        }
        });
    }
}

function deleteIngredientsFromStorage(id, listName) {
    const ingredients = JSON.parse(localStorage.getItem(listName));
    for (let i = 0; i < ingredients.length; i++) {
        let ingredient = ingredients[i];
        if (`delete-${ingredient.id}` == id) {
        ingredients.splice(i, 1);
        }
    }

    localStorage.setItem(listName, JSON.stringify(ingredients));
    updateShoppingList();
    updateCartList();
    makeCategoriesList();
}

function activateInCartButtons() {
    let inCartButtons = document.getElementsByClassName("in-cart");
    for (let i = 0; i < inCartButtons.length; i++) {
        let inCartBtn = inCartButtons[i];
        inCartBtn.addEventListener("click", function () {
        moveToOtherList(inCartBtn.id, "ingredientsList", "cartIngredientsList");
        });
    }
}

function activateUndoButtons() {
    let undoButtons = document.getElementsByClassName("undo");
    for (let i = 0; i < undoButtons.length; i++) {
        let undoBtn = undoButtons[i];
        undoBtn.addEventListener("click", function () {
        console.log(undoBtn.id);
        moveToOtherList(undoBtn.id, "cartIngredientsList", "ingredientsList");
        });
    }
}

function moveToOtherList(id, takeFromList, putToList) {
    const fromList = JSON.parse(localStorage.getItem(takeFromList));
    const toList = JSON.parse(localStorage.getItem(putToList));
    for (let i = 0; i < fromList.length; i++) {
        let ingredient = fromList[i];
        if (`done-${ingredient.id}` == id || `undo-${ingredient.id}` == id) {
        toList.push(ingredient);
        deleteIngredientsFromStorage(`delete-${ingredient.id}`, takeFromList);
        }
    }
    localStorage.setItem(putToList, JSON.stringify(toList));
    updateCartList();
    updateShoppingList();
    makeCategoriesList();
}

function updateCartList() {
    let cartIngredientsList = JSON.parse(localStorage.getItem("cartIngredientsList"));
    if (cartIngredientsList === null) {
        localStorage.setItem("cartIngredientsList", JSON.stringify([]));
        document.getElementById("clearListBtn").classList.add("hidden");
        return;
    }
    let cartListBodyHtml = "";
    for (let i = 0; i < cartIngredientsList.length; i++) {
        let cartIngredients = cartIngredientsList[i];
        let cartListRow =
        `<div class="list-head">
            <div class="list-cell">${cartIngredients.name}</div>
            <div class="list-cell">${cartIngredients.category}</div>
            <div class="list-cell">${cartIngredients.quantity}</div>
            <div class="list-cell">
            <img src="./img/main/upward.png" alt="undo" class="undo pointer" id="undo-${cartIngredients.id}">
            <img src="./img/main/unavailable.png" alt="delete" class="cart-delete pointer" id="delete-${cartIngredients.id}">
            </div>
        </div>`;
        cartListBodyHtml += cartListRow;
    }
    document.getElementById("incart-list").innerHTML = cartListBodyHtml;
    activateCartDeleteButtons();
    activateUndoButtons();

    let clearListBtn = document.getElementById("clearListBtn");
    if (cartIngredientsList.length == 0) {
        clearListBtn.classList.add("hidden");
    } else {
        clearListBtn.classList.remove("hidden");
    }
}

function activateEditButtons() {
    let editButtons = document.getElementsByClassName("edit");
    for (let i = 0; i < editButtons.length; i++) {
        let editBtn = editButtons[i];
        editBtn.addEventListener("click", function () {
        editIngredients(editBtn.id);
        });
    }
}

function editIngredients(id) {
    let ingredientsList = JSON.parse(localStorage.getItem("ingredientsList"));
    for (let i = 0; i < ingredientsList.length; i++) {
        if (`edit-${ingredientsList[i].id}` == id) {
        activateEditMode(ingredientsList[i]);
        }
    }
}

function activateEditMode(ingredient) {
    document.getElementById("ingredients-id").value = ingredient.id;
    document.getElementById("ingredients-name").value = ingredient.name;
    document.getElementById("ingredients-quantity").value = ingredient.quantity;
    document.querySelector('#ingredients-category').value = ingredient.category;

    if (ingredient.category === "不明") {
        document.querySelector('#ingredients-category').value = "売り場を選択";
    }

    document.getElementById("update-button").style.display = "";
    document.getElementById("add-button").style.display = "none";
}

function saveEditedIngredients() {
    let ingredientsList = JSON.parse(localStorage.getItem("ingredientsList"));
    let ingredient = {
        id: document.getElementById("ingredients-id").value,
        name: document.getElementById("ingredients-name").value,
        quantity: document.getElementById("ingredients-quantity").value,
        category: document.querySelector('#ingredients-category').value
    };
    for (let i = 0; i < ingredientsList.length; i++) {
        if (ingredientsList[i].id == ingredient.id) {
        ingredientsList[i] = ingredient;
        break;
        }
    }
    localStorage.setItem("ingredientsList", JSON.stringify(ingredientsList));
    document.getElementById("update-button").style.display = "none";
    document.getElementById("add-button").style.display = "";
    updateShoppingList();
    clearForm();
    document.getElementById("ingredients-name").focus();
}

function makeCategoriesList() {
    let ingredientsList = JSON.parse(localStorage.getItem("ingredientsList"));
    let categories = [];
    ingredientsList.forEach(ingredient => {
        if (!categories.includes(ingredient.category))
        categories.push(ingredient.category);
    });
    let HTML = "<option value=0 selected>売り場を選択</option>";
    categories.forEach(category => {
        HTML += `<option value="${category}">${category}</option>`;
    });
    document.getElementById("category-options").innerHTML = HTML;
    localStorage.setItem("categories", JSON.stringify(categories));
}

let select = document.getElementById("category-options");
select.addEventListener('change', function () {
    updateShoppingList();
});

hideBtn.addEventListener("click", function () {
    document.getElementById("form").classList.add("hidden");
    document.getElementById("showBtn").classList.remove("hidden");
    document.getElementById("hideBtn").classList.add("hidden");
});

showBtn.addEventListener("click", function () {
    document.getElementById("form").classList.remove("hidden");
    document.getElementById("showBtn").classList.add("hidden");
    document.getElementById("hideBtn").classList.remove("hidden");
});

clearListBtn.addEventListener("click", function () {
    if (confirm("本当にお遣い完了？")) {
        clearCartList();
    }
});

function clearCartList() {
    let cartIngredientsList = JSON.parse(localStorage.getItem("cartIngredientsList"));
    console.log(cartIngredientsList.length);
    cartIngredientsList.length = 0;
    localStorage.setItem("cartIngredientsList", JSON.stringify(cartIngredientsList));
    updateCartList();
}