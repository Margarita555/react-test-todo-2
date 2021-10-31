import removeSvg from '../../assets/img/cross.svg'
import './List.scss'
import classNames from 'classnames';
import Badge from '../Badge/Badge';
import axios from 'axios';
import {JSON_API} from '../../helpers/Constants'

function List({ items, isRemovable, onClick, onRemove, activeItem, onClickItem }) {
  // console.log(items)
  const removeList = (item) => {
    // if(window.confirm('Do you really want to remove the list?'))
    axios.delete(`${JSON_API}/lists/` + item.id).then(() => {onRemove(item.id)})   
  }


  return <ul onClick={onClick}
    className="list">

    {/* {console.log(items)} */}
    {items.map((item, index) =>
        
      <li 
        key={index}
        className={classNames(item.className, {
        'active': item.active
      ? item.active
              : activeItem && activeItem.id === item.id})
          }
        onClick={onClickItem? () => onClickItem(item) : null}
      >
          
          <i>{item.icon ? item.icon :
            <Badge   color={item.color.name}/> }</i>
 
        <span>{item.name}
        {item.tasks && item.tasks.length > 0 && `(${item.tasks.length})`}</span>
        {isRemovable &&
          <img onClick={() => removeList(item)} className="list__remove-icon" src={removeSvg} alt="Remove icon" />}
          </li>
      )}
         </ul>   
}

export default List;
