/**
 * Web application frame, including navigation bar, login, etc.
 */

class appFrame extends ui {
    constructor(){
        super();
        this.new_deviceName = "";
        this.new_id = "";
        this.new_ip = "";
        this.new_tagConfig = "";
        this.new_description = "";  
        this.status = "";
        this.id = ""; 
    }

    get html(){
        return `
        <!--${ this.name } -->
    <!-- nav Bar -->
    <div class="nav">
        <nav class="bg-gray-800 mb-2">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div class="relative flex h-16 items-center justify-between">
                    <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                     
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <!-- buttom -->
                        <div class="relative ml-3">
                            <div>
                                <button type="button" id="@{_signIn}" class="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-blue-700 py-2 px-4 border border-blue-500 hover:border-transparent rounded"> Sign In</button>
                                <button type="button" id="@{_signOut}" class="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-blue-700 py-2 px-4 border border-blue-500 hover:border-transparent rounded"> Sign out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Status Bar Section-->
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline"> @{status} </span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>

    </div>
    

    <!-- login Section -->
    <div id="@{_login}" class="grid gap-4 mb-6 md:grid-cols-2" style="padding:3%">
        <div class="p-4 m-4 border rounded-lg" style="padding:10%; width:70%; align:center">
            <h1 class="m-4"> Login </h1>
            <div class="bg-gray-100 p-14" >
                <div style="margin:5px; padding:10px">
                    <label for=""
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                        user name </label>
                    <input type="text" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="@{_userName}" value="userName" />
                </div>

                <div style="margin:5px; padding:10px">
                    <label for=""
                        class="block mb-2 text-sm font-medium text-gray-900  dark:text-black">
                        password </label>
                    <input type="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="@{_userPassword}" value="userPassword" />
                </div>

                <div  style="margin:5px; padding:10px" class="my-2 py-2">
                    <button id="@{_loginBtn}" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-blue-700 py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                        Login
                    </button> 
                    <button class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-blue-700 py-2 px-4 border border-red-500 hover:border-transparent rounded">
                        Cancel
                    </button> 
                </div>
            </div>
        </div>
        <div class=""> 
            <img src="../src/login.svg"/> 
        </div>
    </div>
    
    <!-- controls Div -->
    <div id="@{_controlsDiv}"></div>
  
        `
    }

    Init(){ 
        this._controlsDiv.style.display = 'none';

        // As we are using CSS transforms (in tailwind CSS), it is not possible to set an element fixed to the browser viewport.
        // A workaround is to move the modal element out of the elements styled by the transform.
        // this._topLevelParent._controlsDiv.prepend(this._login);

        // Delete modal when this control is removed
        // this.on('remove', () => {
        //   this._modalDeviceDetails.remove();  
        // });  

        this.on('connect', () => {
            console.log(socket.id);
        })
        // this._login.setAttribute('class', 'invisible');

        this._signOut.addEventListener('click',() =>{
            // this._login.setAttribute('class', 'visible');
            this._controlsDiv.style.display = 'block';
        });

        this._signIn.addEventListener('click',() =>{
            // this._login.setAttribute('class', 'visible');
            this._login.style.display = 'none';
        });

        this._loginBtn.addEventListener('click',() =>{
            console.log('login',this._userName.value,this._userPassword.value);
            this.emit('login', {
                username: this._userName.value,
                password: this._userPassword.value
            }, 'top');
            this._login.style.display = 'none';
            this._controlsDiv.style.display = 'block';
        });
    }
}