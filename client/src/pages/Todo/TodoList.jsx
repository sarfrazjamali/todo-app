import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import styles from './TodoList.module.css';
import { Button, Divider, Empty, Input, Modal, Select, Tag, Tooltip, message } from 'antd';
import { getErrorMessage } from '../../util/GetError';
import { getUserDetails } from '../../util/GetUser';
import todoServices from '../../services/todoServices';
import { useNavigate } from 'react-router';
import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'

const TodoList = () => {
    const [allTodo, setAllTodo] = useState([]);
    const [title,setTitle] = useState("");
    const [description,setDescription]= useState("");
    const [incompletedTodo, setIncompletedTodo] = useState([]);
    const [completedTodo, setCompletedTodo] = useState([]);
    const [currentTaskType, setCurrentTaskType] = useState("incomplete");
    const [currentTodoTask, setCurrentTodoTask] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedStatus, setUpdatedStatus] = useState("");
    const [currentEditItem, setCurrentEditItem] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [filteredToDo, setFilteredToDo] = useState([]);
    const navigate = useNavigate();

    const getAllTodos = async () => {
        try {
            let user = getUserDetails();
            console.log(user?.userId);
            // if (!user?.userId) {
            //     throw new Error("Could'nt find user ID");
            // }
            const response = await todoServices.getAllTodos(user?.userId);
            console.log(response.data);
            setAllTodo(response.data);

        } catch (err) {
            console.log(err);
            message.error(getErrorMessage(err));

        }
    }
    useEffect(() => {
        let user = getUserDetails();
        const getAllTodos = async () => {
            try {
                const response = await todoServices.getAllTodos(user?.userId);
                console.log(response.data);
                setAllTodo(response.data);
            } catch (err) {
                console.log(err);
                message.error(getErrorMessage(err));
            };
        };
        if (user && user?.userId) {
            getAllTodos();
        } else {
            navigate('/login');
        };
    }, [navigate]);

    useEffect(() => {
        const incomplete = allTodo.filter((item) => item.isCompleted === false);
        const complete = allTodo.filter((item) => item.isCompleted === true);
        setIncompletedTodo(incomplete);
        setCompletedTodo(complete);
        if (currentTaskType === 'incomplete') {
            setCurrentTodoTask(incomplete);
        } else {
            setCurrentTodoTask(complete);
        };


    }, [allTodo, currentTaskType]);

    const handleSubmitTask = async () => {
        setLoading(true);
        try {
            const userId = getUserDetails()?.userId;
            const data = {
                title,
                description,
                isCompleted: false,
                createdBy: userId
            };
            const response = await todoServices.createTodo(data);
            console.log(response.data);
            setLoading(false);
            message.success("Todo Task Added Successfully !");
            setIsAdding(false);
            getAllTodos();

        } catch (err) {
            console.log(err);
            message.error(getErrorMessage(err));
        };
    };

    const getFormattedDate = (value) => {
        let date = new Date(value);
        let dateString = date.toDateString();
        let hh = date.getHours();
        let min = date.getMinutes();
        let ss = date.getSeconds();
        let finalDate = `${dateString} at ${hh}:${min}:${ss}`;
        return finalDate;
    };

    //EDIT THE ITEM
    const handleEdit = (item) => {
        console.log(item);
        setCurrentEditItem(item);
        setUpdatedTitle(item?.title);
        setUpdatedDescription(item?.description);
        setUpdatedStatus(item?.isCompleted);
        setIsEditing(true);
    }

    // DELETE A TODO
    const handleDelete = async (item) => {
        try {
            const response = await todoServices.deleteTodo(item._id);
            console.log(response.data);
            message.success(`${item.title} is Deleted Successfully`);
            getAllTodos();
        } catch (err) {
            console.log(err);
            message.error(getErrorMessage(err));
        };
    };

    //UPDATE A STATUS OF TODO (COMPLETE OR INCOMP)
    const handleUpdateStatus = async (id, status) => {
        console.log(id);
        try {
            const response = await todoServices.updateTodo(id, { isCompleted: status });
            console.log(response.data);
            message.success("Task Status Updated Successfully !");
            getAllTodos();
        } catch (err) {
            console.log(err);
            message.error(getErrorMessage(err));
        };
    };

    //UPDATE CONTENT OF TASK
    const handleUpdateTask = async () => {
        try {
            setLoading(true);
            const data = {
                title: updatedTitle,
                description: updatedDescription,
                isCompleted: updatedStatus
            };
            console.log(data);
            const response = await todoServices.updateTodo(currentEditItem?._id, data);
            console.log(response.data);
            message.success(`${currentEditItem?.title} Updated Successfully!`);
            setLoading(false);
            setIsEditing(false);
            getAllTodos();
        } catch (err) {
            console.log(err);
            setLoading(false);
            message.error(getErrorMessage(err));
        };
    };

    //HANDLE TYPE CHANGE
    const handleTypeChange = value => {
        console.log(value);
        setCurrentTaskType(value);
        if (value === 'incomplete') {
            setCurrentTodoTask(incompletedTodo);
        } else {
            setCurrentTodoTask(completedTodo);
        };
    };

    //HANDLE SEARCH
    const handleSearch = (e) => {
        let query = e.target.value;
        let filteredList = allTodo.filter((item) => item.title.toLowerCase().match(query.toLowerCase()));
        console.log(filteredList);
        if (filteredList.length > 0 && query) {
            setFilteredToDo(filteredList);
        } else {
            setFilteredToDo([]);
        };
    };


    return (
        <>
        <Navbar  active={"myTask"}/>
        <section className={styles.toDoWrapper}>
            <div className={styles.toDoHeader}>
                <h2>Your Tasks</h2>
                <Input style={{width:'50%'}} onChange={handleSearch} placeholder='Search Your Task Here...' />
                <div>
                  <Button onClick={()=>setIsAdding(true)} type="primary" size="large">Add Task</Button>
                  <Select
                    value={currentTaskType}
                    style={{width:180,marginLeft:'10px'}}
                    onChange={handleTypeChange}
                    size="large"
    
                    options={[
                      {value:"incomplete",label:'Incomplete'},
                      {value:"complete",label:'Complete'}
                    ]}
                  />
    
                 
                </div>
            </div>
            <Divider />
    
            <div className={styles.toDoListCardWrapper}>
              {filteredToDo.length > 0 ? filteredToDo.map((item)=>{
                return(
                  <div key={item?._id} className={styles.toDoCard}>
                  <div >
                  <div className={styles.toDoCardHeader}>
                  <h3>{item?.title}</h3>
                  {item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>}
                  </div> 
                  <p>{item?.description}</p>
                   </div>
                 
                   <div className={styles.toDoCardFooter}>
                   <Tag>{getFormattedDate(item?.createdAt)}</Tag>
                   <div className={styles.toDoFooterAction}>
                   <Tooltip title="Edit Task?"><EditOutlined onClick={()=>handleEdit(item)} className={styles.actionIcon} /></Tooltip>
                     <Tooltip title="Delete Task?"><DeleteOutlined onClick={()=>handleDelete(item)} style={{color:'red'}}   className={styles.actionIcon}/></Tooltip>
                     {item?.isCompleted ? <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={()=>handleUpdateStatus(item._id,false)} style={{color:'green'}}  className={styles.actionIcon} /></Tooltip> :<Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={()=>handleUpdateStatus(item._id,true)}  className={styles.actionIcon}/></Tooltip>}
                   </div>  
                   </div>
                   
               </div>  
                )
              }) : currentTodoTask.length > 0  ? currentTodoTask.map((item)=>{
                return(
                  <div key={item?._id} className={styles.toDoCard}>
                  <div >
                  <div className={styles.toDoCardHeader}>
                  <h3>{item?.title}</h3>
                  {item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>}
                  </div> 
                  <p>{item?.description}</p>
                   </div>
                 
                   <div className={styles.toDoCardFooter}>
                   <Tag>{getFormattedDate(item?.createdAt)}</Tag>
                   <div className={styles.toDoFooterAction}>
                   <Tooltip title="Edit Task?"><EditOutlined onClick={()=>handleEdit(item)} className={styles.actionIcon} /></Tooltip>
                     <Tooltip title="Delete Task?"><DeleteOutlined onClick={()=>handleDelete(item)} style={{color:'red'}}   className={styles.actionIcon}/></Tooltip>
                     {item?.isCompleted ? <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={()=>handleUpdateStatus(item._id,false)} style={{color:'green'}}  className={styles.actionIcon} /></Tooltip> 
                     :<Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={()=>handleUpdateStatus(item._id,true)}  className={styles.actionIcon}/></Tooltip>}
                   </div>  
                   </div>
                   
               </div>  
                )
              }) : 
    
              <div className={styles.noTaskWrapper}>
              <Empty />
            </div> 
              
              }
            </div>
    
           
            <Modal confirmLoading={loading} title="Add New To Do Task" open={isAdding} onOk={handleSubmitTask} onCancel={()=>setIsAdding(false)}>
            <Input style={{marginBottom:'1rem'}} placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} />
            <Input.TextArea placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)} />
          </Modal>
    
          <Modal confirmLoading={loading} title={`Update ${currentEditItem.title}`} open={isEditing} onOk={handleUpdateTask} onCancel={()=>setIsEditing(false)}>
            <Input style={{marginBottom:'1rem'}} placeholder='Updated Title' value={updatedTitle} onChange={(e)=>setUpdatedTitle(e.target.value)} />
            <Input.TextArea style={{marginBottom:'1rem'}} placeholder='Updated Description' value={updatedDescription} onChange={(e)=>setUpdatedDescription(e.target.value)} />
            <Select
          
          onChange={(value)=>setUpdatedStatus(value)}
          value={updatedStatus}
          options={[
            
            {
              value: false,
              label: 'Not Completed',
            },
    
            {
              value: true,
              label: 'Completed',
            },
         
          ]}
        />
          </Modal>
        </section>
        </>
      )
    }
    
export default TodoList;