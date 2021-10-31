import React from 'react';
import './Tasks.scss';
import editSvg from '../../assets/img/edit.svg'
import axios from 'axios';
import AddTaskForm from './AddTaskForm';
import Task from './Task';
import { Link } from 'react-router-dom';
import {JSON_API} from '../../helpers/Constants'

export default function Tasks({ list, onEditTitle, onAddTask, onRemoveTask, onEditTask, onTaskComplete }) {
    // console.log(list.tasks)

    const editTitle = () => {
        const newTitle = window.prompt('Название списка', list.name)
        if (newTitle) {
            onEditTitle(list.id, newTitle);
            axios.patch(`${JSON_API}/lists/` + list.id, {
                name: newTitle
            }).catch(() => {alert('Не удалось обновить название списка')})
        }
    };
    return (
        <div className="tasks">
            <Link to={`/lists/${list.id}`} style={{ textDecoration: 'none' }}>
            <h2 style={{color:list.color.hex}} className="tasks__title">{list.name}
                <img onClick={editTitle}
                    src={editSvg} alt="Edit icon" />
            </h2>
            </Link>
            <div className="tasks__items">
                {console.log(list.tasks)}
            {list.tasks && !list.tasks.length && <h2>Задачи  отсутствуют</h2> }
                {list.tasks && list.tasks.map(task => (
                    <Task key={task.id}
                        list={list}
                        onRemove={onRemoveTask}
                        onEdit={onEditTask}
                        onComplete={onTaskComplete}
                        {...task}
                        
                    />
                ))}
                <AddTaskForm key={list.id}
                    list={list}
                    onAddTask={onAddTask} />
                      
            </div>
            
        </div>
    )
}
