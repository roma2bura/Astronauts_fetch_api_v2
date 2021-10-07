const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getProfiles(json) {
  const profiles = json.people.map(person => {

//adding craft info
    const craft = person.craft;

  if (person.name === "Anatoly Ivanishin") {
      person.name = "Anatoli_Ivanishin"
  }

  return fetch(wikiUrl + person.name)
      .then( response => response.json() )
      .then( profile => {
          return {...profile, craft};
      } )
      .catch( err => console.log('Error fetching Wiki', err) ) // when you hav problem to connect to fetchi.

 });
 return Promise.all(profiles);
}

function generateHTML(data) {
  data.map( astronavt => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    section.innerHTML = `
      <img src=${astronavt.thumbnail.source}>
      <span>${astronavt.craft}</span>
      <h2>${astronavt.title}</h2>
      <p>${astronavt.description}</p>
      <p>${astronavt.extract_html}</p>
     `;
    });
  }
  

btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...'; // to show loading when btn clicked.


  fetch(astrosUrl)
   .then( response => response.json() ) // to access the data and parse to json
   .then(getProfiles)
   .then(generateHTML)
   .catch( err => {
    peopleList.innerHTML = '<h3>smth went wrong.</h3>';
    console.log(err)
   }  )
  .finally( () =>  event.target.remove() )

});