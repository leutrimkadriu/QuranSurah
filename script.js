

const surahContainer = document.getElementById("surahContainer");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

const topBtn = document.getElementById("topBtn");
const themeBtn = document.getElementById("themeBtn");
// ===============================
// GLOBAL VARIABLES
// ===============================

let surahs = [];

let favorites = JSON.parse(
    localStorage.getItem("favorites")
) || [];


let currentAyahs = [];

let currentIndex = 0;

let currentSurahName = "";


// ===============================
// GET SURAHS
// ===============================

async function getSurahs(){

    loader.style.display="flex";

    try{

        const response = await fetch(
            "https://api.alquran.cloud/v1/surah"
        );
      


        const data = await response.json();


        surahs = data.data;


        displaySurahs(surahs);


    }
    catch(error){

        console.log(error);

    }
    finally{

        loader.style.display="none";

    }

}


getSurahs();



// ===============================
// DISPLAY SURAHS
// ===============================


function displaySurahs(data){


    surahContainer.innerHTML="";


    data.forEach((surah)=>{


        const isFavorite =
        favorites.includes(surah.number);



        surahContainer.innerHTML += `


        <div class="card">


            <i 
            class="fa-solid fa-heart favorite 
            ${isFavorite ? "active-heart":""}"
            onclick="addFavorite(event,${surah.number})">
            </i>



            <div onclick="openSurah(${surah.number})">


                <div class="number">

                    ${surah.number}

                </div>


                <h2>

                    ${surah.englishName}

                </h2>


                <h3>

                    ${surah.name}

                </h3>


                <div class="info">


                    <span>

                    ${surah.numberOfAyahs} Verses

                    </span>


                    <span>

                    ${surah.revelationType}

                    </span>


                </div>


            </div>


        </div>


        `;


    });


}




// ===============================
// SEARCH
// ===============================


searchInput.addEventListener("input",()=>{


    const value =
    searchInput.value.toLowerCase();



    const filtered =
    surahs.filter((surah)=>{


        return (

            surah.englishName
            .toLowerCase()
            .includes(value)


            ||

            surah.name
            .includes(value)


        );


    });



    displaySurahs(filtered);


});




// ===============================
// OPEN SURAH + AYAH
// ===============================


async function openSurah(number){


    modal.style.display="flex";


    modalBody.innerHTML=
    "<h2>Loading...</h2>";



    const response =
    await fetch(
    `https://api.alquran.cloud/v1/surah/${number}`
    );



    const data =
    await response.json();



    const surah =
    data.data;



    // RUAJ AJETET
    currentAyahs =
    surah.ayahs;



    currentSurahName =
    surah.englishName;



    let html = `


    <h1>

    ${surah.englishName}

    </h1>


    <h2 style="
    font-family:Amiri;
    text-align:center;
    margin:25px;
    ">

    ${surah.name}

    </h2>


    `;



    surah.ayahs.forEach((ayah)=>{


        html += `


        <div class="ayah-box">


            <h3 class="arabic">


            ${ayah.text}


            </h3>



            <p>


            Ayah ${ayah.numberInSurah}


            </p>



        </div>


        `;


    });



    modalBody.innerHTML = html;



    // FILLON AUTOMATIKISHT AJETIN E PARE
    playAyah(0);



}
// ===============================
// CLOSE MODAL
// ===============================

closeModal.onclick = ()=>{

    modal.style.display="none";

};



window.onclick=(e)=>{

    if(e.target === modal){

        modal.style.display="none";

    }

};




// ===============================
// SCROLL TOP BUTTON
// ===============================


window.addEventListener("scroll",()=>{


    if(window.scrollY > 400){

        topBtn.style.display="block";

    }
    else{

        topBtn.style.display="none";

    }


});



topBtn.onclick=()=>{


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


};




// ===============================
// DARK / LIGHT MODE
// ===============================


themeBtn.onclick=()=>{


    document.body.classList.toggle("light");


};




// ===============================
// FAVORITES
// ===============================


function addFavorite(event,id){


    event.stopPropagation();



    if(favorites.includes(id)){


        favorites =
        favorites.filter(
            item=>item !== id
        );


    }
    else{


        favorites.push(id);


    }



    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );



    displaySurahs(surahs);


}





const favoritesBtn =
document.getElementById("favoritesBtn");



favoritesBtn.onclick=()=>{


    const favoriteSurahs =
    surahs.filter(
        surah =>
        favorites.includes(surah.number)
    );



    displaySurahs(favoriteSurahs);



};




// ===============================
// AUDIO PLAYER
// ===============================


const audio =
document.getElementById("audio");


const playBtn =
document.getElementById("playBtn");


const nextBtn =
document.getElementById("nextAyah");


const prevBtn =
document.getElementById("prevAyah");


const audioTitle =
document.getElementById("audioTitle");


const audioNumber =
document.getElementById("audioNumber");


const volume =
document.getElementById("volume");





// ===============================
// PLAY AYAH
// ===============================


async function playAyah(index){



    if(!currentAyahs.length){

        return;

    }



    const ayah =
    currentAyahs[index];



    currentIndex = index;



    try{


        const response =
        await fetch(

        `https://api.alquran.cloud/v1/ayah/${ayah.number}/ar.alafasy`

        );



        const data =
        await response.json();




        audio.src =
        data.data.audio;



        audio.play();




        audioTitle.innerHTML =
        currentSurahName;



        audioNumber.innerHTML =
        "Ayah " + ayah.numberInSurah;




        playBtn.innerHTML =

        `
        <i class="fa-solid fa-pause"></i>
        `;



    }

    catch(error){

        console.log(error);

    }



}





// ===============================
// PLAY / PAUSE BUTTON
// ===============================


playBtn.onclick=()=>{


    if(audio.paused){


        audio.play();



        playBtn.innerHTML=

        `
        <i class="fa-solid fa-pause"></i>
        `;


    }
    else{


        audio.pause();



        playBtn.innerHTML=

        `
        <i class="fa-solid fa-play"></i>
        `;


    }



};




// ===============================
// NEXT AYAH
// ===============================


nextBtn.onclick=()=>{


    if(
    currentIndex < currentAyahs.length-1
    ){


        playAyah(
            currentIndex + 1
        );


    }


};





// ===============================
// PREVIOUS AYAH
// ===============================


prevBtn.onclick=()=>{


    if(currentIndex > 0){


        playAyah(

            currentIndex - 1

        );


    }


};




// ===============================
// VOLUME
// ===============================


volume.oninput=()=>{


    audio.volume =
    volume.value;


};




// ===============================
// WHEN AUDIO ENDS
// NEXT AUTOMATICALLY
// ===============================


audio.onended=()=>{


    if(
    currentIndex < currentAyahs.length-1
    ){


        playAyah(
            currentIndex + 1
        );


    }


};