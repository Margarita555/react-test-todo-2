import { useState, useEffect } from "react";
import AddList from "./components/AddList/AddList";
import List from "./components/List/List";
// import listSvg from './assets/img/list.svg'
// import DB from './assets/db.json';
import Tasks from "./components/Tasks/Tasks";
import axios from 'axios';
import { Route, useHistory, useLocation } from 'react-router-dom';
import {JSON_API} from '../src/helpers/Constants'


function App() {
 
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let history = useHistory();
  let location = useLocation();
  // console.log(lists)
  // console.log(colors)
  
  useEffect(() => {
    axios.get(`${JSON_API}/lists?_expand=color&_embed=tasks`).then(({ data }) => {
    
      setLists(data)
    });
    axios.get(`${JSON_API}/colors`).then(({ data }) => {
     
      setColors(data)
    });
  }, []);
  
  const onAddList = (obj) => {
    const newLists = [...lists, obj];
    setLists(newLists);
  }
  
  const onAddTask = (listId, objTask) => {
    const newLists = lists.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, objTask ]
      }
      return item
    })
    // console.log(newLists)
    setLists(newLists);
  }

  // const onCompletedTask = (listId, taskId, completed) => {
    
  // }

  const onEditListTitle = (id, title) => {
    // console.log(id, title)
    const newLists = lists.map(item => {
      if (item.id === id) {
        item.name = title
      }
      return item
    })
    setLists(newLists);
  }

  
  
  useEffect(() => {
    const listId = history.location.pathname.split('lists/')[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId))
      setActiveItem(list)
      // console.log(list)
    }  
  }, [lists, history.location.pathname])
  

  const onEditTask = (listId, objTask) => {
    console.log(objTask)
    console.log(objTask.id)
    const newTaskText = window.prompt("Текст задачи:", objTask.text);
    if (!newTaskText) {
      return
    }
    const newLists = lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === objTask.id) {
            task.text = newTaskText;
          }
          return task;
        })
      }
      return list;
    })
    setLists(newLists);
    console.log(objTask.id)
    console.log(newTaskText)
    // if(!objTask.id){}
    
    axios.patch(`${JSON_API}/tasks/` + objTask.id, { text: newTaskText })
      .catch(() => {
        alert('Error. The task was not saved. Try again')
      })
    
  }

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("Do you really want to remove the task?")) {
      const newLists = lists.map(item => {
         if(item.id === listId) {
        item.tasks = item.tasks.filter(task => task.id !== taskId)
        }
        return item
      })
      setLists(newLists);

      axios.delete(`${JSON_API}/tasks/` + taskId).catch(() => {
        alert('Error. The task was not deleted')
      }) 
    }
  }

  const onTaskComplete = (listId, taskId, completed) => {
    console.log(completed)
 
    const newLists = lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        })
      }
      return list;
    })
    setLists(newLists);
    
    axios.patch(`${JSON_API}/tasks/` + taskId, { completed })
      .catch(() => {
        alert('Error. The state of the checked task was not saved. Try again')
      })
    
  }

  return (
    <div className="todo">
      <div className="todo__sidebar">
        
        <List
         onClickItem={(list) => {
              history.push(`/`)
            }}
          items={[
          {
              icon: <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.96 5.10001H5.74001C5.24321 5.10001 5.20001 5.50231 5.20001 6.00001C5.20001 6.49771 5.24321 6.90001 5.74001 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74001C5.24321 9.60001 5.20001 10.0023 5.20001 10.5C5.20001 10.9977 5.24321 11.4 5.74001 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74001 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74001C5.24321 0.600006 5.20001 1.00231 5.20001 1.50001C5.20001 1.99771 5.24321 2.40001 5.74001 2.40001ZM2.86001 5.10001H1.24001C0.743212 5.10001 0.700012 5.50231 0.700012 6.00001C0.700012 6.49771 0.743212 6.90001 1.24001 6.90001H2.86001C3.35681 6.90001 3.40001 6.49771 3.40001 6.00001C3.40001 5.50231 3.35681 5.10001 2.86001 5.10001ZM2.86001 9.60001H1.24001C0.743212 9.60001 0.700012 10.0023 0.700012 10.5C0.700012 10.9977 0.743212 11.4 1.24001 11.4H2.86001C3.35681 11.4 3.40001 10.9977 3.40001 10.5C3.40001 10.0023 3.35681 9.60001 2.86001 9.60001ZM2.86001 0.600006H1.24001C0.743212 0.600006 0.700012 1.00231 0.700012 1.50001C0.700012 1.99771 0.743212 2.40001 1.24001 2.40001H2.86001C3.35681 2.40001 3.40001 1.99771 3.40001 1.50001C3.40001 1.00231 3.35681 0.600006 2.86001 0.600006Z" fill="#7C7C7C"/>
</svg>,
              name: 'Все задачи',
              active: history.location.pathname === '/',
            }
        ]}
        />
        {lists ? (
          <List items={lists}
          onRemove={(id) => {
            const newLists = lists.filter(item => item.id !== id);
            setLists(newLists)
          }}
            onClickItem={(list) => {
              history.push(`/lists/${list.id}`)
            }}
          activeItem={activeItem}
        isRemovable
        />) : ('Loading')}
        <AddList onAdd={onAddList} colors={colors }/>
      </div>
      <div className="todo__tasks">
        <Route exact path="/">Все списки:
          {lists &&
            lists.map((list) => (
              <Tasks
                key={list.id}
                list={list}
          onEditTitle={onEditListTitle}      
          onAddTask={onAddTask}
          onRemoveTask={onRemoveTask}
                onEditTask={onEditTask}
                onTaskComplete={onTaskComplete}
          />)
           )
        }
        </Route>
        <Route path="/lists/:id">
        {lists && activeItem &&
          <Tasks list={activeItem}
          onEditTitle={onEditListTitle}      
            onAddTask={onAddTask}
            onRemoveTask={onRemoveTask}
            onEditTask={onEditTask}
            onTaskComplete={onTaskComplete}
          />}
        </Route>

    </div>
    </div>
  );
}

export default App;




// import './App.css';
// import {AppHeader} from './components/Header/Header.module.css'
// import ContactInfo from './components/ContactInfo';
// import Header from './components/Header/Header';
// import MyPhoto from './components/My-photo';
// import Profile from './components/Profile';
// import Skills from './components/Skills';
// import { BrowserRouter, Route } from 'react-router-dom';
// import Addition from './components/Addition';
// import PageTwo from './components/PageTwo';


// const App = () => {
//   return (
//     <BrowserRouter>
//       <div className='App-wrapper'>
//         <div className={AppHeader}>
//           <MyPhoto/>
//           <Header />
//         </div>
        
//         <ContactInfo />
//         <div className="main">
//           <Skills />
//           <div>
//             <Addition/>
//             {/* <Profile /> */}
//             <Route path='/Profile' component={Profile} />
//             <Route path='/PageTwo' component={PageTwo}/>
//           </div>
//         </div>
//       </div>
//     </BrowserRouter>
//   )
// }

