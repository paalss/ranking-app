'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
window.onload = function () {
    // Determine which html-page is open
    var pageAddress = window.location.search;
    if (pageAddress == '') {
        var page = 'index';
    }
    else { // pageAddress == " ?list=x"
        var page = 'list';
    }
    var GETparameter = window.location.search.substr(1); // eg. 'list=1', 'list=2'
    var listId = GETparameter.substring(GETparameter.indexOf('=') + 1); // eg. '1', '2'
    if (page == 'index') {
        renderList(page);
        addClickListenerToHeaderButtons(page, listId);
    }
    else {
        fetch('php/findLists.php')
            .then(function (res) { return res.json(); })
            .then(function (lists) {
            var arrayIndex = 0;
            lists.forEach(function (listInfo) {
                if (listInfo[0] == listId) {
                    var listName = listInfo[1];
                    setTitle(listName);
                }
                else {
                    arrayIndex++;
                }
            });
        });
        renderList(page, listId);
        addClickListenerToHeaderButtons(page, listId, GETparameter);
    }
};
function setTitle(listName) {
    var h2 = document.querySelector('h2');
    h2.innerHTML = 'List: ' + listName;
}
function renderList(page, listId) {
    return __awaiter(this, void 0, void 0, function () {
        var infoForPhp, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(page == 'index')) return [3 /*break*/, 1];
                    fetch('php/findLists.php')
                        .then(function (res) { return res.json(); })
                        .then(function (data) {
                        data.forEach(function (item) {
                            var id = item[0];
                            var itemContent = { title: item[1] };
                            renderItem(page, '', id, itemContent);
                        });
                    });
                    return [3 /*break*/, 3];
                case 1:
                    infoForPhp = { POSTValue: listId };
                    return [4 /*yield*/, fetchFileAndPostData('php/findListItems.php', infoForPhp)];
                case 2:
                    data = _a.sent();
                    data.forEach(function (item) {
                        var id = item[0];
                        var itemContent = { title: item[3], artist: item[4], image: item[5] };
                        var isTrashed = item[6];
                        var place = item[2];
                        if (listId != undefined) {
                            renderItem(page, listId, id, itemContent, isTrashed, place);
                        }
                    });
                    _a.label = 3;
                case 3:
                    setSaveButtonTextTo('&check; Saved');
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Render list item
 * @param {string} page Index or list
 * @param {string} listId
 * @param {string} id Item id
 * @param {object} itemContent
 * @param {boolean} isTrashed True or false
 * @param {string} originalPlace Two use cases: ● Used for trashing an item in such a way it remembers which place it left (Storing original place) ● Also used for restoring items to their original place
 * @param {boolean} insertAtOriginalPlace True or false. True if item needs to be rendered at a specific place in the list. Eg. when restoring an item.
 */
function renderItem(page, listId, id, itemContent, isTrashed, originalPlace, insertAtOriginalPlace) {
    var li = document.createElement('li');
    if (isTrashed == true) {
        var list = document.getElementById('trashList');
    }
    else {
        var list = document.getElementById('activeList');
    }
    if (!insertAtOriginalPlace) {
        list.appendChild(li);
    }
    else {
        var itemAtOriginalPlace = document.querySelector("#activeList li:nth-child(" + originalPlace + ")");
        list.insertBefore(li, itemAtOriginalPlace);
    }
    if (page == 'index') {
        li.outerHTML = "\n      <li id=\"" + id + "\">\n        <div class=\"flex-row\">\n          <form class=\"edit-item\">\n            <button class=\"link title\" id=\"" + id + "\">" + itemContent.title + "</button>\n            <button class=\"round-button toggle-editing-mode-button\">Rename</button>\n          </form>\n          <!--<button class=\"round-button trash-item-button\">Delete list</button>-->\n        </div>\n      </li>\n    ";
        addClickListenerToListItemButtons(page, id);
    }
    else {
        if (isTrashed == true) {
            li.outerHTML = "\n        <li id=\"" + id + "\" class=\"its-activelist-place-was-" + originalPlace + "\">\n          <div class=\"flex-row\">\n            <div class=\"image\">\n              <img src=\"images/" + itemContent.image + "\" alt=\"" + itemContent.image + "\">\n            </div>\n            <form class=\"edit-item\">\n              <div class=\"text-width\">\n                <span id=\"title\" class=\"title\">" + itemContent.title + "</span><br>\n                <span id=\"artist\" class=\"artist\">" + itemContent.artist + "</span>\n              </div>\n              <button class=\"round-button toggle-editing-mode-button\">Edit</button>\n            </form>\n            <button class=\"round-button restore-item-button\">Restore</button>\n            <button class=\"round-button red-button delete-item-button\">Delete</button>\n          </div>\n        </li>";
        }
        else {
            li.outerHTML = "\n        <li id=\"" + id + "\">\n          <div class=\"flex-row\">\n            <div class=\"image\">\n              <img src=\"images/" + itemContent.image + "\" alt=\"" + itemContent.image + "\">\n            </div>\n            <form class=\"edit-item\">\n              <div class=\"text-width\">\n                <span id=\"title\" class=\"title\">" + itemContent.title + "</span><br>\n                <span id=\"artist\" class=\"artist\">" + itemContent.artist + "</span>\n              </div>\n              <button class=\"round-button toggle-editing-mode-button\">Edit</button>\n            </form>\n            <button class=\"round-button trash-item-button\">Trash</button>\n            <button class=\"round-button move-item-up-button\"><div class=\"arrow-up\"></div></button>\n            <button class=\"round-button move-item-down-button\"><div class=\"arrow-down\"></div></button>\n          </div>\n        </li>\n      ";
        }
        addClickListenerToListItemButtons(page, id, listId, isTrashed);
    }
    formEditLiPreventDefault(id);
}
/**
 * Add click event listeners to header buttons
 * @param {string} GETparameter 'list=___'
 */
function addClickListenerToHeaderButtons(page, listId, GETparameter) {
    if (page == 'index') {
        document
            .getElementById("createItemButton")
            .addEventListener("click", function () {
            return createItem(page, { title: "" });
        });
        document.getElementById('saveButton').addEventListener('click', function () { return saveList(page, listId); });
    }
    else {
        document.getElementById('createItemButton').addEventListener('click', function () { return createItem(page, { title: '', artist: '', image: 'default.png' }, listId); });
        document.getElementById('returnHomeButton').addEventListener('click', function () { return returnHome(); });
        document.getElementById('saveButton').addEventListener('click', function () { return saveList(page, listId); });
        document.getElementById('refreshButton').addEventListener('click', function () { return location.assign('list.html?' + GETparameter); });
    }
}
/**
 * Add click event listeners to list item buttons
 * @param {number} id list item ID
 */
function addClickListenerToListItemButtons(page, id, listId, isTrashed) {
    var item = document.getElementById(id);
    if (page == 'index') {
        item.querySelector('.title').addEventListener('click', function () { return goToList(id); });
        item.querySelector('.toggle-editing-mode-button').addEventListener('click', function () { return toggleEditingMode(page, id); });
        // item.querySelector('.trash-item-button')!.addEventListener('click', () => trashItem(page, id))
    }
    else {
        if (listId != undefined) {
            item.addEventListener('drop', function () { return determineSaveButtonText(page, listId); });
            item.querySelector('.toggle-editing-mode-button').addEventListener('click', function () { return toggleEditingMode(page, id, listId); });
            if (isTrashed == true) {
                item.querySelector('.restore-item-button').addEventListener('click', function () { return restoreItem(page, id, listId); });
                item.querySelector('.delete-item-button').addEventListener('click', function () { return deleteItem(page, id); });
            }
            else {
                item.querySelector('.trash-item-button').addEventListener('click', function () { return trashItem(page, id, listId); });
                item.querySelector('.move-item-up-button').addEventListener('click', function () { return moveItem(page, id, 'up', listId); });
                item.querySelector('.move-item-down-button').addEventListener('click', function () { return moveItem(page, id, 'down', listId); });
            }
        }
        else {
            console.error('listId: ', listId);
        }
    }
}
// Make list sortable with drag and drop
new Sortable(activeList, {
    animation: 150,
    ghostClass: 'blue-background-class'
});
function createItem(page, itemContent, listId) {
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findFreeLiId(page)];
                case 1:
                    id = _a.sent();
                    if (id != undefined && itemContent != undefined) {
                        if (page == "index") {
                            renderItem(page, "", id, itemContent);
                            toggleEditingMode(page, id); // turn on editing mode for this item
                        }
                        else {
                            if (listId != undefined) {
                                renderItem(page, listId, id, itemContent);
                                toggleEditingMode(page, id, listId); // turn on editing mode for this item
                                determineSaveButtonText(page, listId);
                            }
                            else {
                                console.log("listId: ", listId);
                            }
                        }
                    }
                    else {
                        console.error("some of these values are undefined (see console.logs below):");
                        console.log("id: ", id);
                        console.log("itemContent: ", itemContent);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function highlight(item) {
    item.style.transition = 'background-color 0ms linear';
    item.style.backgroundColor = 'rgb(34, 34, 34)';
    setTimeout(function () {
        item.style.transition = 'background-color 500ms linear';
        item.style.backgroundColor = '';
    }, 500);
}
/**
 * Move list item in a direction
 * @param {number} liNo
 * @param {string} direction up or down
 */
function moveItem(page, liNo, direction, listId) {
    var itemToMove = document.getElementById(liNo);
    var ol = document.getElementById('activeList');
    if (direction == 'up') {
        /* Move chosen item up
        as long as it's not at the top of the list */
        var element = itemToMove;
        var previousElement = itemToMove.previousElementSibling;
        if (previousElement != null) {
            ol.insertBefore(element, previousElement);
        }
    }
    else {
        /* Move chosen item down
        as long as it's not at the bottom of the list */
        var element = itemToMove;
        var nextElement = itemToMove.nextElementSibling;
        if (nextElement != null) {
            ol.insertBefore(nextElement, element);
        }
    }
    highlight(itemToMove);
    determineSaveButtonText(page, listId);
}
function trashItem(page, id, listId) {
    /* function convertItemToArray (also invoked by findItemPlace)
    doesn't work if list items are in editing mode */
    ensureItemEditingModeIsClosed(page, listId, id);
    var itemToTrash = document.getElementById(id);
    var activeList = document.getElementById('activeList');
    var originalPlace = findItemPlace(page, id);
    var isTrashed = true;
    var itemAsArray = convertItemToArray(page, 'activeList', itemToTrash);
    var title = itemAsArray[1];
    var artist = itemAsArray[2];
    var image = itemAsArray[3];
    /* Remove item from active list, and add a similar item to trash list.
    It will look like the item has moved to trash and changed its structure */
    activeList.removeChild(itemToTrash);
    /* The “originalPlace” parameter below is for letting
    the trashed item remember its place in the active list. */
    renderItem(page, listId, id, { title: title, artist: artist, image: image }, isTrashed, originalPlace);
    determineSaveButtonText(page, listId);
}
function restoreItem(page, id, listId) {
    /* function convertItemToArray
    doesn't work if list items are in editing mode */
    ensureItemEditingModeIsClosed(page, listId, id);
    var itemToRestore = document.getElementById(id);
    var trashList = document.getElementById('trashList');
    var originalPlace = findItemPlaceBeforeItWasTrashed(document.getElementById(id));
    var isTrashed = false;
    var insertAtOriginalPlace = true;
    var itemAsArray = convertItemToArray(page, 'activeList', itemToRestore);
    var title = itemAsArray[1];
    var artist = itemAsArray[2];
    var image = itemAsArray[3];
    /* Remove item from trash list, and add a similar item to active list.
    It will look like the item has moved to active list and changed its structure */
    trashList.removeChild(itemToRestore);
    /* The “originalPlace” and “insertAtOriginalPlace” lets the item know it has to be
    inserted to its original place */
    renderItem(page, listId, id, { title: title, artist: artist, image: image }, isTrashed, originalPlace, insertAtOriginalPlace);
    determineSaveButtonText(page, listId);
}
function findItemPlace(page, id) {
    var listAsArray = convertListToArray(page, 'activeList');
    var index = listAsArray.findIndex(function (itemAsArray) { return itemAsArray[0] == id; });
    var place = index + 1;
    return place.toString();
}
function toggleEditingMode(page, id, listId) {
    var item = document.getElementById(id);
    // if editing mode is open, close it
    if (item.classList.contains('editing-mode')) {
        item.classList.remove('editing-mode');
        var divEditItem = item.querySelector('.edit-item');
        var title = item.querySelector('.title').value; // (<HTMLInputElement>…) is necessary for receiving the “.value” according to TypeScript
        if (page == 'index') {
            divEditItem.innerHTML = "\n        <button class=\"link title\" id=\"" + id + "\">" + title + "</button>\n        <button class=\"round-button toggle-editing-mode-button\">Edit title</button>\n      ";
            divEditItem.querySelector('.title').addEventListener('click', function () { return goToList(id); });
            divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', function () { return toggleEditingMode(page, id); });
            determineSaveButtonText(page);
        }
        else {
            var artist = item.querySelector('.artist').value;
            var divImage = item.querySelector('.image');
            var imageSourcePath = item.querySelector('img').src;
            var imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7);
            divImage.innerHTML = "\n        <img src=\"images/" + imageFilename + "\" alt=\"" + imageFilename + "\">\n      ";
            divEditItem.innerHTML = "\n        <div class=\"text-width\">\n          <span id=\"title\" class=\"title\">" + title + "</span><br>\n          <span id=\"artist\" class=\"artist\">" + artist + "</span>\n        </div>\n        <button class=\"round-button toggle-editing-mode-button\">Edit</button>\n      ";
            divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', function () { return toggleEditingMode(page, id, listId); });
            var imageUploadInputs = item.querySelector('.image-upload-inputs');
            item.removeChild(imageUploadInputs);
            determineSaveButtonText(page, listId);
        }
    }
    else { // If editing mode is closed, open it
        item.classList.add('editing-mode');
        var divEditItem = item.querySelector('.edit-item');
        var title = item.querySelector('.title').innerHTML;
        if (page == 'index') {
            divEditItem.innerHTML = "\n        <input class=\"title\" type=\"text\" placeholder=\"title\" value=\"" + title + "\">\n        <button class=\"round-button toggle-editing-mode-button\">Close edit</button>\n      ";
            divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', function () { return toggleEditingMode(page, id); });
            determineSaveButtonText(page);
        }
        else {
            var artist = item.querySelector('.artist').innerHTML;
            var divImage = item.querySelector('.image');
            var imageSourcePath = item.querySelector('img').src;
            var imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7);
            divImage.innerHTML = "\n        <img src=\"images/" + imageFilename + "\" alt=\"" + imageFilename + "\">\n      ";
            divEditItem.innerHTML = "\n        <div class=\"text-width\">\n          <input class=\"title\" type=\"text\" placeholder=\"title\" value=\"" + title + "\"><br>\n          <input class=\"artist\" type=\"text\" placeholder=\"artist\" value=\"" + artist + "\">\n        </div>\n        <button class=\"round-button toggle-editing-mode-button\">Close edit</button>\n      ";
            divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', function () { return toggleEditingMode(page, id, listId); });
            var imageUploadInputs = document.createElement('div');
            imageUploadInputs.classList.add('image-upload-inputs');
            item.appendChild(imageUploadInputs);
            imageUploadInputs.innerHTML = "\n        <form class=\"image-upload\" name=\"image-upload\" method=\"post\" enctype=\"multipart/form-data\">\n          upload image\n          <input type=\"file\" class=\"upload-file\" name=\"upload-file\"><br>\n          <input type=\"submit\" value=\"Upload image\">\n        </form>\n      ";
            // Ready image upload form
            var form_1 = item.querySelector('.image-upload');
            form_1.addEventListener('submit', function (event) {
                event.preventDefault();
                var formattedFormData = new FormData(form_1);
                downloadImage(formattedFormData, id);
            });
            determineSaveButtonText(page, listId);
        }
        var inputTitle = item.querySelector('.title');
        inputTitle.focus();
    }
}
function deleteItem(page, id) {
    var itemToDelete = document.getElementById(id);
    if (page == 'index') {
        window.alert('You\'re about to delete an entire list, proceed?');
    }
    itemToDelete.classList.add('deleted-item');
}
function formEditLiPreventDefault(liNo) {
    var item = document.getElementById(liNo);
    var form = item.querySelector('.edit-item');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
    });
}
function fetchFileAndPostData(fileToFetch, valuesToPost) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(fileToFetch, {
                        method: 'POST',
                        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
                        body: formEncode(valuesToPost)
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Ask PHP to download image into folder,
 * once it's done, place image in list item
 */
function downloadImage(formattedFormData, liNo) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, imageFilename, item, divImage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('php/placeImgInFolder.php', {
                        method: 'POST',
                        body: formattedFormData
                    })
                    // PHP provides feedback about image download attempt
                    // Eg. 'did_not_upload' | 'was_not_downloaded' | 'was_downloaded'
                ];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _a.sent();
                    if (data == 'was_not_downloaded') {
                        alert('Bilde ble ikke lastet ned');
                    }
                    else if (data == 'was_downloaded') {
                        imageFilename = document.forms['image-upload']['upload-file'].files[0].name;
                        item = document.getElementById(liNo);
                        divImage = item.querySelector('.image');
                        divImage.innerHTML = "\n      <img src=\"images/" + imageFilename + "\" alt=\"" + imageFilename + "\">\n    ";
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Finds an ID in which isn't already in use.
 * Neither by any item in the database, nor on any unsaved local item
 * Function is called as a parameter in createItem()
 */
function findFreeLiId(page) {
    return __awaiter(this, void 0, void 0, function () {
        var response, response, message, data, flatData, unsavedItemIdsNodeList, unsavedItemIds, removedDuplicateData, sortedData, handledData, counter, freeLiId, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(page == 'index')) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch('php/findAllListsId.php')];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fetch('php/findAllListItemsId.php')];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!response.ok) {
                        message = "An error has occured: " + response.status;
                        throw new Error(message);
                    }
                    return [4 /*yield*/, response.json()]; // eg. Array(6) [ (1) […], (1) […], (1) […], (1) […], (1) […], (1) […] ] -> 0: Array [ "1" ]
                case 5:
                    data = _a.sent() // eg. Array(6) [ (1) […], (1) […], (1) […], (1) […], (1) […], (1) […] ] -> 0: Array [ "1" ]
                    ;
                    flatData = data.flat(1) // eg. Array(6) [ "1", "2", "11", "3", "4", "5", "9" ]
                    ;
                    unsavedItemIdsNodeList = document.querySelectorAll('li');
                    unsavedItemIds = __spreadArray([], unsavedItemIdsNodeList);
                    unsavedItemIds.forEach(function (element) {
                        flatData.push(element.id);
                    }); // Array(10) [ "1", "2", "11", "3", "4", "5", "9", "4", "2", "3", "5" ]
                    removedDuplicateData = __spreadArray([], new Set(flatData));
                    sortedData = removedDuplicateData.sort(function (a, b) { return a - b; });
                    handledData = sortedData;
                    counter = 1;
                    for (i = 0; i < handledData.length + 1; i++) {
                        if (handledData[i] == undefined) {
                            freeLiId = counter;
                            return [2 /*return*/, freeLiId.toString()];
                        }
                        else if (counter != handledData[i]) {
                            freeLiId = counter;
                            return [2 /*return*/, freeLiId.toString()];
                        }
                        else {
                            counter++;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * The only function that makes changes to the database
 * @param {string} page 'index' or 'list'
 * @param {number} listId
 */
function saveList(page, listId) {
    return __awaiter(this, void 0, void 0, function () {
        var listAsArray, trashListAsArray, itemNo, itemNo, deletedItemsIdAsArray;
        return __generator(this, function (_a) {
            /* functions convertListToArray & convertItemToArray
            doesn't work if list items are in editing mode */
            ensureAllEditingModesAreClosed(page, listId);
            listAsArray = convertListToArray(page, 'activeList');
            trashListAsArray = convertListToArray(page, 'trashList');
            if (page == 'index') {
                itemNo = 0;
                listAsArray.forEach(function (itemAsArray) {
                    itemNo++;
                    var infoForPhp = { updatedItem: itemAsArray, isTrashed: false };
                    var data = fetchFileAndPostData('php/updateList.php', infoForPhp);
                    if (!data) {
                        console.warn('saveList updating: ', data);
                    }
                });
            }
            else { // page == 'list'
                itemNo = 0;
                listAsArray.forEach(function (itemAsArray) {
                    itemNo++;
                    var infoForPhp = { updatedItem: itemAsArray, place: itemNo, listId: listId, isTrashed: false };
                    var data = fetchFileAndPostData('php/updateListItem.php', infoForPhp);
                    if (!data) {
                        console.warn('saveList updating: ', data);
                    }
                });
                trashListAsArray.forEach(function (itemAsArray) {
                    var infoForPhp = { updatedItem: itemAsArray, listId: listId, isTrashed: true };
                    var data = fetchFileAndPostData('php/updateListItem.php', infoForPhp);
                });
            }
            deletedItemsIdAsArray = getIdOfDeletedItemsAsArray();
            if (deletedItemsIdAsArray != []) {
                deletedItemsIdAsArray.forEach(function (deletedItemId) {
                    var infoForPhp = { deletedItem: deletedItemId };
                    var data = fetchFileAndPostData('php/deleteListItem.php', infoForPhp);
                });
            }
            setSaveButtonTextTo('&check; Saved');
            return [2 /*return*/];
        });
    });
}
function getIdOfDeletedItemsAsArray() {
    var deletedItems = document.querySelectorAll('#trashList li.deleted-item');
    var ids = [];
    for (var i = 0; i < deletedItems.length; i++) {
        ids.push(deletedItems[i].id);
    }
    return ids; // eg. Array(3) [ "4", "2", "1" ]. Array []
}
/**
 * Make sure no list item is in editing mode
 */
function ensureAllEditingModesAreClosed(page, listId) {
    var itemsWithEditingMode = document.getElementsByClassName('editing-mode');
    if (itemsWithEditingMode.length > 0) {
        /* itemsWithEditingMode (HTMLCollection) automatically updates when the underlying document is changed.
        To avoid this, make a copy array we can loop through and change the DOM */
        var itemsReference = __spreadArray([], itemsWithEditingMode);
        itemsReference.forEach(function (item) {
            toggleEditingMode(page, item.id, listId);
        });
    }
}
function ensureItemEditingModeIsClosed(page, listId, id) {
    var item = document.getElementById(id);
    if (item.classList.contains('editing-mode')) {
        toggleEditingMode(page, id, listId);
    }
}
/**
 * Determines what text saveButton should have.
 * Checks for unsaved changes and gives appropriate feedback
 */
function determineSaveButtonText(page, listId) {
    return __awaiter(this, void 0, void 0, function () {
        var currentListAsArray, infoForPhp, data, lastSavedListAsArray, infoForPhp, data, lastSavedListAsArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentListAsArray = convertListToArray(page, 'activeList') // eg. Array(3) [ (4) […], (4) […], (4) […] ] -> 0: Array(4) [ "37", "fear is the key", "alistair maclean", … ]
                    ;
                    if (!(page == 'index')) return [3 /*break*/, 2];
                    infoForPhp = { POSTValue: listId };
                    return [4 /*yield*/, fetchFileAndPostData('php/findLists.php', infoForPhp)];
                case 1:
                    data = _a.sent();
                    lastSavedListAsArray = data;
                    if (JSON.stringify(currentListAsArray) == JSON.stringify(lastSavedListAsArray)) {
                        setSaveButtonTextTo('&check; Saved');
                    }
                    else {
                        setSaveButtonTextTo('● Save lists');
                    }
                    return [3 /*break*/, 4];
                case 2:
                    infoForPhp = { POSTValue: listId };
                    return [4 /*yield*/, fetchFileAndPostData('php/findListItems.php', infoForPhp)];
                case 3:
                    data = _a.sent();
                    data.forEach(function (element) {
                        // remove entry 1 and 2 (in_list and place)
                        element.splice(1, 2);
                    });
                    lastSavedListAsArray = data;
                    if (JSON.stringify(currentListAsArray) == JSON.stringify(lastSavedListAsArray)) {
                        setSaveButtonTextTo('&check; Saved');
                    }
                    else {
                        setSaveButtonTextTo('● Save changes');
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Define the saveButton's text
 */
function setSaveButtonTextTo(text) {
    var saveButton = document.getElementById('saveButton');
    saveButton.innerHTML = text;
}
/**
 * Convert chosen list to array with one array per item
 * Item arrays in trashed lists will include the item's place
 * before it were trashed
 * @param {string} activeListOrTrashList
 */
function convertListToArray(page, activeListOrTrashList) {
    var listAsArray = [];
    var listItems = document.querySelectorAll("#" + activeListOrTrashList + " li");
    /* For each list item, find its different values,
    and build the text string */
    for (var i = 0; i < listItems.length; i++) {
        var itemAsArray = convertItemToArray(page, activeListOrTrashList, listItems[i]);
        listAsArray.push(itemAsArray);
    }
    return listAsArray;
}
function convertItemToArray(page, activeListOrTrashList, listItem) {
    var id = listItem.id;
    var title = listItem.querySelector('.title').innerHTML;
    if (page == 'index') {
        var itemAsArray = [id, title];
    }
    else {
        var artist = listItem.querySelector('.artist').innerHTML;
        var imageSourcePath = listItem.querySelector('img').src;
        var imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7);
        if (activeListOrTrashList == 'trashList') {
            var place = findItemPlaceBeforeItWasTrashed(listItem);
            var isTrashed = '1';
            var itemAsArray = [id, title, artist, imageFilename, place, isTrashed];
        }
        else {
            var isTrashed = '0';
            var itemAsArray = [id, title, artist, imageFilename, isTrashed];
        }
    }
    return itemAsArray;
}
/**
 * Just as the item was trashed from active list,
 * its place in that list was saved in a class name in <li>.
 * Class name example: "its-activelist-place-was-4"
 */
function findItemPlaceBeforeItWasTrashed(item) {
    if (item.className.slice(0, 25) != 'its-activelist-place-was-') {
        console.error('Items className is changed from its-activelist-place-was-[number]. findItemPlaceBeforeItWasTrashed() expects the item className to be 26 chars long');
        console.info('item.className:', item.className);
        console.info('item.className.length:', item.className.length);
    }
    return item.className.slice(25, 26); // eg. 4
}
function goToList(listId) {
    var isSaved = document.getElementById('saveButton').innerHTML;
    if (isSaved != '✓ Saved') {
        var willRemoveChanges = confirm('Leaving this page will remove unsaved changes, continue?');
        if (willRemoveChanges == true) {
            location.assign("list.html?list=" + listId);
        }
    }
    else {
        location.assign("list.html?list=" + listId);
    }
}
function returnHome() {
    var isSaved = document.getElementById('saveButton').innerHTML;
    if (isSaved != '✓ Saved') {
        var willRemoveChanges = confirm('Leaving this page will remove unsaved changes, continue?');
        if (willRemoveChanges == true) {
            location.assign('index.html');
        }
    }
    else {
        location.assign('index.html');
    }
}
/**
 * A Function for helping with sending values to PHP, without the user is providing any user input.
 * Code's made by Anders_bondehagen on
 * https://forums.fusetools.com/t/how-do-i-receive-post-data-in-php-sent-from-fuse-javascript-by-fetch/5357/3
 * NB. This converts any array into csv based string
 */
function formEncode(obj) {
    var str = [];
    for (var p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
}
