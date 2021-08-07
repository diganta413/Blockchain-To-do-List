App = {
    contracts: {},
    load: async () => {
       await App.loadweb3()
       await App.test()
       await App.loadAccount()
       await App.loadContract()
       await App.render()
       await App.renderTasks()
    },
    loadweb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    loadAccount: async () => {
        web3.eth.getAccounts().then(e => {
            //document.getElementsByTagName("h1")[0].textContent = e[0]
            document.getElementById("account").textContent = "Account:- " + e[0]
            App.account = e[0]
        })
    },
    test: async () => {
       var version = web3.version.api
       console.log(version)   
    },
    loadContract: async () => {
        const mycontract = await $.getJSON('MyContract.json')
        console.log(mycontract)
        App.contracts.todolist = TruffleContract(mycontract)
        App.contracts.todolist.setProvider(App.web3Provider)
        App.todolist = await App.contracts.todolist.deployed()
    },
    renderTasks: async () => {
        const taskCount = await App.todolist.taskCount();
        console.log(taskCount.toNumber())
        const tasks = await App.todolist.tasks(2)
        console.log(tasks)
        for(var i=1;i<=taskCount;i++){
            const task = await App.todolist.tasks(i)
            const taskid = task[0].toNumber()
            const content = task[1];
            const completed = task[2];
            var _task = document.createElement("li")
            _task.innerHTML = `<div class="d-flex justify-contents-left align-items-center">
                <input type="checkbox" onchange="App.toggleCompleted(event)" class="form-check-input mt-0" ${completed?"checked":"!checked"} id=${taskid} />
                <label for=${taskid} class="task_label">${content}</label>
            </div>`
            _task.className = "list-group-item"
            if(task[2] == false)
            {
                document.getElementById("tasks").appendChild(_task)
            }
            else
            {
                document.getElementById("completed_tasks").appendChild(_task)
            }
        }    
    }, 
    create_task: async () => {
        var task_name = document.getElementById("task_name").value
        var res = await App.todolist.create(task_name,{from: App.account})
        console.log(task_name)
        window.location.reload()
    },
    toggleCompleted: async (e) => {
        var id = e.target.id;
        console.log(id)
        var res = await App.todolist.toggleCompleted(id,{from: App.account})
        window.location.reload()
    },    
    render: async () => {
        
    }
}

window.onload = () => {
    App.load()
}