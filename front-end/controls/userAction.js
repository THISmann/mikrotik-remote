/**
 * userAction
 */
 

class userAction extends ui {
    constructor(){
        super();
        this.userAction = "";
        this.scriptName = "";
        this.description = "";
    }

    get html(){
        return `
            <!-- ${this.userAction} -->
            <div class="grid grid-cols-3 gap-4 bg-gray-50 px-4 py-3 sm:flex sm:px-6 ">  
                <div class="">
                    <button  id="@{_getAction}"class="w-36 bg-transparent hover:bg-blue-100 text-blue-700 font-semibold hover:text-blue-500 py-2 px-4 border border-blue-500 hover:border-transparent rounded">@{userAction}</button> 
                </div>
                
                <div class="">
                    <button type="button" id="@{_getActionFailled}" class="bg-transparent hover:bg-red-300 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
                        Failled !!!
                    </button>  
                </div>

                <div class="">
                    <button type="button" id="@{_getActionSuccess}" class="bg-transparent hover:bg-green-300 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
                        success 
                    </button>  
                </div>

                <div class="">
                    <button type="button" id="@{_getActionRunning}" class="bg-transparent hover:bg-blue-200 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-200 hover:border-transparent rounded">
                        running...
                    </button> 
                </div>
            </div> 

        `
    }

    Init(){

        this._getActionRunning.style.display = 'none';
        this._getActionFailled.style.display = 'none';
        this._getActionSuccess.style.display = 'none';

         // run Action from the Server to the device 
         this._getAction.addEventListener('click',() => { 
            this.emit("getAction", {
                id: this._parent.id,
                ip: this._parent.ip,
                deviceUsername: this._parent.device_username,
                devicePassword: this._parent.device_password,
                deviceCommand: this.scriptName,
            }, 'top');
            this._getActionRunning.style.display = '';
        });

        this.on('Success', () => { 
            console.log('success',this._parent.id, this.scriptName);
            this._getActionRunning.style.display = 'none';
            this._getActionSuccess.style.display = '';
        });

        // controls.on(`${this._parent.id}.${this.scriptName}.Success`, () => {
        //     this._getActionRunning.style.display = 'none';
        //     this._getActionSuccess.style.display = '';
        // });

        this.on('Failled', () => { 
            console.log('fail',this._parent.id, this.scriptName);
            this._getActionRunning.style.display = 'none';
            this._getActionFailled.style.display = '';
        });

        // controls.on(`${this._parent.id}.${this.scriptName}.Failled`, () => { 
        //     this._getActionRunning.style.display = 'none';
        //     this._getActionFailled.style.display = '';
        // });

    }
}