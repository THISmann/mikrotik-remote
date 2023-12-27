/**
 * Section
 */

class device extends ui {
  constructor() {
    super();
    this.log;
    this.device_name = "new Router";
    this.description = "";
    this.online = false;
    this.lastSeen = "";
    this.eventLog = "";
    this.id = "";
    this.ip = "";
    this.technician = "";
    this.device_password = "FUH1234";
    this.device_username = "etienne";
    this.user_action = "";
    this.tag_config = "";
    this.timeSerieData = "";
    this.childControlType = "userAction";
  }

  get html() {
    return `
        <!-- ${this.device_name} -->
        <div class="relative overflow-x-auto shadow-md">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <tbody>
                    <tr class="grid grid-cols-6 gap-5 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <!-- Router Name -->
                        <th scope="row" class="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <div class="pl-3">
                                <div class="text-base font-semibold">@{id}</div>
                                <div class="font-normal text-gray-500">@{ip}</div>
                            </div>
                        </th>
                        <!-- Description -->
                        <td class="px-6 py-4">
                            <p>@{technician}</p>
                        </td>
                        <!-- Online / Offline indication -->
                        <td class="px-6 py-4">
                            <div class="flex items-center"> 
                                <div class="pl-3">
                                    <div id="@{_onlineLabel}" class="text-base font-semibold">last seen:</div>
                                    <div class="font-normal text-gray-500">
                                         <span>@{lastSeen}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <!-- Event Log -->
                        <td class="px-4 py-2 flex">
                            <a type="button" class="px-2 py-4 font-medium text-black-600 dark:text-white-500 hover:bg-blue-300"
                                data-bs-toggle="modal" data-bs-target="#@{_eventLogModal}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="ml-2 w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </a>

                        <!-- User Actions -->
                            <a href="#" type="button" data-bs-toggle="modal" data-bs-target="#@{_userActionModal}"
                                class="px-2 py-4 font-medium text-white-600 dark:text-white-500 hover:bg-blue-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </a> 

                        <!-- Settings --> 
                            <a href="#" type="button" data-bs-toggle="modal" data-bs-target="#@{_settingsModal}"
                                class="px-2 py-4 font-medium text-white-600 dark:text-white-500 hover:bg-blue-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="ml-2 w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </a> 

                        <!-- Delete --> 
                        <a href="#" type="button" data-bs-toggle="modal" data-bs-target="#@{_deleteModal}"
                            class="px-2 py-4 font-medium text-white-600 dark:text-white-500 hover:bg-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </a>
                    </td>

                    </tr>
                </tbody>
            </table>

            <!-- Settings modal -->
            <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="@{_settingsModal}" tabindex="-1" aria-labelledby="exampleModalXlLabel" aria-modal="true" role="dialog">
                <div class="modal-dialog modal-xl relative w-auto pointer-events-none">
                    <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div class="modal-header flex flex-shrink-0 items-center justify-between dark:bg-black text-white p-4 border-b border-gray-200 rounded-t-md">
                            <h5 class="text-xl font-medium leading-normal">
                                <p>@{device_name}</p>
                            </h5>
                            <button type="button"
                                class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body relative p-4">
                                <div class="grid gap-6 mb-6 md:grid-cols-2">
                                 
                                    <div>
                                        <label for="@{_device_name}"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                            Device Name</label>
                                        <input type="text"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            id="@{_device_name}" value="@{device_name}" />
                                    </div>

                                    <div class="">
                                        <label for="@{_ip}"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">device
                                            IP </label>
                                        <input type="text" id="@{_ip}" value="@{ip}"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                             />
                                    </div>
                                    <div>
                                        <label for="@{_technician}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                            technician</label>
                                        <input type="text" id="@{_technician}" value="@{technician}"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
                                    </div>

                                    <div >
                                        <label for="@{_description}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">description</label>
                                        <input type="text" id="@{_description}" value="@{description}"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                    </div>

                                    <div>
                                        <label for="@{_device_username}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                        deviceUsername</label>
                                        <input type="text" id="@{_device_username}" value="@{device_username}"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
                                    </div>

                                    <div >
                                        <label for="@{_device_password}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> Password </label>
                                        <input type="text" id="@{_device_password}" value="@{device_password}"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                    </div>
                                </div>

                                <div class="mb-6">
                                    <label for="@{_user_action}"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> userAction </label>
                                    <textarea id="@{_user_action}" value="@{user_action}"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-00 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    </textarea>
                                </div>
 

                                <div class="mb-6" id="@{_tagConfig}">
                                
                                </div> 

                                <div class="mb-6" id="@{_userActionConfig}">
                                
                                </div>

                                <div>
                                 
                                    <button type="button" data-bs-dismiss="modal"
                                        class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                      close 
                                    </button>

                                </div> 
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal EventLog -->

            <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="@{_eventLogModal}" tabindex="-1" aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
                <div class="modal-dialog modal-lg relative w-auto pointer-events-none">
                    <div
                        class="modal-content border-none flex flex-col w-full pointer-events-auto bg-clip-padding relative bg-white rounded-lg shadow dark:bg-black outline-none text-current">
                        <div
                            class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 class="text-xl font-medium leading-normal text-white" id="exampleModalLgLabel">
                                Event Log
                            </h5>
                            <button type="button"
                                class="btn-close box-content w-4 h-4 p-1 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        
                             <p id="@{_eventLogModalData}"></p> </br>

                        </div> 
                    </div>
                </div>
            </div>


            <!-- Modal userAction -->

            <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="@{_userActionModal}" tabindex="-1" aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
                <div class="modal-dialog modal-lg relative w-auto pointer-events-none">
                    <div
                        class="modal-content border-none flex flex-col w-full pointer-events-auto bg-clip-padding relative bg-white rounded-lg shadow dark:bg-black outline-none text-current">
                        <div
                            class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 class="text-xl font-medium leading-normal text-white" id="exampleModalLgLabel">
                                user Action 
                            </h5> 
                             
                            <button type="button"
                                class="btn-close box-content w-4 h-4 p-1 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="grid grid-cols-3 gap-4 bg-gray-50 px-4 py-3 sm:flex sm:px-6 ">  
                            <div id="@{_userActionButtons}"></div>
                        </div>                    
                    </div>
                </div>
            </div>


            <!-- Delete -->

            <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="@{_deleteModal}" tabindex="-1" aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
                <div class="modal-dialog modal-lg relative w-auto pointer-events-none">
                    <div class="modal-content border-none flex flex-col w-full pointer-events-auto bg-clip-padding relative bg-white rounded-lg shadow dark:bg-black outline-none text-current">
                        <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 class="text-xl font-medium leading-normal text-white" id="exampleModalLgLabel">
                                Delete Device
                            </h5>
                            <button type="button"
                                class="btn-close box-content w-4 h-4 p-1 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        
                        <button type="button" id="@{_removeDevice}" data-bs-dismiss="modal"
                            class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Delete</button>
                        <button type="button" data-bs-dismiss="modal" 
                            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                    </div>

                    </div>
                </div>
            </div>

            <div id="@{_controlsDiv}"></div>

        `;
  }

  Init() { 

    // remove existing devices
    this._removeDevice.addEventListener("click", () => {
      this.emit("req_removeDevice", this.id, "top");
    });

    // this._getTimeSerieData.addEventListener("click", () => {
    //   console.log(this.id);
    //   this.emit("req_getTimeSerieData", this.id, "top");
    // });

    // Set initial event log data received from server on page load
    this._eventLogModalData.textContent = this.eventLog;

    // Add additional event log entries
    this.on("eventLog", (data) => {
      console.log("eventLog 12", this.eventLog);
      this._eventLogModalData.textContent += data;
    });

    // timeSerieData
    this.on("timeSerieData", (data) => {
      console.log("timeSerie", data);
    });

    this.SetData({
      tagConfig: {
        controlType: "tagList",
        childControlType: "tagPanel",
        displayName: "Tag List",
        hideData: true,
        parentElement: "_tagConfig",
      },
      userActionConfig: {
        controlType: "tagList",
        childControlType: "userActionConfig",
        displayName: "userAction List",
        hideData: true,
        parentElement: "_userActionConfig",
      },
    });

    // Wait for tagConfig control to be created
    this.on("tagConfig", (control) => {
      // Monitor for tagConfig changes
      control.on("data", (data) => {
        this.tag_config = JSON.stringify(control.GetData({ sparse: true }));
        this.NotifyProperty("tag_config");
      });

      // Set initial data received from the database
      control.SetData(JSON.parse(this.tag_config));

      // Update child controls on tag config changes
      this.on("tag_config", (data) => {
        control.SetData(JSON.parse(data));
      });
    });

    // wait for User userActionConfig
    this.on("userActionConfig", (control) => {
      // Monitoring for userAction change
      control.on("data", (data) => {
        this.user_action = JSON.stringify(control.GetData({ sparse: true }));
        this.NotifyProperty("user_action");
        console.log(data);
      });

      // Set initial data received from the database
      control.SetData(JSON.parse(this.user_action));

      // Update child controls on user Action changea
      this.on("user_action", (data) => {
        control.SetData(JSON.parse(data));
      });
    });

 
  }
}
