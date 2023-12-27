/**
 * addUserAction
 */

class userActionConfig extends ui {
    constructor() {
        super();
        this.userAction = "";
        this.scriptName = "";
        this.description = "";

    }

    get html(){
        return`
        <!-- ${this.device_name} -->
        <div class="grid gap-4 m-1 md:grid-cols-4">
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> userAction  Name</label>
                <input type="text" value="@{userAction}"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>

            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> Script Name</label>
                <input type="text" value="@{scriptName}"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>

            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> Description </label>
                <input type="text" value="@{description}"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>

            <div>
            <div>
                <button type="button" id="@{_remove}"
                    class="my-7 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    Remove  
                </button>
        </div>
            </div>
        </div>
        `
    }

    Init(){
        this._remove.addEventListener('click', () => {
            this.SetData({remove: true});
        });

        // Create an associated userAction control in the device control
        let device = this._parent._parent;
        let actionButtonName = this.name + "_btn";
        device.SetData({
            [actionButtonName]: {
                controlType: "userAction",
                userAction: this.userAction,
                scriptName: this.scriptName,
                description: this.description,
                parentElement: "_userActionButtons",
                hideData: true,
            }
        });

        device.on(actionButtonName, control => {
            this.on('userAction', val => { control.userAction = val });
            this.on('userAction', val => { control.scriptName = val });
            this.on('userAction', val => { control.description = val });
        });

        // Remove the associated user action button
        this.on('remove', () => {
            device.SetData({
                [actionButtonName]: {
                    remove: true
                }
            })
        });
    }
}