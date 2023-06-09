import axios from "axios";


const API = process.env.REACT_APP_API_URL

function CategoryList({category,eventInfo,setEventInfo}){

const removeCategory = () => {
    axios
    .delete(`${API}/events/${eventInfo?.id}/categories/${category.id}`)
    .then(() => {
        axios.get(`${API}/events/${eventInfo?.id}`)
        .then((res) => {
            setEventInfo(res.data)
        })
    })
}



const addCategory = async () => {

    if(eventInfo?.category_names.length < 3){

        axios.post(
               `${API}/events/${eventInfo?.id}/categories`,
               {   
               
                   eventId: eventInfo.id,
                 categoryIds: [category.id] 
               }
             )
             .then(() => {
               axios.get(`${API}/events/${eventInfo?.id}`)
               .then((res) => {
                   setEventInfo(res.data)
               })
           })
    }

    

  };

const categoryName = eventInfo?.category_names.map((category) => {
    return category.name
})


    return(
        <div>   
            {categoryName.includes(category.name) ? 
                <button
                type="button"
                className="inline text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={removeCategory}
            >
                {category.name}
             </button>  :

                     <button
                        type="button"
                        className="inline py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                        onClick={addCategory}
                    >
                        {category.name}
                    </button>          
        }

        </div>
    )
}

export default CategoryList