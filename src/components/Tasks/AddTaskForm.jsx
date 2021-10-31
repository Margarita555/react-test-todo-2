import React, { useState } from 'react'
import './Tasks.scss';
import addSvg from '../../assets/img/add.svg'
import axios from 'axios';
import {JSON_API} from '../../helpers/Constants'

export default function AddTaskForm({list, onAddTask}) {
    const [visibleForm, setVisibleForm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibleForm = () => {
        setVisibleForm(!visibleForm);
        setInputValue('');
    }
    
    const AddTask = () => {
        console.log(list.id)
        const obj = {
            "listId": list.id,
            "text": inputValue,
            "completed": false
           
        }
        setIsLoading(true)
        axios.post(`${JSON_API}/tasks`, obj).then((data) => {
            console.log(data)
            onAddTask(list.id, data.data)
            toggleVisibleForm()
        }).catch(() => {
            alert('Ошибка при добавлении задачи')
        }).finally(() => {
            setIsLoading(false);
        })
    }

    return (
        <div className="tasks__form">
            {!visibleForm ? 
            (<div onClick={toggleVisibleForm} className="tasks__form-new">
                <img src={addSvg} alt="Add icon" />
                <span >Новая задача</span>
            </div>) :
            (<div className="tasks__form-block">
                    <input onChange={(e) => setInputValue (e.target.value)} value={inputValue}
                        className="field" type="text" placeholder="Текст задачи" />
                
                    <button onClick={AddTask}
                        className="button" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Добавить задачу"}</button>
                <button  onClick={toggleVisibleForm}className="button button--grey">Отмена</button>
            </div>)
            }
        </div>
    )
}

