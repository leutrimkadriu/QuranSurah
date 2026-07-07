const API_KEY = "fOkQwyCu36ELPtCjo57_SmqEzSOE67Fk8maxD5GkNNU";


const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const cards = document.getElementById("cards");



async function searchPhotos(query){


cards.innerHTML = "Loading...";


const res = await fetch(
`https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=${API_KEY}`
);


const data = await res.json();



cards.innerHTML="";



data.results.forEach(photo=>{


cards.innerHTML += `

<div class="card">


<img src="${photo.urls.regular}">


<h2>${photo.alt_description || query}</h2>


<p>
Photo by ${photo.user.name}
</p>


</div>


`;


});


}





btn.addEventListener("click",()=>{


const value=input.value;


if(value){

searchPhotos(value);

}


});



input.addEventListener("keydown",(e)=>{


if(e.key==="Enter"){

searchPhotos(input.value);

}


});
