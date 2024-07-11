import htmx from "htmx.org";
import { HtmxEvent } from "htmx.org";

// The data param must be an object with at least two values.
let updateTable = (target: HTMLElement, data: object[]) => {
    target.innerHTML =
        Array.isArray(data) && data.length
            ? ""
            : `
        <tr>
            <td class="py-3"></td>
        </tr>`;
    data.forEach((dataRow) => {
        let row = document.createElement("tr");
        row.classList.add("border-b", "border-gray-400", "text-gray-700");
        let cell = document.createElement("td");
        cell.classList.add(
            ..."py-2 w-1/2 px-4 border-r border-gray-400".split(" ")
        );

        let cellLeft = cell;
        cellLeft.innerText = Object.values(dataRow)[0];

        let cellRight = cell.cloneNode() as HTMLTableCellElement;
        cellRight.innerText = Object.values(dataRow)[1];

        row.append(cellLeft, cellRight);
        target.append(row);
    });
};

interface HTMXBeforeSwapEvent extends Event {
    detail: {
        elt: HTMLElement;
        xhr: XMLHttpRequest;
        shouldSwap: boolean;
        target: HTMLElement;
        serverResponse: string;
    };
}
htmx.on("#data-table", "htmx:beforeSwap", (ev) => {
    let event = ev as HTMXBeforeSwapEvent
    if (event.detail.xhr.status === 200) {
        /** @type {{priority: string, message: string}[]} */
        const data = JSON.parse(event.detail.serverResponse);

        /** @type {HTMLElement}*/
        const target = event.detail.target;
        updateTable(target, data);

        event.detail.shouldSwap = false;
    } else console.log("Something went wrong");
});

;
htmx.on("#processed-data-table", "htmx:beforeSwap", (ev) => {
    let event = ev as HTMXBeforeSwapEvent
    if (event.detail.xhr.status === 200) {
        /** @type {{timestamp: string, message: string}[]} */
        const data = JSON.parse(event.detail.serverResponse);

        /** @type {HTMLElement}*/
        const target = event.detail.target;
        updateTable(target, data);

        event.detail.shouldSwap = false;
    }
});
