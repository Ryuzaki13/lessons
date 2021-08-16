const Request = (function () {

    /**
     * @type {HTMLElement}
     */
    let animationElement = document.querySelector(".loading");
    let counterValue = 0;
    let animationCount = {};

    Object.defineProperty(animationCount, "Count", {
        get: function () {
            return counterValue;
        },
        set: function (value) {
            counterValue = value;
            if (counterValue > 0) {
                if (animationElement) {
                    animationElement.style.display = "initial";
                }
            } else {
                counterValue = 0;
                if (animationElement) {
                    animationElement.style.display = "none";
                }
            }
        }
    });

    return {

        /**
         * @param url {string} адрес запроса
         * @param params {any} тело запроса
         * @param callback {(data: any, params?: any, reverseCallback?: (any)=>any)=>any?}
         * @param options {{isAsync?: boolean, isMultipart?: boolean, callbackParams?: any, callbackCallback?: (any)=>any}}
         * @constructor
         */
        POST(url, params, callback, options) {
            if (!url || typeof url !== "string" || url.length === 0) {
                return;
            }

            if (!params || typeof params !== "object") {
                params = {};
            }

            if (!options || typeof options !== "object") {
                options = {isAsync: true, isMultipart: false, callbackParams: undefined, callbackCallback: undefined};
            }

            let xhr = new XMLHttpRequest();

            xhr.onloadstart = function (e) {
                animationCount.Count++;
            };
            xhr.onloadend = function (e) {
                animationCount.Count--;
            };
            xhr.onload = function (e) {
                let response = undefined;

                try {
                    response = JSON.parse(this.response);
                } catch (error) {
                    Messenger.Notify(error, MESSAGE_ERROR);
                    return;
                }

                if (callback && typeof callback === "function") {
                    response.Error = response.Error || null;
                    if (response.Error) {
                        Messenger.Notify(response.Error, MESSAGE_ERROR);
                    } else {
                        callback(response, options.callbackParams, options.callbackCallback);
                    }
                }
            };
            xhr.onabort = function (e) {
                Messenger.Notify("Запрос был прерван", MESSAGE_WARNING);
            };
            xhr.onerror = function (e) {
                Messenger.Notify("Ошибка выполнения запроса", MESSAGE_ERROR);
            };
            xhr.ontimeout = function (e) {
                Messenger.Notify("Время запроса истекло", MESSAGE_ERROR);
            };

            xhr.open("POST", url, !("isAsync" in options) || !!options.isAsync);
            if (!!options.isMultipart) {
                xhr.send(params);
            } else {
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.send(JSON.stringify(params));
            }
        }
    }
})();