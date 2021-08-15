const ID_NOTIFICATOR = "notificator";
const MESSAGE_DEFAULT = "";
const MESSAGE_INFO = "info";
const MESSAGE_WARNING = "warning";
const MESSAGE_ERROR = "error";
const DEFAULT_TIMEOUT = 10000;

/**
 * Создание объекта уведомлений
 * @param position {string} позиция уведомлений ("top-left" | "top-right" | "bottom-left" | "bottom-right")
 * @constructor
 */
let CreateNotification = function (position) {

    /**
     * @type {string}
     */
    let removeDirection;

    /**
     * @type {HTMLDivElement}
     */
    let rootElement;

    const messageType = [MESSAGE_ERROR, MESSAGE_WARNING, MESSAGE_INFO];

    /**
     * Создание корневого элемента
     */
    function createRootElement() {
        rootElement = document.querySelector(`#${ID_NOTIFICATOR}`);
        if (!rootElement) {
            rootElement = document.createElement("div");
            rootElement.id = ID_NOTIFICATOR;
            document.body.append(rootElement);
        }

        if (position.indexOf("top") !== -1) {
            rootElement.style.flexDirection = "column-reverse";
            rootElement.style.top = "1px";
        } else {
            rootElement.style.flexDirection = "column";
            rootElement.style.bottom = "1px";
        }
        if (position.indexOf("left") !== -1) {
            rootElement.style.left = "1px";
            removeDirection = "removing-to-left";
        } else {
            rootElement.style.right = "1px";
            removeDirection = "removing-to-right";
        }
    }

    /**
     * @this HTMLElement
     */
    function softRemove() {
        this.ontransitionend = () => {
            this.remove();
        };
        this.classList.add(removeDirection);
    }

    /**
     * @this HTMLElement
     */
    function hardRemove() {
        this.remove();
    }

    return {
        /**
         * Показывает сообщение
         * @param message {string}
         * @param type {string}
         * @param timeout {number}
         * @constructor
         */
        Notify(message, type, timeout = DEFAULT_TIMEOUT) {
            if (!rootElement || !rootElement.parentElement) {
                createRootElement();
            }

            let element = document.createElement("div");
            if (typeof type === "string") {
                type = messageType.indexOf(type) === -1 ? "" : type;
                element.className = ["notify", type].join(" ").trim();
            } else {
                element.className = "notify";
            }

            let messageElement = document.createElement("div");
            messageElement.textContent = message;

            let close = document.createElement("div");
            close.className = "close";
            close.onclick = hardRemove.bind(element);

            element.append(messageElement, close);
            rootElement.append(element);

            if (!isFinite(timeout) || !isNaN(timeout)) {
                timeout = DEFAULT_TIMEOUT;
            }

            setTimeout(softRemove.bind(element), timeout);
        }
    };
};

let Messenger = CreateNotification("bottom-right");

// TEST ONLY
// let notifyString = [
//     "Это просто какое-то сообщение",
//     "Это информационное сообщение",
//     "Это предупреждающее сообщение",
//     "Это сообщение об ошибки",
//     "Вышедшее за рамки"
// ];
// let notifyType = [
//     MESSAGE_DEFAULT,
//     MESSAGE_INFO,
//     MESSAGE_WARNING,
//     MESSAGE_ERROR
// ];
//
// for (let i = 0; i < notifyString.length; i++) {
//     setTimeout(() => {
//         Messenger.Notify(notifyString[i], notifyType[i], 10000);
//     }, 1500 * i);
// }