class tagExtractAction extends ui {
    constructor() {
        super();
        this.type = 'include';
        this.description = 'New tag extract action';
        this.regEx = '';
        this.flags = 'gmi';
    }

    get html() {
        return `
        <div class="p-1 bg-blue-100 rounded-md m-1">
            <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-4 md:grid-cols-2">
                <div class="">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Type</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value="@{type}">
                        <option value="include">Include</option>
                        <option value="exclude">Exclude</option>
                    </select>
                </div>

                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">flags</label>
                    <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value="@{flags}"/>
                </div>
            </div>
            <div>
                <div class="flex">
                    <div class="w-96">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Regular Expression</label>
                        <textarea class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" value="@{regEx}">@{regEx}</textarea>
                    </div>

                    <div class="my-9 mx-2">
                        <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" id="@{_extractActionRemove}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg> 
                        </button>
                    </div>
                </div>
            </div>
        </div>
             
            
        </div>
        `;
    }

    Init() {
        this._extractActionRemove.addEventListener('click', () => {
            this.SetData({remove: true});
        });
        
        // this._extractActionSave.addEventListener('click', () => { 
        //     this.tagExtractAction = {
        //         "type" : this.type,
        //         "flags" : this.flags,
        //         "regEx" : this.regEx,
        //     }
        //     socket.emit('tagExtractAction', this.tagExtractAction);
        // });


    }
}