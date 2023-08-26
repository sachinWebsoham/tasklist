const form_list = document.querySelector('.form_list') ;
const listData = document.querySelector('.listItem');
const list_input = document.getElementById('todoInput');
const remaining = document.getElementById('remain');
const completed = document.getElementById('completed')

const url = "http://localhost:5555/api/list";


let output = '';
const renderItems = (lists) => {
    lists.forEach(list => {
        output += `
        
        <div id="items" data-id=${list._id} class="item d-flex justify-content-between px-2 py-2">
        <div onclick="check('${list._id}','${list.status}')" class="check rounded-circle ${list.status} "> <i  class="fa-solid fa-check  " id="after_update" style="color: #24f915;"></i> </div>
        <div class="inner_text ${list.status}List" id="${list._id}"> ${list.list}</div> 
        <div onclick="remove('${list._id}')" class="close   rounded-circle"><i id="closed" class="fa-solid fa-xmark text-danger"></i> </div>
        </div>
        `;
    } );
    listData.innerHTML = output
    if(output) {
        element = document.getElementById('lists');
        element.style.display = 'block';
    }
    function countActiveItems(lists) {
        let count_left = 0;
        let count_complete = 0;
        for (const item of lists) {
          if (item.status === "active") {
            count_left++;
          } else {
            count_complete++;
          }
        }
        
        return [count_left , count_complete] ;
      }
      const count = countActiveItems(lists);
      console.log(count[0],count[1])
      
      document.querySelector('.incomplete_task').innerHTML = `${count[0]} Task Left`;


}

const remainItems = (lists) => {
    let output = '';
    lists.forEach(list => {
        if (list.status === 'active') {
            output += `
            
            <div id="items" data-id=${list._id} class="item d-flex justify-content-between px-2 py-2">
                <div onclick="check('${list._id}','${list.status}')" class="check rounded-circle ${list.status}"> <i  class="fa-solid fa-check" id="after_update" style="color: #24f915;"></i> </div>
                <div class="inner_text ${list.status}List" id="${list._id}"> ${list.list}</div>  
                <div onclick="remove('${list._id}')" class="close rounded-circle"><i id="closed" class="fa-solid fa-xmark text-danger"></i> </div>
            </div>
            `;
        }
    });

    listData.innerHTML = output;
}
const comItems = (lists) => {
    let output = '';
    lists.forEach(list => {
        if (list.status === 'inactive') {
            output += `
            
            <div id="items" data-id=${list._id} class="item d-flex justify-content-between px-2 py-2">
                <div onclick="check('${list._id}','${list.status}')" class="check rounded-circle ${list.status}"> <i  class="fa-solid fa-check"  id="after_update" style="color: #24f915;"></i> </div>
                <div class="inner_text ${list.status}List" id="${list._id}"> ${list.list}</div>  
                <div onclick="remove('${list._id}')" class="close rounded-circle"><i id="closed" class="fa-solid fa-xmark text-danger"></i> </div>
            </div>
            `;
        }
    });

    listData.innerHTML = output;
}

// update status

const check = (Idd,todo_status) =>{
    // 
    let status_change;
    if(todo_status == 'active') {
         status_change = 'inactive'
    } else if(todo_status == 'inactive') {
         status_change = 'active';
    }
    fetch(`${url}/${Idd}`, {method:'PATCH',headers:{'Content-type':'application/JSON'},body: JSON.stringify({status:status_change})})
            .then(res => res.json())
            .then(() => location.reload())
}




// read all data from api 
// method = GET 
fetch(url)
    .then(res => res.json())
    .then(data => renderItems(data));


// delete from data by id
// method = DELETE
const remove = (id) => {
        fetch(`${url}/${id}`, {
            method:'DELETE'
        } )
         .then(res => res.json())
         .then(()=> location.reload())
      
}

// create data in api
// method = POST

form_list.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/JSON'
        },
        body: JSON.stringify({
            list:list_input.value,
            status:'active'
        })
    })
    .then(res => res.json())
    .then(data => {
        const listArr = [];
        listArr.push(data);
        renderItems(listArr);
        console.log(listArr)
    })
    .then(()=> location.reload())
    list_input.value = ''
})

// show remaining data

remaining.addEventListener('click', (e) => {
    e.preventDefault();
    fetch(url)
    .then(res => res.json())
    .then(data => remainItems(data))
})

//show complete data
completed.addEventListener('click', (e) => {
    e.preventDefault();
    fetch(url)
    .then(res => res.json())
    .then(data => comItems(data))
})

// all show data 
all.addEventListener('click', (e)=>{
    e.preventDefault();
    fetch(url)
    .then(res => res.json())
    .then(()=> location.reload())
    .then(data => renderItems(data))
    
})