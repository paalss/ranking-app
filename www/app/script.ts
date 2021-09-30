"use strict";
type PageAlternatives = "index" | "list";

window.onload = () => {
  // Determine which html-page is open
  const pageAddress = window.location.search;
  if (pageAddress == "") {
    var page: PageAlternatives = "index";
  } else {
    // pageAddress == " ?list=x"
    var page: PageAlternatives = "list";
  }

  const GETparameter = window.location.search.substr(1); // eg. 'list=1', 'list=2'
  const listId = GETparameter.substring(GETparameter.indexOf("=") + 1); // eg. '1', '2'

  if (page == "index") {
    renderList(page);
    addClickListenerToHeaderButtons(page, listId);
  } else {
    fetch("php/findLists.php")
      .then((res) => res.json())
      .then((lists) => {
        // eg. Array [ (2) […], (2) […] ] -> 0: Array [ "1", "books" ]
        var arrayIndex = 0;
        lists.forEach((listInfo: any[]) => {
          if (listInfo[0] == listId) {
            const listName = listInfo[1];
            setTitle(listName);
          } else {
            arrayIndex++;
          }
        });
      });
    renderList(page, listId);
    addClickListenerToHeaderButtons(page, listId, GETparameter);
  }
};

function setTitle(listName: string) {
  const h2 = document.querySelector("h2")!;
  h2.innerHTML = "List: " + listName;
}

async function renderList(page: PageAlternatives, listId?: string) {
  if (page == "index") {
    fetch("php/findLists.php")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item: string[]) => {
          const id = item[0];
          const itemContent = { title: item[1] };
          renderItem(page, "", id, itemContent);
        });
      });
  } else {
    const infoForPhp = { POSTValue: listId };
    const data = await fetchFileAndPostData(
      "php/findListItems.php",
      infoForPhp
    );
    data.forEach((item: any[]) => {
      const id = item[0];
      const itemContent = { title: item[3], artist: item[4], image: item[5] };
      const isTrashed = item[6];
      const place = item[2];
      if (listId != undefined) {
        renderItem(page, listId, id, itemContent, isTrashed, place);
      }
    });
  }
  setSaveButtonTextTo("&check; Saved");
}

interface ItemContentObject {
  title: string;
  artist?: string;
  image?: string;
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
function renderItem(
  page: PageAlternatives,
  listId: string,
  id: string,
  itemContent: ItemContentObject,
  isTrashed?: boolean,
  originalPlace?: string,
  insertAtOriginalPlace?: boolean
) {
  const li = document.createElement("li");
  if (isTrashed == true) {
    var list = document.getElementById("trashList")!;
  } else {
    var list = document.getElementById("activeList")!;
  }
  if (!insertAtOriginalPlace) {
    list.appendChild(li);
  } else {
    const itemAtOriginalPlace = document.querySelector(
      `#activeList li:nth-child(${originalPlace})`
    );
    list.insertBefore(li, itemAtOriginalPlace);
  }
  if (page == "index") {
    li.outerHTML = `
      <li id="${id}">
        <div class="flex-row">
          <form class="edit-item">
            <button class="link title" id="${id}">${itemContent.title}</button>
            <button class="round-button toggle-editing-mode-button">Rename</button>
          </form>
          <!--<button class="round-button trash-item-button">Delete list</button>-->
        </div>
      </li>
    `;
    addClickListenerToListItemButtons(page, id);
  } else {
    if (isTrashed == true) {
      li.outerHTML = `
        <li id="${id}" class="its-activelist-place-was-${originalPlace}">
          <div class="flex-row">
            <div class="image">
              <img src="images/${itemContent.image}" alt="${itemContent.image}">
            </div>
            <form class="edit-item">
              <div class="text-width">
                <span id="title" class="title">${itemContent.title}</span><br>
                <span id="artist" class="artist">${itemContent.artist}</span>
              </div>
              <button class="round-button toggle-editing-mode-button">Edit</button>
            </form>
            <button class="round-button restore-item-button">Restore</button>
            <button class="round-button red-button delete-item-button">Delete</button>
          </div>
        </li>`;
    } else {
      li.outerHTML = `
        <li id="${id}">
          <div class="flex-row">
            <div class="image">
              <img src="images/${itemContent.image}" alt="${itemContent.image}">
            </div>
            <form class="edit-item">
              <div class="text-width">
                <span id="title" class="title">${itemContent.title}</span><br>
                <span id="artist" class="artist">${itemContent.artist}</span>
              </div>
              <button class="round-button toggle-editing-mode-button">Edit</button>
            </form>
            <button class="round-button trash-item-button">Trash</button>
            <button class="round-button move-item-up-button"><div class="arrow-up"></div></button>
            <button class="round-button move-item-down-button"><div class="arrow-down"></div></button>
          </div>
        </li>
      `;
    }
    addClickListenerToListItemButtons(page, id, listId, isTrashed);
  }
  formEditLiPreventDefault(id);
}

/**
 * Add click event listeners to header buttons
 * @param {string} GETparameter 'list=___'
 */
function addClickListenerToHeaderButtons(
  page: PageAlternatives,
  listId: string,
  GETparameter?: string
) {
  if (page == "index") {
    document
      .getElementById("createItemButton")!
      .addEventListener("click", () => createItem(page));
    document
      .getElementById("saveButton")!
      .addEventListener("click", () => saveList(page, listId));
  } else {
    document
      .getElementById("createItemButton")!
      .addEventListener("click", () => createItem(page, listId));
    document
      .getElementById("returnHomeButton")!
      .addEventListener("click", () => returnHome());
    document
      .getElementById("saveButton")!
      .addEventListener("click", () => saveList(page, listId));
    document
      .getElementById("refreshButton")!
      .addEventListener("click", () =>
        location.assign("list.html?" + GETparameter)
      );
  }
}

/**
 * Add click event listeners to list item buttons
 * @param {number} id list item ID
 */
function addClickListenerToListItemButtons(
  page: PageAlternatives,
  id: string,
  listId?: string,
  isTrashed?: boolean
) {
  const item = document.getElementById(id)!;
  if (page == "index") {
    item.querySelector(".title")!.addEventListener("click", () => goToList(id));
    item
      .querySelector(".toggle-editing-mode-button")!
      .addEventListener("click", () => toggleEditingMode(page, id));
    // item.querySelector('.trash-item-button')!.addEventListener('click', () => trashItem(page, id))
  } else {
    if (listId != undefined) {
      item.addEventListener("drop", () =>
        determineSaveButtonText(page, listId)
      );
      item
        .querySelector(".toggle-editing-mode-button")!
        .addEventListener("click", () => toggleEditingMode(page, id, listId));
      if (isTrashed == true) {
        item
          .querySelector(".restore-item-button")!
          .addEventListener("click", () => restoreItem(page, id, listId));
        item
          .querySelector(".delete-item-button")!
          .addEventListener("click", () => deleteItem(page, id));
      } else {
        item
          .querySelector(".trash-item-button")!
          .addEventListener("click", () => trashItem(page, id, listId));
        item
          .querySelector(".move-item-up-button")!
          .addEventListener("click", () => moveItem(page, id, "up", listId));
        item
          .querySelector(".move-item-down-button")!
          .addEventListener("click", () => moveItem(page, id, "down", listId));
      }
    } else {
      console.error("listId: ", listId);
    }
  }
}

// Make list sortable with drag and drop
new Sortable(activeList, {
  animation: 150,
  ghostClass: "blue-background-class",
});

async function createItem(page: PageAlternatives, listId?: string) {
  const id = await findFreeLiId(page);
  if (id != undefined) {
    if (page == "index") {
      const itemContent = { title: "" };
      renderItem(page, "", id, itemContent);
      toggleEditingMode(page, id); // turn on editing mode for this item
    } else {
      const itemContent = { title: "", artist: "", image: "default.png" };
      if (listId != undefined) {
        renderItem(page, listId, id, itemContent);
      } else {
        console.error("undefined value:")
        console.log("listId:", listId)
      }
      toggleEditingMode(page, id, listId); // turn on editing mode for this item
      determineSaveButtonText(page, listId);
    }
  } else {
    console.error("undefined value:");
    console.log("id: ", id);
    console.log("listId: ", listId);
  }
}

function highlight(item: HTMLElement) {
  item.style.transition = "background-color 0ms linear";
  item.style.backgroundColor = "rgb(34, 34, 34)";
  setTimeout(() => {
    item.style.transition = "background-color 500ms linear";
    item.style.backgroundColor = "";
  }, 500);
}

/**
 * Move list item in a direction
 * @param {number} liNo
 * @param {string} direction up or down
 */
function moveItem(
  page: PageAlternatives,
  liNo: string,
  direction: "up" | "down",
  listId: string
) {
  const itemToMove = document.getElementById(liNo)!;
  const ol = document.getElementById("activeList")!;
  if (direction == "up") {
    /* Move chosen item up
    as long as it's not at the top of the list */
    const element = itemToMove;
    const previousElement = itemToMove.previousElementSibling;
    if (previousElement != null) {
      ol.insertBefore(element, previousElement);
    }
  } else {
    /* Move chosen item down
    as long as it's not at the bottom of the list */
    const element = itemToMove;
    const nextElement = itemToMove.nextElementSibling;
    if (nextElement != null) {
      ol.insertBefore(nextElement, element);
    }
  }
  highlight(itemToMove);
  determineSaveButtonText(page, listId);
}

function trashItem(page: PageAlternatives, id: string, listId: string) {
  /* function convertItemToArray (also invoked by findItemPlace)
  doesn't work if list items are in editing mode */
  ensureItemEditingModeIsClosed(page, listId, id);

  const itemToTrash = document.getElementById(id)!;
  const activeList = document.getElementById("activeList")!;
  const originalPlace = findItemPlace(page, id);
  const isTrashed = true;

  const itemAsArray = convertItemToArray(page, "activeList", itemToTrash);
  const title = itemAsArray[1];
  const artist = itemAsArray[2];
  const image = itemAsArray[3];

  /* Remove item from active list, and add a similar item to trash list.
  It will look like the item has moved to trash and changed its structure */
  activeList.removeChild(itemToTrash);
  /* The “originalPlace” parameter below is for letting
  the trashed item remember its place in the active list. */
  renderItem(
    page,
    listId,
    id,
    { title, artist, image },
    isTrashed,
    originalPlace
  );
  determineSaveButtonText(page, listId);
}

function restoreItem(page: PageAlternatives, id: string, listId: string) {
  /* function convertItemToArray
  doesn't work if list items are in editing mode */
  ensureItemEditingModeIsClosed(page, listId, id);

  const itemToRestore = document.getElementById(id)!;
  const trashList = document.getElementById("trashList")!;
  const originalPlace = findItemPlaceBeforeItWasTrashed(
    document.getElementById(id)!
  );
  const isTrashed = false;
  const insertAtOriginalPlace = true;

  const itemAsArray = convertItemToArray(page, "activeList", itemToRestore);
  const title = itemAsArray[1];
  const artist = itemAsArray[2];
  const image = itemAsArray[3];

  /* Remove item from trash list, and add a similar item to active list.
  It will look like the item has moved to active list and changed its structure */
  trashList.removeChild(itemToRestore);
  /* The “originalPlace” and “insertAtOriginalPlace” lets the item know it has to be
  inserted to its original place */
  renderItem(
    page,
    listId,
    id,
    { title, artist, image },
    isTrashed,
    originalPlace,
    insertAtOriginalPlace
  );
  determineSaveButtonText(page, listId);
}

function findItemPlace(page: PageAlternatives, id: string): string {
  const listAsArray = convertListToArray(page, "activeList");
  const index = listAsArray.findIndex((itemAsArray) => itemAsArray[0] == id);
  const place = index + 1;
  return place.toString();
}

function toggleEditingMode(
  page: PageAlternatives,
  id: string,
  listId?: string
) {
  const item = document.getElementById(id)!;
  // if editing mode is open, close it
  if (item.classList.contains("editing-mode")) {
    item.classList.remove("editing-mode");

    const divEditItem = item.querySelector(".edit-item")!;
    const title = (<HTMLInputElement>item.querySelector(".title")!).value; // (<HTMLInputElement>…) is necessary for receiving the “.value” according to TypeScript

    if (page == "index") {
      divEditItem.innerHTML = `
        <button class="link title" id="${id}">${title}</button>
        <button class="round-button toggle-editing-mode-button">Edit title</button>
      `;
      divEditItem
        .querySelector(".title")!
        .addEventListener("click", () => goToList(id));
      divEditItem
        .querySelector(".toggle-editing-mode-button")!
        .addEventListener("click", () => toggleEditingMode(page, id));
      determineSaveButtonText(page);
    } else {
      const artist = (<HTMLInputElement>item.querySelector(".artist")!).value;
      const divImage = item.querySelector(".image")!;
      const imageSourcePath = item.querySelector("img")!.src;
      const imageFilename = imageSourcePath.substring(
        imageSourcePath.indexOf("images/") + 7
      );

      divImage.innerHTML = `
        <img src="images/${imageFilename}" alt="${imageFilename}">
      `;

      divEditItem.innerHTML = `
        <div class="text-width">
          <span id="title" class="title">${title}</span><br>
          <span id="artist" class="artist">${artist}</span>
        </div>
        <button class="round-button toggle-editing-mode-button">Edit</button>
      `;
      divEditItem
        .querySelector(".toggle-editing-mode-button")!
        .addEventListener("click", () => toggleEditingMode(page, id, listId));
      const imageUploadInputs = item.querySelector(".image-upload-inputs")!;
      item.removeChild(imageUploadInputs);
      determineSaveButtonText(page, listId);
    }
  } else {
    // If editing mode is closed, open it
    item.classList.add("editing-mode");

    const divEditItem = item.querySelector(".edit-item")!;
    const title = item.querySelector(".title")!.innerHTML;

    if (page == "index") {
      divEditItem.innerHTML = `
        <input class="title" type="text" placeholder="title" value="${title}">
        <button class="round-button toggle-editing-mode-button">Close edit</button>
      `;
      divEditItem
        .querySelector(".toggle-editing-mode-button")!
        .addEventListener("click", () => toggleEditingMode(page, id));
      determineSaveButtonText(page);
    } else {
      const artist = item.querySelector(".artist")!.innerHTML;
      const divImage = item.querySelector(".image")!;
      const imageSourcePath = item.querySelector("img")!.src;
      const imageFilename = imageSourcePath.substring(
        imageSourcePath.indexOf("images/") + 7
      );

      divImage.innerHTML = `
        <img src="images/${imageFilename}" alt="${imageFilename}">
      `;
      divEditItem.innerHTML = `
        <div class="text-width">
          <input class="title" type="text" placeholder="title" value="${title}"><br>
          <input class="artist" type="text" placeholder="artist" value="${artist}">
        </div>
        <button class="round-button toggle-editing-mode-button">Close edit</button>
      `;
      divEditItem
        .querySelector(".toggle-editing-mode-button")!
        .addEventListener("click", () => toggleEditingMode(page, id, listId));

      const imageUploadInputs = document.createElement("div");
      imageUploadInputs.classList.add("image-upload-inputs");
      item.appendChild(imageUploadInputs);

      imageUploadInputs.innerHTML = `
        <form class="image-upload" name="image-upload" method="post" enctype="multipart/form-data">
          upload image
          <input type="file" class="upload-file" name="upload-file"><br>
          <input type="submit" value="Upload image">
        </form>
      `;
      // Ready image upload form
      const form: HTMLFormElement = item.querySelector(".image-upload")!;
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formattedFormData = new FormData(form);
        downloadImage(formattedFormData, id);
      });
      determineSaveButtonText(page, listId);
    }
    const inputTitle = item.querySelector(".title") as HTMLElement;
    inputTitle.focus();
  }
}

function deleteItem(page: PageAlternatives, id: string) {
  const itemToDelete = document.getElementById(id)!;
  if (page == "index") {
    window.alert("You're about to delete an entire list, proceed?");
  }
  itemToDelete.classList.add("deleted-item");
}

function formEditLiPreventDefault(liNo: string) {
  const item = document.getElementById(liNo)!;
  const form = item.querySelector(".edit-item")!;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

async function fetchFileAndPostData(fileToFetch: string, valuesToPost: object) {
  const response = await fetch(fileToFetch, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: formEncode(valuesToPost),
  });
  return await response.json();
}

/**
 * Ask PHP to download image into folder,
 * once it's done, place image in list item
 */
async function downloadImage(formattedFormData: FormData, liNo: string) {
  // PHP attempts to download image
  const response = await fetch("php/placeImgInFolder.php", {
    method: "POST",
    body: formattedFormData,
  });
  // PHP provides feedback about image download attempt
  // Eg. 'did_not_upload' | 'was_not_downloaded' | 'was_downloaded'
  const data = await response.text();

  if (data == "was_not_downloaded") {
    alert("Bilde ble ikke lastet ned");
  } else if (data == "was_downloaded") {
    // Insert image
    const imageFilename =
      document.forms["image-upload"]["upload-file"].files[0].name;
    const item = document.getElementById(liNo)!;
    const divImage = item.querySelector(".image")!;

    divImage.innerHTML = `
      <img src="images/${imageFilename}" alt="${imageFilename}">
    `;
  }
}

/**
 * Finds an ID in which isn't already in use.
 * Neither by any item in the database, nor on any unsaved local item
 * Function is called as a parameter in createItem()
 */
async function findFreeLiId(page: PageAlternatives) {
  // Fetch item Ids from the database
  if (page == "index") {
    var response = await fetch("php/findAllListsId.php");
  } else {
    var response = await fetch("php/findAllListItemsId.php");
  }
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json(); // eg. Array(6) [ (1) […], (1) […], (1) […], (1) […], (1) […], (1) […] ] -> 0: Array [ "1" ]
  const flatData = data.flat(1); // eg. Array(6) [ "1", "2", "11", "3", "4", "5", "9" ]

  // Fetch items from GUI, and add their id to the flatData list
  const unsavedItemIdsNodeList = document.querySelectorAll("li");
  const unsavedItemIds = [...unsavedItemIdsNodeList];
  unsavedItemIds.forEach((element) => {
    flatData.push(element.id);
  }); // Array(10) [ "1", "2", "11", "3", "4", "5", "9", "4", "2", "3", "5" ]

  // Prepare array for looping
  const removedDuplicateData = [...new Set(flatData)]; // eg. Array(7) [ "1", "2", "11", "3", "4", "5", "9" ]
  const sortedData = removedDuplicateData.sort((a, b) => a - b);

  const handledData = sortedData;

  /* Counter: Counting from 1 and upwards. handledData: A list of ids ascending ordered.
  If there's a count number that doesn't match the id, no id is using that number and it's free to use.
  The Id list may not have such "holes", but it will in either case run out of entries eventually. */

  let counter = 1;
  var freeLiId;
  for (let i = 0; i < handledData.length + 1; i++) {
    if (handledData[i] == undefined) {
      freeLiId = counter;
      return freeLiId.toString();
    } else if (counter != handledData[i]) {
      freeLiId = counter;
      return freeLiId.toString();
    } else {
      counter++;
    }
  }
}

/**
 * The only function that makes changes to the database
 * @param {string} page 'index' or 'list'
 * @param {number} listId
 */
async function saveList(page: PageAlternatives, listId: string) {
  /* functions convertListToArray & convertItemToArray
  doesn't work if list items are in editing mode */
  ensureAllEditingModesAreClosed(page, listId);

  // Update database with any new data
  const listAsArray = convertListToArray(page, "activeList");
  const trashListAsArray = convertListToArray(page, "trashList");

  if (page == "index") {
    var itemNo = 0;
    listAsArray.forEach((itemAsArray) => {
      itemNo++;
      const infoForPhp = { updatedItem: itemAsArray, isTrashed: false };
      const data = fetchFileAndPostData("php/updateList.php", infoForPhp);
      if (!data) {
        console.warn("saveList updating: ", data);
      }
    });
  } else {
    // page == 'list'
    var itemNo = 0;
    listAsArray.forEach((itemAsArray) => {
      itemNo++;
      const infoForPhp = {
        updatedItem: itemAsArray,
        place: itemNo,
        listId: listId,
        isTrashed: false,
      };
      const data = fetchFileAndPostData("php/updateListItem.php", infoForPhp);
      if (!data) {
        console.warn("saveList updating: ", data);
      }
    });
    trashListAsArray.forEach((itemAsArray) => {
      const infoForPhp = {
        updatedItem: itemAsArray,
        listId: listId,
        isTrashed: true,
      };
      const data = fetchFileAndPostData("php/updateListItem.php", infoForPhp);
    });
  }

  // Some items are 'deleted from GUI'. Remove those entries from database:
  const deletedItemsIdAsArray = getIdOfDeletedItemsAsArray();
  if (deletedItemsIdAsArray != []) {
    deletedItemsIdAsArray.forEach((deletedItemId) => {
      const infoForPhp = { deletedItem: deletedItemId };
      const data = fetchFileAndPostData("php/deleteListItem.php", infoForPhp);
    });
  }
  setSaveButtonTextTo("&check; Saved");
}

function getIdOfDeletedItemsAsArray(): string[] {
  const deletedItems = document.querySelectorAll("#trashList li.deleted-item");
  const ids = [];
  for (let i = 0; i < deletedItems.length; i++) {
    ids.push(deletedItems[i].id);
  }
  return ids; // eg. Array(3) [ "4", "2", "1" ]. Array []
}

/**
 * Make sure no list item is in editing mode
 */
function ensureAllEditingModesAreClosed(
  page: PageAlternatives,
  listId: string
) {
  const itemsWithEditingMode = document.getElementsByClassName("editing-mode");
  if (itemsWithEditingMode.length > 0) {
    /* itemsWithEditingMode (HTMLCollection) automatically updates when the underlying document is changed.
    To avoid this, make a copy array we can loop through and change the DOM */
    const itemsReference = [...itemsWithEditingMode];

    itemsReference.forEach((item) => {
      toggleEditingMode(page, item.id, listId);
    });
  }
}

function ensureItemEditingModeIsClosed(
  page: PageAlternatives,
  listId: string,
  id: string
) {
  const item = document.getElementById(id)!;
  if (item.classList.contains("editing-mode")) {
    toggleEditingMode(page, id, listId);
  }
}

/**
 * Determines what text saveButton should have.
 * Checks for unsaved changes and gives appropriate feedback
 */
async function determineSaveButtonText(
  page: PageAlternatives,
  listId?: string
) {
  const currentListAsArray = convertListToArray(page, "activeList"); // eg. Array(3) [ (4) […], (4) […], (4) […] ] -> 0: Array(4) [ "37", "fear is the key", "alistair maclean", … ]

  if (page == "index") {
    const infoForPhp = { POSTValue: listId };
    const data = await fetchFileAndPostData("php/findLists.php", infoForPhp);
    const lastSavedListAsArray = data;

    if (
      JSON.stringify(currentListAsArray) == JSON.stringify(lastSavedListAsArray)
    ) {
      setSaveButtonTextTo("&check; Saved");
    } else {
      setSaveButtonTextTo("● Save lists");
    }
  } else {
    const infoForPhp = { POSTValue: listId };
    const data = await fetchFileAndPostData(
      "php/findListItems.php",
      infoForPhp
    );

    data.forEach((element: object[]) => {
      // remove entry 1 and 2 (in_list and place)
      element.splice(1, 2);
    });
    const lastSavedListAsArray = data;

    if (
      JSON.stringify(currentListAsArray) == JSON.stringify(lastSavedListAsArray)
    ) {
      setSaveButtonTextTo("&check; Saved");
    } else {
      setSaveButtonTextTo("● Save changes");
    }
  }
}

/**
 * Define the saveButton's text
 */
function setSaveButtonTextTo(text: string) {
  const saveButton = document.getElementById("saveButton")!;
  saveButton.innerHTML = text;
}

/**
 * Convert chosen list to array with one array per item
 * Item arrays in trashed lists will include the item's place
 * before it were trashed
 * @param {string} activeListOrTrashList
 */
function convertListToArray(
  page: PageAlternatives,
  activeListOrTrashList: "activeList" | "trashList"
) {
  const listAsArray = [];
  const listItems = document.querySelectorAll(`#${activeListOrTrashList} li`);

  /* For each list item, find its different values,
  and build the text string */
  for (let i = 0; i < listItems.length; i++) {
    const itemAsArray = convertItemToArray(
      page,
      activeListOrTrashList,
      listItems[i]
    );
    listAsArray.push(itemAsArray);
  }
  return listAsArray;
}

function convertItemToArray(
  page: PageAlternatives,
  activeListOrTrashList: "activeList" | "trashList",
  listItem: Element
) {
  const id = listItem.id;
  const title = listItem.querySelector(".title")!.innerHTML;
  if (page == "index") {
    var itemAsArray = [id, title];
  } else {
    const artist = listItem.querySelector(".artist")!.innerHTML;
    const imageSourcePath = listItem.querySelector("img")!.src;
    const imageFilename = imageSourcePath.substring(
      imageSourcePath.indexOf("images/") + 7
    );
    if (activeListOrTrashList == "trashList") {
      const place = findItemPlaceBeforeItWasTrashed(listItem);
      const isTrashed = "1";
      var itemAsArray = [id, title, artist, imageFilename, place, isTrashed];
    } else {
      const isTrashed = "0";
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
function findItemPlaceBeforeItWasTrashed(item: Element): string {
  if (item.className.slice(0, 25) != "its-activelist-place-was-") {
    console.error(
      "Items className is changed from its-activelist-place-was-[number]. findItemPlaceBeforeItWasTrashed() expects the item className to be 26 chars long"
    );
    console.info("item.className:", item.className);
    console.info("item.className.length:", item.className.length);
  }
  return item.className.slice(25, 26); // eg. 4
}

function goToList(listId: string) {
  const isSaved = document.getElementById("saveButton")!.innerHTML;
  if (isSaved != "✓ Saved") {
    const willRemoveChanges = confirm(
      "Leaving this page will remove unsaved changes, continue?"
    );
    if (willRemoveChanges == true) {
      location.assign(`list.html?list=${listId}`);
    }
  } else {
    location.assign(`list.html?list=${listId}`);
  }
}

function returnHome() {
  const isSaved = document.getElementById("saveButton")!.innerHTML;
  if (isSaved != "✓ Saved") {
    const willRemoveChanges = confirm(
      "Leaving this page will remove unsaved changes, continue?"
    );
    if (willRemoveChanges == true) {
      location.assign("index.html");
    }
  } else {
    location.assign("index.html");
  }
}

/**
 * A Function for helping with sending values to PHP, without the user is providing any user input.
 * Code's made by Anders_bondehagen on
 * https://forums.fusetools.com/t/how-do-i-receive-post-data-in-php-sent-from-fuse-javascript-by-fetch/5357/3
 * NB. This converts any array into csv based string
 */
function formEncode(obj: object) {
  var str = [];
  for (var p in obj) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  }
  return str.join("&");
}

// Export for unit testing
// exports.function = function
