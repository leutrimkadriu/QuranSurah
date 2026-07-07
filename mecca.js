const API_KEY = "fOkQwyCu36ELPtCjo57_SmqEzSOE67Fk8maxD5GkNNU";


const cards = document.getElementById("cards");

const input = document.getElementById("searchInput");

const btn = document.getElementById("searchBtn");



const modal = document.getElementById("modal");

const close = document.getElementById("close");


const bigImage = document.getElementById("bigImage");

const title = document.getElementById("title");

const description = document.getElementById("description");





async function searchMecca(place){


cards.innerHTML="Loading...";



const res = await fetch(

`https://api.unsplash.com/search/photos?query=${place}&per_page=20&client_id=${API_KEY}`

);



const data = await res.json();



cards.innerHTML="";



data.results.forEach(photo=>{


const card=document.createElement("div");


card.className="card";


card.innerHTML=`

<img src="${photo.urls.regular}">

<h2>
${photo.alt_description || place}
</h2>
<p> Likes this photo :${photo.likes}</p>
<p> ${photo.user.bio}</p>

<p>
${photo.user.name}
</p>

`;



card.onclick=()=>{


openModal(photo,place);


};



cards.appendChild(card);



});


}





function openModal(photo,place){


modal.style.display="flex";


bigImage.src=photo.urls.regular;


title.innerHTML=place;


description.innerHTML="Loading description...";


getDescription(place);



}





async function getDescription(place){



try{


const res=await fetch(

`https://en.wikipedia.org/api/rest_v1/page/summary/${place}`

);



const data=await res.json();


description.innerHTML=data.extract || 
"No description found";



}

catch{


description.innerHTML=
"No description available";


}


}







btn.onclick=()=>{


if(input.value){

searchMecca(input.value);

}


};





input.addEventListener("keydown",(e)=>{


if(e.key==="Enter"){

searchMecca(input.value);

}


});






close.onclick=()=>{

modal.style.display="none";

};















// LOAD DEFAULT


searchMecca("Mecca");