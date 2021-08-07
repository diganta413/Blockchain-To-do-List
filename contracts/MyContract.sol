pragma solidity >=0.4.22 <0.9.0;

contract MyContract {
    uint256 public taskCount = 0;

    struct task {
        uint256 id;
        string content;
        bool completed;
    }

    event create_task(uint256 id, string content, bool completed);
    event toggle_completed(uint256 id, bool completed);

    mapping(uint256 => task) public tasks;

    constructor() public {
        create("Computer Architecture");
    }

    function create(string memory _content) public {
        taskCount++;
        tasks[taskCount] = task(taskCount, _content, false);
        emit create_task(taskCount, _content, false);
    }

    function toggleCompleted(uint256 _id) public {
        task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit toggle_completed(_id, _task.completed);
    }
}
