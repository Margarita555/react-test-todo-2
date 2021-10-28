import React, {useEffect, useState} from "react";
import Badge from "../Badge/Badge";
import List from "../List/List";
import './AddList.scss'
import closeSvg from '../../assets/img/close.svg'
import axios from "axios";


const AddList = ({colors, onAdd}) => {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // console.log(inputValue)
    // console.log(selectedColor)
         
    useEffect(() => {
      if(Array.isArray(colors)){

          selectColor(colors[0].id);
      }
    },[colors])

    const onClose = () => { 
         setVisiblePopup(false);
        setInputValue('');
        selectColor(colors[0].id);     
    }
    
    const addList = () => {
      if (!inputValue) {
            alert('Enter the name')
            return
        }
        // const color = colors.find(c => c.id === selectedColor).name;
        
        axios.delete('http://localhost:3004/lists',
            { name: "ss",
    colorId: "blue",
    id: 7 })
            .then(({ data }) => {
                console.log(data)
            })

        setIsLoading(true);
        axios.post('http://localhost:3004/lists',
            { name: inputValue, colorId: selectedColor })
            .then(({ data }) => {
                const color = colors.find(c => c.id === selectedColor);
                const listObj = { ...data, color, tasks: [] };
                onAdd(listObj);
                onClose();
            })
            .catch(() => {
            alert('Ошибка при добавлении списка')
            })
            .finally(() => {
                setIsLoading(false);
            })              
        
    }

    return (<div className='add-list'>
        <List
            onClick={() => setVisiblePopup(true)}
            items={[
        {
            className: 'list__add-button',
            icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1V15" stroke="#B4B4B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 8H15" stroke="#B4B4B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
            name: 'Добавить список'
        }
    ]}
        />
        {visiblePopup && (
            <div className="add-list__popup">
                <img onClick={onClose}
                    className="add-list__popup-close-btn" src={closeSvg} alt="cross" />
                
                <input onChange={(e) => setInputValue(e.target.value)} className="field" value={inputValue} type="text" placeholder="Название списка" />
                
                <div className="add-list__popup-colors">                    
                    {colors.map(color => (
                        <Badge onClick={() => selectColor(color.id)}
                            key={color.id}
                            color={color.name}
                            className={selectedColor === color.id && 'active'}
                        />
                    ))}
               </div>
                <button onClick={addList} className="button">{isLoading ? 'Loading...' : 'Добавить'}</button>
            </div>)
        }
    </div>   
    );
    
}
        

export default AddList