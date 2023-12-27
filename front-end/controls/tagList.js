/**
 * Generic list control with configurable add button
 */
class tagList extends ui {
    /**
     * @param {String} addBtnText - Add button display text
     * @param {String} childControlType - Control type of child controls
     */
    constructor() {
        super();
        this.addBtnText = 'Add';
        this.childControlType = 'tagPanel';
        this.displayName = 'New List';
    }

    get html() {
        return `
        <div class="p-1">
            <div class="grid gap-6 md:grid-cols-6">
                <div>   
                    <span class="w-40">@{displayName}</span> 
                </div>
                <div>    
                    <button id="@{_add}" class="mx-3 bg-transparent hover:bg-black-100 text-blue-700 font-semibold hover:text-blue py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>      
                    </button>
                </div>
                <div> </div>
            </div>
            
            <div id="@{_controlsDiv}"></div>

        </div>
        `;
    }

    Init() {
        // Add new child control when Add button is clicked
        this._add.addEventListener('click', () => {
            let newChild = { [this.childControlType + this._generateUuid()]: {
                controlType: this.childControlType,
            }};

            //console.log('newchild !!!',newChild);

            this.SetData(newChild);
            this._notify(newChild);
        });
    }
}