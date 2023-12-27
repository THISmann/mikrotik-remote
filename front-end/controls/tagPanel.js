//const { Socket } = require("socket.io");

class tagPanel extends ui {
    constructor() {
        super();
        this.tagName = 'New Tag';
        this.description = '';
        this.unit = '';
    }

    get html() {
        return `
        <div class="bg-blue-200 rounded-md p-1 m-1">
            <div class="bg-blue-500 grid gap-4 m-1 md:grid-cols-4 p-3 rounded-md">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tag Name</label>
                    <input type="text" value="@{tagName}"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>

                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> Unit </label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value="@{unit}">
                        <option value="MB | GB"> MB  GB </option>
                        <option value="ZAR | XAF"> ZAR  XAF</option>
                    </select>
                </div>

                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> Description </label>
                    <input type="text" value="@{description}"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>

                <div>
                    <button class="text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" id="@{_save}"> Save </button>

                    <button type="button" id="@{_remove}"
                        class="my-7 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                        Remove  
                    </button>
                </div>

               
            </div>

         

            <div id="@{_controlsDiv}"></div>
                         
        </div>
        `;
    }

    Init() {
        this._remove.addEventListener('click', () => {
            this.SetData({remove: true});
        });

        // this._save.addEventListener('click', () => {
        //     this.tagPanelData = {
        //         "tagName" : this.tagName,
        //         "description" : this.description,
        //         "unit" : this.unit,
        //         "extractAction": [],
        //         "modifyAction": []
        //     }
        //     //console.log(this.tagPanelData)
        //     socket.emit('tagPanelData', this.tagPanelData)
        // });

        // Add lists for extract and modify actions
        
        this.SetData({
            extractAction: {
                controlType: "tagList",
                displayName: "Extract actions",
                childControlType: "tagExtractAction",
            },
            modifyAction: {
                controlType: "tagList",
                displayName: "Modify actions",
                childControlType: "tagModifyAction",
            }
        });

      //  console.log("panel",this.tagPanel);

    }
}