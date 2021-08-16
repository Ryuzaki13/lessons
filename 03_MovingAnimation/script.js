(function (){

    /**
     * @type {HTMLElement}
     */
    let buttonAdd = document.querySelector("#buttonAdd");
    if (buttonAdd) {
        buttonAdd.classList.add("disabled");
        buttonAdd.onclick = onClickAdd;
    }
    /**
     * @type {HTMLElement}
     */
    let buttonDel = document.querySelector("#buttonDel");
    if (buttonDel) {
        buttonDel.classList.add("disabled");
        buttonDel.onclick = onClickDel;
    }

    /**
     * @type {HTMLElement}
     */
    let leftList = document.querySelector(".list.left");
    if (leftList) leftList.onclick = onClickList;

    /**
         * @type {HTMLElement}
         */
    let rightList = document.querySelector(".list.right");
    if (rightList) rightList.onclick = onClickList;

    /**
     * @type {HTMLElement}
     */
    let selectedLeftItem = undefined;
    /**
     * @type {HTMLElement}
     */
    let selectedRightItem = undefined;

    /**
     * @this {HTMLElement} контейнер
     * @param event {MouseEvent}
     */
    function onClickList(event) {
        let currentSelectedItems = this.querySelectorAll(".item.selected");
        for (let i = 0; i < currentSelectedItems.length; i++) {
            currentSelectedItems[i].classList.remove("selected");
        }

        /**
         * @type {HTMLElement}
         */
        let clickedItem = event.target;
        if (clickedItem &&
            clickedItem instanceof HTMLElement &&
            clickedItem.classList.contains("item")) {
            clickedItem.classList.add("selected");
        } else {
            clickedItem = undefined;
        }

        if (this.classList.contains("left")) {
            selectedLeftItem = clickedItem;
            disableButton(buttonAdd, !clickedItem);
        } else {
            selectedRightItem = clickedItem;
            disableButton(buttonDel, !clickedItem);
        }
    }

    /**
     * @this {HTMLElement}
     * @param event {MouseEvent}
     */
    function onClickAdd(event) {
        doMoving(selectedLeftItem, rightList, buttonAdd);
        selectedLeftItem = undefined;
    }

    /**
     * @this {HTMLElement}
     * @param event {MouseEvent}
     */
    function onClickDel(event) {
        doMoving(selectedRightItem, leftList, buttonDel);
        selectedRightItem = undefined;
    }

    /**
     * @param item {HTMLElement} выбранный элемент
     * @param list {HTMLElement} контейнер в который нужно переместить item
     * @param button {HTMLElement} кнопка, которую нужно выключить
     */
    function doMoving(item, list, button) {
        if (!item || !list) {
            disableButton(button, true);
            return;
        }

        item.ontransitionend = onEndMoving.bind(item, list);
        item.ontransitioncancel = onEndMoving.bind(item, list);

        setPosition(item);
        move(item, list);
        disableButton(button, true);
    }

    /**
     * @this {HTMLElement}
     * @param list {HTMLElement}
     * @param event {TransitionEvent}
     */
    function onEndMoving(list, event) {
        delPosition(this);
        if (list) {
            list.append(this);
        }
        this.classList.remove("selected");
        this.ontransitionend = undefined;
        this.ontransitioncancel = undefined;
    }

    /**
     * @param item {HTMLElement} перемещаемый элемент
     * @param list {HTMLElement} контейнер, в который нужно переместить
     */
    function move(item, list) {
        let bound = list.getBoundingClientRect();
        let boundItem = item.getBoundingClientRect();

        let itemsHeight = 0;
        for (let i = 0; i < list.childElementCount; i++) {
            itemsHeight += list.children[i].getBoundingClientRect().height;
        }

        let xOffset = bound.x + 5 - boundItem.x;
        let yOffset = bound.y + itemsHeight + ((list.childElementCount + 1) * 5) - boundItem.y;

        item.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }

    /**
     * @param item {HTMLElement}
     */
    function setPosition(item) {
        if (!item) return;

        let bound = item.getBoundingClientRect();

        item.style.width = `${bound.width}px`;
        item.style.height = `${bound.height}px`;
        item.style.left = `${bound.x}px`;
        item.style.top = `${bound.y}px`;
        item.style.zIndex = "10";
        item.style.position = "fixed";
        item.style.transform = "translate(0, 0)";
    }

    /**
     * @param item {HTMLElement}
     */
    function delPosition(item) {
        if (!item) return;

        item.style.position = null;
        item.style.width = null;
        item.style.height = null;
        item.style.left = null;
        item.style.top = null;
        item.style.zIndex = null;
        item.style.transform = null;
    }

    /**
     * @param button {HTMLElement}
     * @param disable {boolean}
     */
    function disableButton(button, disable) {
        if (button) {
            if (disable === true) {
                if (!button.classList.contains("disabled")) {
                    button.classList.add("disabled");
                }
            } else {
                if (button.classList.contains("disabled")) {
                    button.classList.remove("disabled");
                }
            }
        }
    }
})();
